import React from "react";

interface MainButtonProps {
  text: string;
  onClick?: () => void;
}

const MainButton = ({ text, onClick }: MainButtonProps) => {
  return (
    <button className="py-4 bg-sky-600 px-7" onClick={onClick}>
      <p className="text-white">{text}</p>
    </button>
  );
};

export default MainButton;
