import React from "react";
import Link from "next/link";

import { APP_NAME, NAV_LINKS } from "@/constants";
import { MainButton } from "../Buttons";

const Navbar = () => {
  return (
    <header className="mx-auto flex h-[100px] max-w-[2560px] items-center px-20">
      <nav className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold text-gray-800">{APP_NAME}</h1>

        <div className="flex flex-row items-center space-x-10">
          {NAV_LINKS.map((name) => (
            <Link key={name} href={name.toLowerCase()}>
              <a className="text-neutral-800 hover:text-gray-900">{name}</a>
            </Link>
          ))}
          <MainButton text="Sign up" />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
