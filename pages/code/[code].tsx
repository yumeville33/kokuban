import React from "react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import fetchAPI from "@/utils/fetch";

const CodeComponent = () => {
  const router = useRouter();

  React.useEffect(() => {
    setTimeout(() => {
      router.replace("/404");
    }, 3000);
  }, []);

  return null;
};

export default CodeComponent;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { code } = context.params as { code: string };

  const res = await fetchAPI(
    `${
      process.env.NEXT_PUBLIC_API_ENDPOINT as string
    }content/${code}/getOneContent`,
    "GET"
  );

  if (res.status !== "success") {
    return {
      props: {},
      redirect: {
        destination: "/404",
        statusCode: 301,
      },
    };
  }

  const destination = `/whiteboard/${res.data.data._id}`;

  return {
    props: {
      data: "data received",
    },
    redirect: {
      destination,
      statusCode: 301,
    },
  };
};
