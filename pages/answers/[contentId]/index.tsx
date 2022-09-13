import React, { useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAuth } from "@/contexts/AuthContext";
import fetchAPI from "@/utils/fetch";
import Card from "@/components/_page/Content/Card";
import { Layout, Spinner } from "@/components";
import { toast } from "react-toastify";

const Answers = () => {
  const { userData } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

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
          `${
            process.env.NEXT_PUBLIC_API_ENDPOINT as string
          }students/answer-board/${router.query.contentId}`,
          "GET"
        );

        if (res.status === "success") {
          setData(res.data.studentAnswers);
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    if (userData && router.query.contentId) {
      getContents();
    }

    setDataFetched(true);
  }, [userData, router.query.contentId]);

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
        toast.success("Student work deleted successfully");
      } else {
        toast.error("Something went wrong! Cannot delete.");
      }
    } catch (error) {
      toast.error("Something went wrong! Cannot delete.");
      // setSelectedContent(null);
    }
  };

  return (
    <>
      {userData && (
        <Layout>
          <main className="relative mx-auto min-h-[calc(100vh-100px)] max-w-[2560px] px-10 md:px-20">
            <div className="mb-6 flex items-end space-x-5">
              <h2 className="text-2xl font-bold text-gray-800">
                Student answers
              </h2>
              {data.length > 0 && (
                <Link href={`${router.asPath}/table`}>
                  <p className="cursor-pointer text-sky-600">
                    View grades in table format
                  </p>
                </Link>
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
                      id={`/answers/${router?.query?.contentId}/${item._id}`}
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
    </>
  );
};

export default Answers;
