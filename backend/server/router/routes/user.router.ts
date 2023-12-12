import { createTRPCRouter, publicProcedure } from "../trpc";

const userRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return [1, 2, 3];
  }),
});

export default userRouter;
