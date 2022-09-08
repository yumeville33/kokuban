import React from "react";
import Link from "next/link";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  date?: string | Date | number;
  name?: string;
  grade?: number;
  section?: string;
  school?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  id,
  date,
  name,
  grade,
  section,
  school,
}) => {
  const dateToday = date ? new Date(date) : new Date();
  const newDate = dateToday.toLocaleDateString();
  const time = dateToday.toLocaleTimeString();
  const dateTimeToday = `${newDate} ${time}`;

  return (
    <Link href={`${id || ""}`} passHref>
      <a href={`${id || ""}`}>
        <div
          className={`h-[150px] w-[230px] rounded-md ${className} border border-neutral-300`}
        >
          {children}
        </div>
        <div className="text-lg text-neutral-700">{name || "Whiteboard"}</div>
        {section && (
          <div className="text-lg text-neutral-700">
            {section || "No section"}
          </div>
        )}
        {school && (
          <div className="text-lg text-neutral-700">
            {school || "No School"}
          </div>
        )}
        {date && <div className="text-neutral-500">{dateTimeToday}</div>}
        {grade !== undefined && (
          <div className="text-neutral-500">
            Grade: {grade === 0 ? "No grade yet" : grade}
          </div>
        )}
      </a>
    </Link>
  );
};

export default Card;
