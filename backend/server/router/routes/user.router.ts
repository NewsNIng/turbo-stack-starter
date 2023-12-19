// import { prisma } from "../../db";
import { createTRPCRouter, publicProcedure } from "../trpc";

const userRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    // console.log("prisma", prisma);
    return [123];
  }),
});

export default userRouter;
