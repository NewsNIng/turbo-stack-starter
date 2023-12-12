import { createServer } from "http";

import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import cors from "cors";

import { appRouter } from "./router";

import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { createTRPCContext } from "./router/trpc";

const handler = createHTTPHandler({
  middleware: cors(),
  router: appRouter,
  createContext({ req, res }: CreateHTTPContextOptions) {
    return createTRPCContext({
      req: Object.assign(req, {
        cookies: {} as any,
      }),
      res,
    });
  },
});

const server = createServer((req, res) => {
  handler(req, res);
});

server.listen(3300);

console.log("Listening on http://localhost:3300");
