import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { APP_NAME, NAV_LINKS } from "@/constants";
import { useAuth, USER_DATA_STORAGE_KEY } from "@/contexts/AuthContext";
import { MainButton } from "../Buttons";
import LanguageSelector from "../LanguageSelector";

const Navbar = () => {
  const router = useRouter();
  const { userData } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    window.localStorage.removeItem(USER_DATA_STORAGE_KEY);

    setTimeout(() => {
      window.location.href = window.location.origin;
    }, 300);
  };

  return (
    <header className="mx-auto flex h-[100px] max-w-[2560px] items-center px-10 md:px-20">
      <nav
        className={`flex w-full items-center justify-between ${
          i18n.language === "en" ? "font-enSans" : "font-jaSans"
        }`}
      >
        <Link href="/">
          <h1 className="cursor-pointer text-3xl font-bold text-gray-800">
            {APP_NAME}
          </h1>
        </Link>

        <div className="hidden flex-row items-center space-x-10 lg:flex">
          {NAV_LINKS.map((name, i) => (
            <Link key={name} href={name.toLowerCase()} passHref>
              <a className="" href={name.toLowerCase()}>
                {t(`nav-link-${i + 1}`)}
              </a>
            </Link>
          ))}
          {userData && (
            <button type="button" onClick={handleLogout}>
              <p>{t("nav-link-5")}</p>
            </button>
          )}
          <MainButton
            type="button"
            text={userData ? t("nav-link-6") : t("nav-link-4")}
            onClick={() => {
              if (userData) {
                router.push("/my-content");
              } else {
                router.push("/auth");
              }
            }}
          />
          <LanguageSelector />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
