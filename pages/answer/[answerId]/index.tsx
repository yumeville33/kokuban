import React, { useState, useEffect } from "react";

import { Whiteboard as WhiteboardComponent } from "@/components/_page/Whiteboard";
import fetchAPI from "@/utils/fetch";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export interface OtherDataType {
  code: string;
  thumbnail: {
    url: string;
    extensionType: string;
  };
  user: string;
  _id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  title: string;
}

const StudentAnswer = () => {
  const router = useRouter();
  const { userData } = useAuth();

  const [data, setData] = useState<any>([]);
  const [otherData, setOtherData] = useState<OtherDataType>(
    {} as OtherDataType
  );

  const [dataFetched, setDataFetched] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!userData && dataFetched) {
        router.push("/auth");
      }
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [userData, dataFetched]);

  useEffect(() => {
    const getContents = async () => {
      if (router.query) {
        try {
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
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    getContents();
    setDataFetched(true);
  }, [router.query]);

  return (
    <div>
      {userData && (
        <section className="h-screen w-screen">
          <WhiteboardComponent otherData={otherData} data={data} />
        </section>
      )}
    </div>
  );
};

export default StudentAnswer;
