import React, { useState, useEffect } from "react";

import { Whiteboard as WhiteboardComponent } from "@/components/_page/Whiteboard";
import fetchAPI from "@/utils/fetch";
import { useRouter } from "next/router";

export interface OtherDataType {
  code: string;
  thumbnail: {
    uri: string;
    extensionType: string;
  };
  user: string;
  _id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  title: string;
}

const Whiteboard = () => {
  const router = useRouter();

  const [data, setData] = useState<any>([]);
  const [otherData, setOtherData] = useState<OtherDataType>(
    {} as OtherDataType
  );

  useEffect(() => {
    const getContents = async () => {
      if (router.query) {
        const res = await fetchAPI(
          `${
            process.env.NEXT_PUBLIC_API_ENDPOINT as string
          }contents/getOneUserContent/${router?.query?.id}`,
          "GET"
        );

        if (res.status === "success") {
          setData(res?.data?.data?.content);
          const otherData = {
            ...res?.data?.data,
          };
          delete otherData.content;

          setOtherData(otherData as OtherDataType);
        } else {
          // router.push("/whiteboard");
        }
      }
    };

    getContents();
  }, [router.query]);

  return (
    <section className="h-screen w-screen">
      <WhiteboardComponent otherData={otherData} data={data} />
    </section>
  );
};

export default Whiteboard;
