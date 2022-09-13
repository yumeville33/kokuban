import React, { useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { useAuth } from "@/contexts/AuthContext";
import fetchAPI from "@/utils/fetch";
import { Card } from "@/components/_page/Content";
import { Layout } from "@/components";

const MyContent = () => {
  const router = useRouter();
  const { userData } = useAuth();
  const [data, setData] = useState<any>([]);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

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

  useLayoutEffect(() => {
    const getContents = async () => {
      try {
        const res = await fetchAPI(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT as string}contents/${
            userData?.data.user._id
          }/getUserContent`,
          "GET"
        );

        if (res.status === "success") {
          setData(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (userData) {
      getContents();
    }

    setDataFetched(true);
  }, [userData]);

  const handleDeleteContent = async () => {
    try {
      const res = await fetchAPI(
        `${
          process.env.NEXT_PUBLIC_API_ENDPOINT as string
        }contents/delete/${selectedContent}`,
        "PATCH"
      );

      if (res.status === "success") {
        setData(data.filter((item: any) => item._id !== selectedContent));
        setSelectedContent(null);
        toast.success("Content deleted successfully");
      } else {
        toast.error("Something went wrong! Cannot delete content.");
      }
    } catch (error) {
      toast.error("Something went wrong! Cannot delete content.");
      // setSelectedContent(null);
    }
  };

  return (
    <div>
      {userData && (
        <Layout>
          <main className="relative mx-auto min-h-[calc(100vh-100px)] max-w-[2560px] px-10 md:px-20">
            <h2 className="mb-5 text-2xl font-bold text-gray-800">Projects</h2>
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
                      onOptionClick={() => {
                        if (selectedContent === item._id) {
                          setSelectedContent(null);
                        } else {
                          setSelectedContent(item._id);
                        }
                      }}
                      isOptionOpen={selectedContent === item._id}
                      onDelete={handleDeleteContent}
                    >
                      <Image src={item.thumbnail.uri} layout="fill" />
                    </Card>
                  </div>
                ))}
            </div>
          </main>
        </Layout>
      )}
    </div>
  );
};

export default MyContent;
