import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  date?: string | Date | number;
  name?: string;
  grade?: number;
  section?: string;
  school?: string;
  onOptionClick?: () => void;
  onDelete?: () => void;
  isOptionOpen?: boolean;
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
  onOptionClick,
  onDelete,
  isOptionOpen,
}) => {
  const { t, i18n } = useTranslation();

  const dateToday = date ? new Date(date) : new Date();
  const newDate = dateToday.toLocaleDateString();
  const time = dateToday.toLocaleTimeString();
  const dateTimeToday = `${newDate} ${time}`;

  return (
    <div className={i18n.language === "en" ? "font-enSans" : "card-jaSans"}>
      <Link href={`${id || ""}`} passHref>
        <div
          className={`h-[150px] w-[230px] cursor-pointer rounded-md ${className} border border-neutral-300 `}
        >
          {children}
        </div>
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg text-neutral-700">
            {name || t("content-card-title-default")}
          </div>
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
              {t("answer-grade")}: {grade === 0 ? t("answer-no-grade") : grade}
            </div>
          )}
        </div>
        {date && (
          <div className="relative">
            <button
              type="button"
              className="inline-block text-gray-500 hover:text-gray-700"
              onClick={onOptionClick}
            >
              <svg
                className="inline-block h-6 w-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 6a2 2 0 104 0 2 2 0 00-4 0z" />
              </svg>
            </button>
            {/* delete button */}
            {isOptionOpen && (
              <div className="absolute right-0 top-[20px] mt-2 mr-2">
                <div className="rounded-md border border-neutral-300 bg-red-500 shadow-lg hover:bg-red-700">
                  <button
                    type="button"
                    className="block px-4 py-2 text-sm text-white "
                    onClick={onDelete}
                  >
                    {t("card-delete")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
