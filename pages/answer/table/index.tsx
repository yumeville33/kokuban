import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/contexts/AuthContext";
import fetchAPI from "@/utils/fetch";
import { Layout, Spinner } from "@/components";

const Table = () => {
  const router = useRouter();
  const { userData } = useAuth();

  const [studentGrades, setStudentGrades] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [contents, setContents] = useState<any>([]);

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
        // const res = await fetchAPI(
        //   `${
        //     process.env.NEXT_PUBLIC_API_ENDPOINT as string
        //   }students/answer-board/table/${router.query.contentId}`,
        //   "GET"
        // );

        if (res.status === "success") {
          // setStudentGrades(res.data.studentAnswers);
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
          }students/answer-board/table/${selectedContent}`,
          "GET"
        );

        if (res.status === "success") {
          setStudentGrades(res.data.studentAnswers);
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

  return (
    <div>
      {userData && (
        <Layout>
          <div className="container mx-auto min-h-[calc(100vh-100px)] px-4 sm:px-6">
            <div className="py-8">
              <div className=" flex items-center justify-between">
                <h2 className="text-2xl font-semibold leading-tight">
                  Student grades
                </h2>
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
              <div className="-mx-4 overflow-x-auto px-4 py-4 sm:-mx-6 sm:px-6">
                <div className="inline-block min-w-full overflow-hidden rounded-lg shadow-md">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                          {" "}
                          Student name{" "}
                        </th>
                        <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                          {" "}
                          Section{" "}
                        </th>
                        <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                          {" "}
                          School{" "}
                        </th>
                        <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                          {" "}
                          Grade{" "}
                        </th>
                        <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                          {" "}
                          Updated at{" "}
                        </th>
                        {/* <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3"></th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {studentGrades &&
                        studentGrades.length > 0 &&
                        studentGrades.map((grade: any) => {
                          const dateToday = new Date(grade.updatedAt);
                          const newDate = dateToday.toLocaleDateString();
                          const time = dateToday.toLocaleTimeString();
                          const newUpdatedAt = `${newDate} ${time}`;

                          return (
                            <tr key={grade._id}>
                              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                <p className="whitespace-no-wrap text-gray-900">
                                  {grade.studentName}
                                </p>
                              </td>
                              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                <p className="whitespace-no-wrap text-gray-900">
                                  {grade.studentSection}
                                </p>
                              </td>
                              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                <p className="whitespace-no-wrap text-gray-600">
                                  {grade.schoolName}
                                </p>
                              </td>
                              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                <p className="whitespace-no-wrap text-gray-900">
                                  {grade.grade === 0
                                    ? "Not graded yet"
                                    : grade.grade}
                                </p>
                              </td>
                              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                <p className="whitespace-no-wrap text-gray-900">
                                  {newUpdatedAt}
                                </p>
                              </td>
                              {/* <td className="border-b border-gray-200 bg-white px-5 py-5 text-right text-sm">
                                <button
                                  type="button"
                                  className="inline-block text-gray-500 hover:text-gray-700"
                                >
                                  <svg
                                    className="inline-block h-6 w-6 fill-current"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 6a2 2 0 104 0 2 2 0 00-4 0z" />
                                  </svg>
                                </button>
                              </td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {loading && (
              <div className="flex h-full w-full items-center justify-center">
                <Spinner />
              </div>
            )}
          </div>
        </Layout>
      )}
    </div>
  );
};

export default Table;
