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
}

const StudentAnswer = () => {
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
          }students/answer-board-one/${router?.query?.answerId}`,
          "GET"
        );

        if (res.status === "success") {
          setData(res?.data?.studentAnswer?.content);
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

export default StudentAnswer;
