// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import "../styles/globals.css";
import { httpLink } from "@trpc/client/links/httpLink";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

import { createWSClient, wsLink } from "@trpc/client/links/wsLink";

function createWebsocketLink() {
  if (typeof window === "undefined") {
    const url = `${getBaseUrl()}/api/trpc`;
    return httpLink({
      url: url,
    });
  }

  const wsClient = createWSClient({
    url: `ws://localhost:3005`,
  });

  return wsLink<AppRouter>({
    client: wsClient,
  });
}

// IT IS IMPORTANT TO HAVE A SINGLE INSTANCE OF THIS IF YOU DONT WANT TO GET result.onerror is undefined
// const wscLink = createWebsocketLink();

// import { splitLink } from "@trpc/client/links/splitLink";

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      // UNCOMMENT TO LINK WEBSOCKET UP AGAIN
      // links: [
      //   splitLink({
      //     condition(op) {
      //       return op.type === "subscription";
      //     },
      //     true: wscLink,
      //     false: httpLink({ url }),
      //   }),
      // ],
    };
  },
  ssr: false,
})(MyApp);
