import React from "react";
import Link from "next/link";

import { APP_NAME, FOOTER_LINKS, FOOTER_SOCIAL_LINKS } from "@/constants";

const Footer = () => {
  return (
    <footer className="bg-sky-600 py-[100px] text-white">
      <div className="flex justify-center space-x-40">
        {FOOTER_LINKS.map(({ name, links }) => (
          <div key={name}>
            <h4 className="text-2xl font-semibold">{name}</h4>
            <ul className="mt-3 list-none space-y-1">
              {links.map((linkName) => (
                <li key={linkName}>
                  <Link href="/" passHref>
                    <a href="/">{linkName}</a>
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
      </div>
      <div className="mt-16 text-center">
        &copy; {APP_NAME} | All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
