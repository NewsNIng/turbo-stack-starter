import { prisma } from "../../db";
import { createTRPCRouter, publicProcedure } from "../trpc";

const userRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    // console.log("prisma", prisma);
    const count = await prisma.user.count()
    return ['user count: ', count];
  }),
});

export default userRouter;
