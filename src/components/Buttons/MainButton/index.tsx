import React from "react";

interface MainButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  textStyle?: string;
  type: "button" | "submit";
}

const MainButton = ({
  text,
  onClick,
  className,
  textStyle,
  type,
}: MainButtonProps) => {
  return (
    /* eslint-disable react/button-has-type */
    <button
      className={`bg-sky-600 py-4 px-7 text-white ${className}`}
      onClick={onClick}
      type={type || "button"}
    >
      <p className={textStyle}>{text}</p>
    </button>
    /* eslint-disable react/button-has-type */
  );
};

export default MainButton;
