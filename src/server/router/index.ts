// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

// import { exampleRouter } from "./example";
import { chatRouter } from "./chatRouter";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("chat.", chatRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
