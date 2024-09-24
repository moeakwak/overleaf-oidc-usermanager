import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc";
import { AdminUserLoginFormSchema } from "@/server/schema";
import { lucia } from "@/server/lucia";
import { cookies } from "next/headers";
import { env } from "@/env";
import { userStorage } from "@/server/db";

export const authRouter = createTRPCRouter({
  // adminLoginByPassword: publicProcedure.input(AdminUserLoginFormSchema).mutation(async ({ ctx, input }) => {
  //   if (env.ENABLE_ADMIN_PASSWORD_LOGIN === false) {
  //     throw new TRPCError({ code: "UNAUTHORIZED", message: "Password login is disabled" });
  //   }
  //   const { email, password } = input;
    
  //   if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
  //     throw new TRPCError({ code: "UNAUTHORIZED", message: "Wrong username or password" });
  //   }

  //   const user = await userStorage.getItem(email);

  //   if (!user) {
  //     await userStorage.setItem(email, {
  //       id: email,
  //       attributes: {
  //         email,
  //         role: "ADMIN"
  //       },
  //     });
  //   }
    
  //   const session = await lucia.createSession(email, {
  //     email,
  //     role: "ADMIN"
  //   });
  //   const sessionCookie = lucia.createSessionCookie(session.id);
  //   cookies().set(sessionCookie);
  // }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    const session = ctx.session;
    if (session) {
      await lucia.invalidateSession(session.id);
      cookies().delete(lucia.sessionCookieName);
    }
  }),
});
