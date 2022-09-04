import React, { useState, useEffect } from "react";

import { Whiteboard as WhiteboardComponent } from "@/components/_page/Whiteboard";
import fetchAPI from "@/utils/fetch";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

const Whiteboard = () => {
  const { userData } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<any>([]);
  const [code, setCode] = useState<string>("");

  console.log("router id,", router);

  useEffect(() => {
    const getContents = async () => {
      if (userData && router.query.id) {
        console.log("gettinnngg");
        const res = await fetchAPI(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT as string}content/${
            userData?.data.user._id
          }/getOneUserContent/${router?.query?.id}`,
          "GET"
        );

        if (res) {
          console.log("res", res.data.data);
          setData(res.data.data.content);
          setCode(res.data.data.code);
        }
      }
    };

    getContents();
  }, [userData, router.query.id]);

  return (
    <section className="h-screen w-screen">
      <WhiteboardComponent data={data} code={code} />
    </section>
  );
};

export default Whiteboard;
