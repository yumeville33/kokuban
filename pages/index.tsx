import type { NextPage } from "next";

import Layout from "@/components/Layout";
import { Hero } from "@/components/_page/Home";

const Home: NextPage = () => {
  return (
    <Layout>
      <Hero />
    </Layout>
  );
};

export default Home;
