import { type AppType } from "next/dist/shared/lib/utils";
import { api } from "../utils/api";

import { SessionProvider } from "next-auth/react";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(App);
