import { createTRPCRouter, publicProcedure } from "../trpc";

const userRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return [1231231231233];
  }),
});

export default userRouter;
