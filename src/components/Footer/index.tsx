import React from "react";
// import Link from "next/link";
import { useTranslation } from "react-i18next";

// import { APP_NAME, FOOTER_LINKS, FOOTER_SOCIAL_LINKS } from "@/constants";
import { APP_NAME } from "@/constants";

const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer
      className={`bg-sky-600 py-[20px] text-white ${
        i18n.language === "en" ? "font-enSans" : "font-jaSans"
      }`}
    >
      {/* <div className="flex flex-col items-start justify-center space-y-10 space-x-0 text-center md:flex-row md:space-y-0 md:space-x-40 md:text-left">
        {FOOTER_LINKS.map(({ name, links }, index) => (
          <div key={name} className="">
            <h4 className="text-2xl font-semibold">
              {t(`footer-title-${index + 1}`)}
            </h4>
            <ul className="mt-3 list-none space-y-1">
              {links.map((linkName, i) => (
                <li key={linkName}>
                  <Link href="/" passHref>
                    <a href="/">{t(`footer-link-${index + 1}-${i + 1}`)}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto my-16 h-[1px] max-w-[800px] bg-white" />
      <div className="flex justify-center space-x-10">
        {FOOTER_SOCIAL_LINKS.map(({ name, Icon, link }) => (
          <Link key={name} href={link} passHref>
            <a href={link}>
              <Icon className="h-10 w-10" />
            </a>
          </Link>
        ))}
      </div> */}
      <div className="text-center">
        &copy; {APP_NAME} | {t("footer-copyright-1")}
      </div>
    </footer>
  );
};

export default Footer;
