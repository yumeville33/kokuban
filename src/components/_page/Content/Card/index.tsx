import React from "react";
import Link from "next/link";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  date?: string | Date | number;
}

const Card: React.FC<CardProps> = ({ children, className, id, date }) => {
  const dateToday = date ? new Date(date) : new Date();
  const newDate = dateToday.toLocaleDateString();
  const time = dateToday.toLocaleTimeString();
  const dateTimeToday = `${newDate} ${time}`;

  return (
    <Link href={`whiteboard${id || ""}`} passHref>
      <a href={`whiteboard${id || ""}`}>
        <div
          className={`h-[150px] w-[230px] rounded-md ${className} border border-neutral-300`}
        >
          {children}
        </div>
        <div className="text-lg text-neutral-700">Whiteboard</div>
        {date && <div className="text-neutral-500">{dateTimeToday}</div>}
      </a>
    </Link>
  );
};

export default Card;
