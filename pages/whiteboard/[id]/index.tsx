import React, { useState, useEffect } from "react";

import { Whiteboard as WhiteboardComponent } from "@/components/_page/Whiteboard";
import fetchAPI from "@/utils/fetch";
import { useRouter } from "next/router";

const Whiteboard = () => {
  const router = useRouter();

  const [data, setData] = useState<any>([]);
  const [code, setCode] = useState<string>("");
  const [boardOwner, setBoardOwner] = useState<string>("");

  useEffect(() => {
    const getContents = async () => {
      if (router.query) {
        const res = await fetchAPI(
          `${
            process.env.NEXT_PUBLIC_API_ENDPOINT as string
          }content/getOneUserContent/${router?.query?.id}`,
          "GET"
        );

        console.log("res", res);

        if (res) {
          setData(res?.data?.data?.content);
          setCode(res?.data?.data?.code);
          setBoardOwner(res?.data?.data?.user);
        }
      }
    };

    getContents();
  }, [router.query]);

  return (
    <section className="h-screen w-screen">
      <WhiteboardComponent data={data} code={code} boardOwner={boardOwner} />
    </section>
  );
};

export default Whiteboard;
