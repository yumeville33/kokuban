import React from "react";

import { MainButton } from "@/components/Buttons";

const Hero = () => {
  return (
    <section>
      <div className="flex h-[100px] items-center justify-center space-x-20 bg-sky-200">
        <p className="text-neutral-800">Have your teacher's code?</p>
        <div>
          <input
            type="text"
            className="px-3 py-3 bg-white outline-none"
            placeholder="Enter code"
          />
          <button className="px-5 py-3 text-white bg-sky-600">Join</button>
        </div>
      </div>
      {/* <div
        className={`${
          width <= 1366 ? "h-[100vh]" : "h-[calc(100vh_-_100px)]"
        } flex items-center justify-center`}
      > */}
      <div
        className={`flex items-center justify-center space-x-32 py-[100px] text-neutral-800`}
      >
        <div className="max-w-[400px] space-y-6">
          <h1 className="text-2xl font-semibold">Educapp</h1>
          <div className="space-y-1">
            <div className="">
              <h2 className="text-4xl font-bold">Students love it.</h2>
              <h2 className="text-4xl font-bold">Teachers love it.</h2>
            </div>
            <p>
              Educapp is the simplest, most inclusive way to create content in
              the classroom.
            </p>
          </div>
          <MainButton text="Try Whiteboarding" />
        </div>
        <div className="flex h-[400px] w-[400px] items-center justify-center bg-sky-200 text-neutral-600">
          <p>Image here</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
