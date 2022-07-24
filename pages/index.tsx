import type { NextPage } from "next";

import { Layout } from "@/components";
import { Contact, Features, GetStarted, Hero } from "@/components/_page/Home";

const Home: NextPage = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <GetStarted />
      <Contact />
    </Layout>
  );
};

export default Home;
