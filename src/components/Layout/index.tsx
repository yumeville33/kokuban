import React from "react";
import { useTranslation } from "react-i18next";

import Footer from "../Footer";
import Navbar from "../Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { i18n } = useTranslation();

  return (
    <>
      <Navbar />
      <main
        className={`mx-auto my-0 ${
          i18n.language === "en" ? "font-enSans" : "font-jaSans"
        }`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
