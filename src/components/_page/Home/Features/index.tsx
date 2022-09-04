import React from "react";

import { MainButton } from "@/components/Buttons";
import { keyGenerator } from "@/utils/functions";
import { APP_NAME } from "@/constants";

const Features = () => {
  const features = Array(3).fill(0);

  return (
    <section className="py-10 pb-[100px] text-neutral-800">
      <h2 className="mb-5 text-center text-4xl font-bold">
        A digital whiteboard for teaching
      </h2>
      <p className="mx-auto mb-10 max-w-[600px] text-center md:mb-16">
        {APP_NAME} is here for you and your students. Create engaging learning
        experiences, online and in-classroom.
      </p>
      <div className="mx-auto mb-16 flex max-w-[1100px] flex-col items-center justify-between space-y-12 md:flex-row md:space-y-0">
        {features.map((_, index) => (
          <div key={keyGenerator(index)}>
            <div className="mb-6 flex h-[250px] w-[250px] items-center justify-center bg-sky-200 text-neutral-700 md:mb-8 lg:h-[300px] lg:w-[300px]">
              Image here
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">
                Feature {index + 1}
              </h3>
              <p className="w-[250px] lg:w-[300px]">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore
                consequatur, eaque possimus hic numquam alias natus saepe optio
                ducimus. At maxime, tempore placeat voluptas laborum animi vero
                libero reiciendis vel?
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <MainButton type="button" text="Explore more features" />
      </div>
    </section>
  );
};

export default Features;
