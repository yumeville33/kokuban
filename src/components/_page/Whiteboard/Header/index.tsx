import React from "react";
import { useRouter } from "next/router";
import { AiOutlineLeft } from "react-icons/ai";

import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  code?: string;
}

const Header = ({ code }: HeaderProps) => {
  const { userData } = useAuth();
  const router = useRouter();

  return (
    <div className="z-[999] flex h-[70px] w-full items-center justify-between bg-white px-5 shadow-md shadow-neutral-200 drop-shadow-sm">
      <div className="flex items-center space-x-3 text-neutral-800">
        <button type="button" onClick={() => router.push("/")}>
          <AiOutlineLeft className="h-[30px] w-[30px]" />
        </button>
        <h1 className="text-2xl">Whiteboard</h1>
        {code && <p className="pl-6">code: {code}</p>}
        {code && (
          <p className="pl-6">link: http://localhost:3000/code/{code}</p>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <button
          type="button"
          className="rounded-md bg-sky-400 px-3 py-1 text-white"
        >
          Share
        </button>
        <button
          type="button"
          className="h-[40px] w-[40px] rounded-full bg-neutral-300"
        >
          {userData ? userData.data.user.email[0].toUpperCase() : "U"}
        </button>
      </div>
    </div>
  );
};

export default Header;
