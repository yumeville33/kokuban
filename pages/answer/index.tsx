import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAuth } from "@/contexts/AuthContext";
import fetchAPI from "@/utils/fetch";
import Card from "@/components/_page/Content/Card";
import { Layout, Spinner } from "@/components";
import { toast } from "react-toastify";

const Answer = () => {
  const { userData } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [contents, setContents] = useState<any>([]);

  console.log("selectedContent", selectedContent);

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
          }/getUserContent`,
          "GET"
        );

        console.log("res", res);

        if (res.status === "success") {
          setSelectedContent(res.data.data[0]._id);
          setContents(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    if (userData) {
      getContents();
    }

    setDataFetched(true);
  }, [userData]);

  useEffect(() => {
    async function getStudentAnswers() {
      try {
        const res = await fetchAPI(
          `${
            process.env.NEXT_PUBLIC_API_ENDPOINT as string
          }students/answer-board/${selectedContent}`,
          "GET"
        );

        if (res.status === "success") {
          setData(res.data.studentAnswers);
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    if (selectedContent) {
      getStudentAnswers();
    }
  }, [selectedContent]);

  const handleDeleteAnswer = async () => {
    try {
      const res = await fetchAPI(
        `${
          process.env.NEXT_PUBLIC_API_ENDPOINT as string
        }students/answer-delete/${selectedAnswer}`,
        "PATCH"
      );

      if (res.status === "success") {
        setData(data.filter((item: any) => item._id !== selectedAnswer));
        setSelectedAnswer(null);
        toast.success("Material deleted successfully");
      } else {
        toast.error("Something went wrong! Cannot delete.");
      }
    } catch (error) {
      toast.error("Something went wrong! Cannot delete.");
      // setSelectedContent(null);
    }
  };

  return (
    <div>
      {userData && (
        <Layout>
          <main className="relative mx-auto min-h-[calc(100vh-100px)] max-w-[2560px] px-10 md:px-20">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center  space-x-5">
                <h2 className="text-2xl font-bold text-gray-800">
                  Student answers
                </h2>
                {data.length > 0 && (
                  <Link href="/answer/table">
                    <p className="cursor-pointer text-sky-600">
                      View grades in table format
                    </p>
                  </Link>
                )}
              </div>
              {selectedContent && (
                <div className="flex items-center space-x-2">
                  <p>Select material</p>
                  <select
                    className="border border-neutral-300 py-1 px-2 outline-none"
                    defaultValue={selectedContent}
                    onChange={(e) => {
                      setSelectedContent(e.target.value);
                    }}
                  >
                    {contents.map((content: any) => (
                      <option key={content._id} value={content._id}>
                        {content.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {loading && (
              <div className="flex h-full w-full items-center justify-center">
                <Spinner />
              </div>
            )}
            {!loading && data.length === 0 && <div>No answers yet</div>}
            <div className="mt-3 flex">
              {data &&
                data.length > 0 &&
                data.map((item: any) => (
                  <div key={item._id} className="ml-4">
                    <Card
                      className="relative"
                      id={`/answer/${item._id}`}
                      date={item.updatedAt}
                      name={item.studentName}
                      grade={item.grade}
                      section={item.studentSection}
                      school={item.schoolName}
                      onOptionClick={() => {
                        if (selectedAnswer === item._id) {
                          setSelectedAnswer(null);
                        } else {
                          setSelectedAnswer(item._id);
                        }
                      }}
                      isOptionOpen={selectedAnswer === item._id}
                      onDelete={handleDeleteAnswer}
                    >
                      <Image src={item?.image?.uri} layout="fill" />
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

export default Answer;
