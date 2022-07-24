import React from "react";
import Link from "next/link";

import { APP_NAME, NAV_LINKS } from "@/constants";
import { MainButton } from "../Buttons";

const Navbar = () => {
  return (
    <header className="mx-auto flex h-[100px] max-w-[2560px] items-center px-20">
      <nav className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">{APP_NAME}</h1>

        <div className="flex flex-row items-center space-x-10">
          {NAV_LINKS.map((name) => (
            <Link key={name} href={name.toLowerCase()} passHref>
              <a className="" href={name.toLowerCase()}>
                {name}
              </a>
            </Link>
          ))}
          <MainButton type="button" text="Sign up" />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
