import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/contexts/AuthContext";
import fetchAPI from "@/utils/fetch";
import { Card } from "@/components/_page/Content";
import { Layout } from "@/components";
import Link from "next/link";

const MyContent = () => {
  const router = useRouter();
  const { userData } = useAuth();
  const { t, i18n } = useTranslation();

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

  useEffect(() => {
    const getContents = async () => {
      try {
        const res = await fetchAPI(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT as string}contents/${
            userData?.data.user._id
          }/getUserContent/no/`,
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
        toast.success(t("content-msg-success-1"));
      } else {
        toast.error(t("content-msg-error-1"));
      }
    } catch (error) {
      toast.error(t("content-msg-error-1"));
      // setSelectedContent(null);
    }
  };

  return (
    <div>
      {userData && (
        <Layout>
          <main
            className={`relative mx-auto min-h-[calc(100vh-100px)] max-w-[2560px] px-10 md:px-20 ${
              i18n.language === "en" ? "font-enSans" : "font-jaSans"
            }`}
          >
            <div className="flex items-center space-x-5">
              <h2 className="mb-5 text-2xl font-bold text-gray-800">
                {t("content-header")}
              </h2>
              <Link href="/answer">
                <p className="mb-[15px] cursor-pointer text-sky-600">
                  {t("content-link-1")}
                </p>
              </Link>
            </div>
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
                      name={item.title || t("content-card-title-untitled")}
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
                      <Image src={item.thumbnail.url} layout="fill" />
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
