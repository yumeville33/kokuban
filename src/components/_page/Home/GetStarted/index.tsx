import React from "react";
import { BiBookContent } from "react-icons/bi";

import { MainButton } from "@/components/Buttons";
import { APP_NAME } from "@/constants";

const GetStarted = () => {
  return (
    <section className="bg-sky-600 py-[100px] text-white">
      <div className="flex flex-col items-center">
        <BiBookContent className="mb-8 h-[100px] w-[100px] text-white" />
        <h2 className="mb-2 text-4xl">Ready to start making contents?</h2>
        <h3 className="mb-8 text-2xl ">Try {APP_NAME} for free</h3>
        <MainButton
          type="button"
          text="Get started"
          className="bg-sky-100 "
          textStyle="text-neutral-600"
        />
      </div>
    </section>
  );
};

export default GetStarted;
