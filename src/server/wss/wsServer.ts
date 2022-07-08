import ws from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "../router";
import { createContext } from "../router/context";
const wss = new ws.Server({
  port: 3005,
});
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on("connection", (ws) => {
  console.log(`+++++++ Connection (${wss.clients.size})`);
  ws.on("error", (err) => {
    console.log(err);
  });
  ws.once("close", () => {
    console.log(`------- Connection (${wss.clients.size})`);
  });
});

console.log("✅ WebSocket Server listening on ws://localhost:3005");

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
