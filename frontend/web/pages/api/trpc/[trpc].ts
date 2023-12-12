import { appRouter } from "@backend/server";
import { createTRPCContext } from "@backend/server/router/trpc";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
