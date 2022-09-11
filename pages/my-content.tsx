import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";

import { useAuth } from "@/contexts/AuthContext";
import fetchAPI from "@/utils/fetch";
import { APP_NAME } from "@/constants";
import { Card } from "@/components/_page/Content";

const MyContent = () => {
  const { userData } = useAuth();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const getContents = async () => {
      const res = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT as string}contents/${
          userData?.data.user._id
        }/getUserContent`,
        "GET"
      );

      if (res) {
        setData(res.data.data);
      }
    };

    if (userData) {
      getContents();
    }
  }, [userData]);

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
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
        <div className="mt-3 flex">
          <Card
            className="flex items-center justify-center bg-neutral-300"
            id="/whiteboard"
          >
            <AiOutlinePlus className="h-10 w-10 text-neutral-500" />
          </Card>
          {/* {data && data.length > 0 && (
            <Image src={data[0].thumbnail.uri} layout="fill" />
          )} */}
          {data &&
            data.length > 0 &&
            data.map((item: any) => (
              <div key={item._id} className="ml-4">
                <Card
                  className="relative"
                  id={`/whiteboard/${item._id}`}
                  date={item.updatedAt}
                  name={item.title}
                >
                  <Image src={item.thumbnail.uri} layout="fill" />
                </Card>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default MyContent;
