import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="mx-auto my-0">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
