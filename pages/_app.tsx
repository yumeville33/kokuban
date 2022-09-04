import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "@/contexts";
import "../styles/globals.css";

import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
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
