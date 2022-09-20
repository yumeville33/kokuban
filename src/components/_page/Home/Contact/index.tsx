import React from "react";
import { useTranslation } from "react-i18next";

import { MainButton } from "@/components/Buttons";

const Contact = () => {
  const { t, i18n } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted");
  };

  return (
    <section
      className={`py-[100px] px-10 ${
        i18n.language === "en" ? "font-enSans" : "font-jaSans"
      }`}
    >
      <h2 className="text-center text-4xl font-bold text-neutral-800">
        {t("landing-contact-header")}
      </h2>
      <p className="mx-auto mt-3 max-w-[800px] text-center text-neutral-800">
        {t("landing-contact-description")}
      </p>
      <div className="mt-12 flex flex-col space-x-12 md:flex-row md:items-center md:justify-center">
        <form action="" className="bg-sky-600 p-8" onSubmit={handleSubmit}>
          <h3 className="text-2xl font-semibold text-white">
            {t("landing-contact-form-title")}
          </h3>
          <div className="mt-4 mb-6 h-[5px] w-[100px] bg-white" />
          <div className="space-y-6">
            <div className="flex flex-col space-x-0 space-y-3 md:flex-row md:space-y-0 md:space-x-3">
              <input
                className="py-2 px-3 outline-none"
                type="text"
                placeholder={t("landing-contact-form-field-1")}
                required
              />
              <input
                className="py-2 px-3 outline-none"
                type="text"
                placeholder={t("landing-contact-form-field-2")}
              />
            </div>
            <div className="flex flex-col space-y-3 space-x-0 md:flex-row md:space-y-0 md:space-x-3">
              <input
                className="py-2 px-3 outline-none"
                type="tel"
                placeholder={t("landing-contact-form-field-3")}
                required
              />
              <input
                className="py-2 px-3 outline-none"
                type="email"
                placeholder={t("landing-contact-form-field-4")}
                required
              />
            </div>
            <textarea
              className="w-full py-2 px-3 outline-none"
              cols={1}
              rows={5}
              placeholder={t("landing-contact-form-field-5")}
              required
            />
          </div>
          <MainButton
            text={t("landing-contact-form-button")}
            type="submit"
            className="mt-5  bg-neutral-100"
            textStyle="text-neutral-600"
          />
        </form>
        {/* <div className="hidden space-y-3 text-lg text-neutral-800 md:block">
          <div>+12 345 678 90</div>
          <div>example@email.com</div>
          <div>Some address</div>
        </div> */}
      </div>
    </section>
  );
};

export default Contact;
