import { type NextRequest, NextResponse } from "next/server";
import { getOAuth2Client } from "@/server/oidc";
import { cookies } from "next/headers";
import { env } from "@/env";
import { z } from "zod";
import { OAuth2RequestError } from "oslo/oauth2";
import { lucia } from "@/server/lucia";
import { userStorage } from "@/server/db";

const OIDCUserInfoSchema = z.object({
  sub: z.string(),
  email: z.string(),
  email_verified: z.boolean().optional(),
  name: z.string().optional(),
  [env.OIDC_USERNAME_CLAIM]: z.string(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get("state");
  const code = searchParams.get("code");
  const storedState = cookies().get(env.COOKIE_PREFIX + "_oidc_state")?.value;

  // console.debug("OIDC callback", { state, code, storedState });

  if (!storedState || !state || storedState !== state || !code) {
    return NextResponse.json({ error: "Invalid callback parameters" }, { status: 400 });
  }

  const client = getOAuth2Client();

  try {
    const tokenResponse = await client.validateAuthorizationCode(code, {
      credentials: env.OIDC_CLIENT_SECRET!,
      authenticateWith: "http_basic_auth",
    });

    cookies().delete(env.COOKIE_PREFIX + "_oidc_state");

    // console.debug("OIDC Token Response:", tokenResponse);

    const accessToken = tokenResponse.access_token;

    const response = await fetch(env.OIDC_USERINFO_URI!, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userInfo = OIDCUserInfoSchema.parse(await response.json());
    // console.debug("OIDC UserInfo:", userInfo);

    const email = userInfo.email as string;
    if (!email) {
      return NextResponse.json({ error: "Email not found in OIDC userinfo" }, { status: 400 });
    }
    let user = await userStorage.getItem(email);

    if (!user) {
      await userStorage.setItem(email, {
        id: email,
        attributes: {
          email,
          role: env.ADMIN_EMAIL === email ? "ADMIN" : "USER",
        },
      });
    }

    const session = await lucia.createSession(email, {
      email,
      role: "USER",
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie);

    return NextResponse.redirect(new URL(env.BASE_URL));
  } catch (error) {
    console.error("Error in OIDC callback:", error);
    if (error instanceof OAuth2RequestError) {
      return NextResponse.json({ error: "OAuth2RequestError: " + error.message }, { status: 400 });
    } else if (error instanceof z.ZodError) {
      return NextResponse.json({ error }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
