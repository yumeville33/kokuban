import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import fetchAPI from "@/utils/fetch";
import { APP_NAME } from "@/constants";
import { Card } from "@/components/_page/Content";
import { useRouter } from "next/router";

const Answers = () => {
  const { userData } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const getContents = async () => {
      const res = await fetchAPI(
        `${
          process.env.NEXT_PUBLIC_API_ENDPOINT as string
        }students/answer-board/${router.query.contentId}`,
        "GET"
      );

      if (res.status === "success") {
        setData(res.data.studentAnswers);
      }
    };

    if (userData && router.query.contentId) {
      getContents();
    }
  }, [userData, router.query.contentId]);

  return (
    <div className="h-[100vh]">
      <header className="mx-auto flex h-[100px] max-w-[2560px] items-center px-10 md:px-20">
        <nav className="flex w-full items-center justify-between">
          <Link href="/">
            <h1 className="text-3xl font-bold text-gray-800">{APP_NAME}</h1>
          </Link>
          <div className="flex">
            <div className="text-xl font-bold text-gray-800">
              {userData?.data.user.email.split("@")[0]}
            </div>
          </div>
        </nav>
      </header>
      <main className="relative mx-auto h-full max-w-[2560px] px-10 md:px-20">
        <h2 className="text-2xl font-bold text-gray-800">Student answers</h2>
        <div className="mt-3 flex">
          {/* <Card className="flex items-center justify-center bg-neutral-300">
            <AiOutlinePlus className="h-10 w-10 text-neutral-500" />
          </Card> */}
          {/* {data && data.length > 0 && (
            <Image src={data[0].thumbnail.uri} layout="fill" />
          )} */}
          {data &&
            data.length > 0 &&
            data.map((item: any) => (
              <div key={item._id} className="ml-4">
                <Card
                  className="relative"
                  id={`/answers/${router?.query?.contentId}/${item._id}`}
                  date={item.updatedAt}
                  name={item.studentName}
                  grade={item.grade}
                  section={item.studentSection}
                  school={item.schoolName}
                >
                  <Image src={item?.image?.uri} layout="fill" />
                </Card>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Answers;
