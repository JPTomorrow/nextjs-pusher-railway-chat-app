// src/server/router/context.ts
import * as trpc from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";

// import * as trpcNext from "@trpc/server/adapters/next";
// ?: trpcNext.CreateNextContextOptions

export const createContext = (opts: any) => {
  const req = opts?.req;
  const res = opts?.res;

  return {
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
