import React from "react";
import { useTranslation } from "react-i18next";

import { keyGenerator } from "@/utils/functions";
import Image from "next/image";

const Features = () => {
  const { t, i18n } = useTranslation();

  const features = Array(2).fill(0);

  return (
    <section
      id="features"
      className={`py-10 px-1 pb-[100px] text-neutral-800 md:px-0 ${
        i18n.language === "en" ? "font-enSans" : "font-jaSans"
      }`}
    >
      <h2 className="mb-5 text-center text-4xl font-bold">
        {t("landing-feature-header")}
      </h2>
      <p className="mx-auto mb-10 max-w-[600px] text-center md:mb-16">
        {t("landing-feature-description")}
      </p>
      <div className="mx-auto mb-16 flex max-w-[700px] flex-col items-center space-y-12 md:flex-row md:items-start md:justify-between md:space-y-0 ">
        {features.map((_, index) => (
          <div key={keyGenerator(index)}>
            <div className="relative mb-6 flex h-[250px] w-[250px] items-center justify-center md:mb-8 lg:h-[300px] lg:w-[300px]">
              <Image src={`/0${index + 2}.png`} layout="fill" />
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
    </section>
  );
};

export default Features;
