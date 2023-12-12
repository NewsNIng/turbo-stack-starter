import type { AppRouter } from "@backend/server";
import { httpBatchLink, httpLink, loggerLink, splitLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

const getTRPCApiUrl = () => {
  // return `http://localhost:3300`;
  // browser should use relative url
  if (typeof window !== "undefined") {
    return "/api/trpc";
  }
  // SSR should use vercel url
  // if (process.env.VERCEL_URL) {
  //   return `https://${process.env.VERCEL_URL}`;
  // }
  return `http://localhost:${process.env.PORT ?? 3000}/api/trpc`; // dev SSR should use localhost
};

export const getCommonHeaders = () => {
  return {};
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    const url = getTRPCApiUrl();
    return {
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       **/
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       * */
      links: [
        loggerLink(),
        splitLink({
          condition: (op) => op.context.skipBatch === true,
          true: httpLink({
            url,
            headers: getCommonHeaders,
          }),
          false: httpBatchLink({ url, headers: getCommonHeaders }),
        }),
      ],

      abortOnUnmount: true,
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
