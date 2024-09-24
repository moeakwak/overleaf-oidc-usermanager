import { type NextRequest, NextResponse } from "next/server";
import { getOAuth2Client } from "@/server/oidc";
import { generateState } from "oslo/oauth2";
import { env } from "@/env";

export async function GET(_request: NextRequest) {
  try {
    const client = getOAuth2Client();

    const state = generateState();
    const authorizationUrl = await client.createAuthorizationURL({
      state,
      scopes: env.OIDC_SCOPES.split(" "),
    });
    // console.debug("generated OIDC", { state, authorizationUrl });

    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set(env.COOKIE_PREFIX + "_oidc_state", state, {
      path: "/",
      secure: env.SECURE_COOKIE,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error in OIDC login:", error);
    return NextResponse.json({ error: "Error in OIDC login" }, { status: 500 });
  }
}
