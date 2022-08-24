import React from "react";
import { useRouter } from "next/router";

import { MainButton } from "@/components/Buttons";
import { APP_NAME } from "@/constants";

const Hero = () => {
  const router = useRouter();

  return (
    <section>
      <div className="flex h-[120px] flex-col items-center justify-center space-y-2 bg-sky-200 md:h-[100px]  md:flex-row md:space-y-0 md:space-x-20">
        <p className="text-neutral-800">Have your teacher&apos;s code?</p>
        <div>
          <input
            type="text"
            className="bg-white px-3 py-3 outline-none"
            placeholder="Enter code"
          />
          <button type="button" className="bg-sky-600 px-5 py-3 text-white">
            Join
          </button>
        </div>
      </div>
      {/* <div
        className={`${
          width <= 1366 ? "h-[100vh]" : "h-[calc(100vh_-_100px)]"
        } flex items-center justify-center`}
      > */}
      <div className="flex flex-col items-center justify-center space-x-0 space-y-10 px-10 py-[50px] text-neutral-800 lg:flex-row lg:space-y-0 lg:space-x-32 lg:py-[100px]">
        <div className="max-w-[400px] space-y-6 text-center lg:text-left">
          <h1 className="text-2xl font-semibold">{APP_NAME}</h1>
          <div className="space-y-1">
            <div className="">
              <h2 className="text-4xl font-bold">Students love it.</h2>
              <h2 className="text-4xl font-bold">Teachers love it.</h2>
            </div>
            <p>
              {APP_NAME} is the simplest, most inclusive way to create content
              in the classroom.
            </p>
          </div>
          <MainButton
            type="button"
            text="Try Whiteboarding"
            className="hidden lg:block"
            onClick={() => {
              router.push("/whiteboard");
            }}
          />
        </div>
        <div className="flex h-[400px] w-[400px] items-center justify-center bg-sky-200 text-neutral-600">
          <p>Image here</p>
        </div>
        <MainButton
          type="button"
          text="Try Whiteboarding"
          className="block lg:hidden"
          onClick={() => {
            router.push("/whiteboard");
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
