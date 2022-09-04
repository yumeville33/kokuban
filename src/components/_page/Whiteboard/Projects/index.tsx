import React from "react";

import { AiOutlinePlus } from "react-icons/ai";

const Projects = () => {
  return (
    <div className="flex h-[150px] w-full items-center space-x-5 border-t-2 bg-white px-5 shadow-md">
      <div className="flex h-[80%] w-[150px] items-center justify-center rounded-xl border border-neutral-300 text-center">
        Hello noobs!
      </div>
      <div className="flex h-[80%] w-[150px] items-center justify-center rounded-xl border border-neutral-300 text-center">
        Hello fucking world!
      </div>
      <div className="flex h-[80%] w-[150px] items-center justify-center rounded-xl border border-neutral-300">
        <AiOutlinePlus className="h-[40px] w-[40px]" />
      </div>
    </div>
  );
};

export default Projects;
