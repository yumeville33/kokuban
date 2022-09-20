import React from "react";
import { useTranslation } from "react-i18next";

import { MainButton } from "@/components/Buttons";
import { keyGenerator } from "@/utils/functions";

const Features = () => {
  const { t, i18n } = useTranslation();

  const features = Array(2).fill(0);

  return (
    <section
      className={`py-10 pb-[100px] text-neutral-800 ${
        i18n.language === "en" ? "font-enSans" : "font-jaSans"
      }`}
    >
      <h2 className="mb-5 text-center text-4xl font-bold">
        {t("landing-feature-header")}
      </h2>
      <p className="mx-auto mb-10 max-w-[600px] text-center md:mb-16">
        {t("landing-feature-description")}
      </p>
      <div className="mx-auto mb-16 flex max-w-[700px] flex-col items-start justify-between space-y-12 md:flex-row md:space-y-0 ">
        {features.map((_, index) => (
          <div key={keyGenerator(index)}>
            <div className="mb-6 flex h-[250px] w-[250px] items-center justify-center bg-sky-200 text-neutral-700 md:mb-8 lg:h-[300px] lg:w-[300px]">
              Image here
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">
                {t(`landing-feature-title-${index + 1}`)}
              </h3>
              <p className="w-[250px] lg:w-[300px]">
                {t(`landing-feature-description-${index + 1}`)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <MainButton type="button" text={t("landing-feature-button")} />
      </div>
    </section>
  );
};

export default Features;
