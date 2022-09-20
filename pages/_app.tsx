import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { DefaultSeo } from "next-seo";

import { AuthProvider } from "@/contexts";
import SEO from "../next-seo.config";
import "../styles/globals.css";
import "../src/utils/i18n";

import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DefaultSeo {...SEO} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
