import React from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { MainButton } from "@/components/Buttons";
import { APP_NAME } from "@/constants";
import fetchAPI from "@/utils/fetch";
import { LoaderModal } from "@/components";

const Hero = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [code, setCode] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleCodeCheck = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAPI(
        `${
          process.env.NEXT_PUBLIC_API_ENDPOINT as string
        }contents/${code}/getOneContent`,
        "GET"
      );

      if (res.status === "success") {
        router.push(`/whiteboard/${res.data.data._id}`);
      } else {
        toast.error("No content found with this code!");
      }
    } catch (error) {
      toast.error("No content found with this code!");
    }
    setIsLoading(false);
  };

  return (
    <section className={i18n.language === "en" ? "font-enSans" : "font-jaSans"}>
      <div className="flex flex-col items-center justify-center space-y-2 bg-sky-200 py-2 md:h-[100px] md:flex-row  md:space-y-0 md:space-x-20 md:py-0">
        {/* <p className="text-neutral-800">Have your teacher&apos;s code?</p> */}
        <p className="text-neutral-800">{t("landing-hero-code-1")}</p>
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0">
          <input
            type="text"
            className="bg-white px-3 py-3 outline-none"
            placeholder={t("landing-hero-code-2")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div>
            <button
              onClick={handleCodeCheck}
              type="button"
              className="bg-sky-600 px-5 py-3 text-white"
            >
              {t("landing-hero-code-3")}
            </button>
            <LoaderModal isModalOpen={isLoading} />
          </div>
        </div>
      </div>
      {/* <div
        className={`${
          width <= 1366 ? "h-[100vh]" : "h-[calc(100vh_-_100px)]"
        } flex items-center justify-center`}
      > */}
      <div className="flex flex-col items-center justify-center space-x-0 space-y-10 px-10 py-[50px] text-neutral-800 lg:flex-row lg:space-y-0 lg:space-x-32 lg:py-[100px]">
        <div className="max-w-[400px] space-y-6 text-center lg:text-left">
          <h1 className="text-2xl font-semibold">{APP_NAME}</h1>
          <div className="space-y-1">
            <div className="">
              <h2
                className={`${
                  i18n.language === "en"
                    ? "text-3xl md:text-4xl"
                    : "text-2xl md:text-3xl"
                } font-bold`}
              >
                {t("landing-hero-header-1")}
              </h2>
              <h2
                className={`${
                  i18n.language === "en"
                    ? "text-3xl md:text-4xl"
                    : "text-2xl md:text-3xl"
                } font-bold`}
              >
                {t("landing-hero-header-2")}
              </h2>
            </div>
            <p>{t("landing-hero-description")}</p>
          </div>
          <MainButton
            type="button"
            text={t("landing-hero-button")}
            className="hidden lg:block"
            onClick={() => {
              router.push("/whiteboard");
            }}
          />
        </div>
        <div className="relative flex h-[400px] w-[400px] items-center justify-center ">
          <Image src="/01.png" layout="fill" />
        </div>
        <MainButton
          type="button"
          text={t("landing-hero-button")}
          className="block lg:hidden"
          onClick={() => {
            router.push("/whiteboard");
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
