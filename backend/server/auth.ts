import { getServerSession } from "next-auth";

import { NextAuthPrismaAdapter } from "./adapter/NextAuthPrismaAdapter";
import { prisma } from "./db";

import type { GetServerSidePropsContext } from "next";
import type { NextAuthOptions } from "next-auth";

export const getAuthOptions = () => {
  return {
    adapter: NextAuthPrismaAdapter(prisma),
    providers: [
      // ...add more providers here
    ],
  } as unknown as NextAuthOptions;
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, getAuthOptions());
};
