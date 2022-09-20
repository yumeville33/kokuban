import React from "react";
import { BiBookContent } from "react-icons/bi";
import { useTranslation } from "react-i18next";

import { MainButton } from "@/components/Buttons";

const GetStarted = () => {
  const { t, i18n } = useTranslation();

  return (
    <section
      className={`bg-sky-600 py-[100px] text-white ${
        i18n.language === "en" ? "font-enSans" : "font-jaSans"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <BiBookContent className="mb-8 h-[100px] w-[100px] text-white" />
        <h2 className="mb-2 text-4xl">{t("landing-banner-header")}</h2>
        <h3 className="mb-8 text-2xl ">{t("landing-banner-description")}</h3>
        <MainButton
          type="button"
          text={t("landing-banner-button")}
          className="bg-sky-100 "
          textStyle="text-neutral-600"
        />
      </div>
    </section>
  );
};

export default GetStarted;
