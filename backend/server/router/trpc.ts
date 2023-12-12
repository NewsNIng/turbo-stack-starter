import { initTRPC } from "@trpc/server";

import type { IncomingHttpHeaders } from "http";
import { GetServerSidePropsContext } from "next";

import { Session } from "next-auth";
import superjson from "superjson";
// import { getServerAuthSession } from "./auth/nextjs";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const publicProcedure = t.procedure;

interface CreateContextOptions {
  session: Session | null;
  headers: {} & IncomingHttpHeaders;
  req: GetServerSidePropsContext["req"];
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    headers: opts.headers,
    // prisma,
    req: opts.req,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to
 * process every request that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  // const session = await getServerAuthSession({ req, res });

  const headers = req.headers;

  return createInnerTRPCContext({
    session: null,
    headers,
    req,
  });
};
