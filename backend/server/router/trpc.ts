import { TRPCError, initTRPC } from "@trpc/server";
import { type Session } from "next-auth";
import superjson from "superjson";

import { getServerAuthSession } from "../auth";

import type { IncomingHttpHeaders } from "http";
import type { GetServerSidePropsContext } from "next";
import type { DefaultSession, DefaultUser } from "next-auth";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
      text: string;
      emailVerified: Date | null;
    } & DefaultSession["user"];
    type: number;
    deviceId: string;
  }

  interface User extends DefaultUser {
    emailVerified: Date | null;
    type: number;
    deviceId: string | null;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}
interface CreateContextOptions {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}

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

/**
 * This is the actual context you will use in your router. It will be used to
 * process every request that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateContextOptions) => {
  const { req, res } = opts;
  const session = await getServerAuthSession({ req, res });
  return {
    session,
    req,
  };
};

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure.
 */
const enforceUserAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "user unauthorized",
    });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserAuthed);
