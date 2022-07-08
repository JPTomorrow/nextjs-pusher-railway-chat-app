// THIS IS AN EXAMPLE tRPC ROUTER API endpoints

import { createRouter } from "./context";
import { z } from "zod";
import { Subscription } from "@trpc/server";

interface Message {
  id: number;
  user?: string;
  content?: string;
}

// source of all messages
const messages: Message[] = [];

import { EventEmitter } from "events";

// create a global event emitter (could be replaced by redis, etc)
const ee = new EventEmitter();

export const chatRouter = createRouter()
  .subscription("onAddMessage", {
    resolve({ ctx }) {
      // `resolve()` is triggered for each client when they start subscribing `onAdd`
      console.log("subscription started");

      // return a `Subscription` with a callback which is triggered immediately
      return new Subscription<Message[]>((emit) => {
        const onAdd = (data: Message) => {
          // emit data to client
          console.log("subscription onAdd from ", data.user);
          messages.push(data);
          emit.data(messages);
        };

        // trigger `onAdd()` when `add` is triggered in our event emitter
        ee.on("addMessage", onAdd);

        // unsubscribe function when client disconnects or stops subscribing
        return () => {
          ee.off("addMessage", onAdd);
        };
      });
    },
  })
  .mutation("addMessage", {
    input: z.object({
      user: z.string().optional(),
      content: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const msgID = messages.length;
      const message = {
        id: msgID,
        ...input,
      }; /* [..] add to db */
      console.log(`adding message from ${message.user}`);
      ee.emit("addMessage", message);
      return message;
    },
  });
