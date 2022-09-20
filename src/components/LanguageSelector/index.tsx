import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { AiOutlineDown, AiOutlineCheck } from "react-icons/ai";

const usaIcon = "/usa-icon.svg";
const japanIcon = "/japan-icon.svg";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const [selectorOpen, setSelectorOpen] = useState(false);

  const setLocale = (lang: string) => {
    i18n.changeLanguage(lang);
    setSelectorOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex  items-center  space-x-[1px]  rounded-lg bg-neutral-200 px-2 py-2 shadow-lg drop-shadow-lg"
        onClick={() => setSelectorOpen((prev) => !prev)}
      >
        <div className="relative h-[25px] w-[50px]">
          <Image
            src={i18n.language === "en" ? usaIcon : japanIcon}
            layout="fill"
          />
        </div>
        <AiOutlineDown className="h-[10px] w-[10px]" />
      </button>
      <div
        style={{
          maxHeight: selectorOpen ? "200px" : "0px",
        }}
        className={`absolute right-0 z-[999] mt-[10px] w-[200px] rounded-lg bg-neutral-200 transition-all duration-200 ease-in-out ${
          selectorOpen ? "" : ""
        }`}
      >
        {selectorOpen && (
          <>
            <button
              type="button"
              className="flex w-full items-center justify-between px-3 py-3"
              onClick={() => setLocale("en")}
            >
              <div className="flex items-center">
                <div className="relative h-[15px] w-[30px]">
                  <Image src={usaIcon} layout="fill" />
                </div>
                <p className="text-sm">English</p>
              </div>
              {i18n.language === "en" && (
                <AiOutlineCheck className="h-[10px] w-[10px]" />
              )}
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-between px-3 py-3"
              onClick={() => setLocale("ja")}
            >
              <div className="flex items-center">
                <div className="relative h-[15px] w-[30px]">
                  <Image src={japanIcon} layout="fill" />
                </div>
                <p className="text-sm">Japanese</p>
              </div>
              {i18n.language === "ja" && (
                <AiOutlineCheck className="h-[10px] w-[10px]" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
