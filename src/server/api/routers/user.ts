
import { createTRPCRouter, adminProcedure, protectedProcedure } from "@/server/trpc";

export const userRouter = createTRPCRouter({
  getSelf: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.userAttr;
    return user;
  }),
});
