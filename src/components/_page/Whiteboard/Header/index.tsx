import React, { useState } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { AiOutlineLeft } from "react-icons/ai";
import { toast } from "react-toastify";

import { useAuth } from "@/contexts/AuthContext";
import { OtherDataType } from "pages/whiteboard/[id]";
import { MainButton } from "@/components/Buttons";
import fetchAPI from "@/utils/fetch";
import { useTranslation } from "react-i18next";

Modal.setAppElement("#__next");

const modalCustomStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 999,
  },
};

interface HeaderProps {
  whiteboardTitle: string;
  setWhiteboardTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  otherData?: OtherDataType;
}

const Header = ({
  otherData,
  whiteboardTitle,
  setWhiteboardTitle,
}: HeaderProps) => {
  const { userData } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grade, setGrade] = useState(0);

  const onShareClick = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_DOMAIN}/code/${otherData?.code}`
      );
      toast.success(t("toast-text-link"));
    } catch (error) {
      toast.error("Unable to copy link");
    }
  };

  const onPutGrade = async () => {
    try {
      const res = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}students/answer-student/${router?.query?.answerId}`,
        "PATCH",
        {
          grade,
        }
      );

      if (res.status === "success") {
        toast.success(t("toast-text-grade-update"));
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("We are unable to put grade at the moment.");
    }
  };

  return (
    <div
      className={`z-[999] flex h-[70px] w-full items-center justify-between bg-white px-5 shadow-md shadow-neutral-200 drop-shadow-sm ${
        i18n.language === "en" ? "font-enSans" : "font-jaSans"
      }`}
    >
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(() => false)}
        contentLabel="Student info modal"
        style={modalCustomStyle}
      >
        <div className="flex flex-col space-y-5">
          <input
            className="w-[300px] border border-neutral-300 px-3 py-3 outline-none"
            type="number"
            required
            placeholder={t("whiteboard-header-grade")}
            value={grade}
            onChange={(e) => {
              // only numbers allowed
              if (e.target.value.match(/^[0-9]*$/)) {
                setGrade(parseInt(e.target.value, 10));
              }
            }}
          />
          <MainButton
            text={t("whiteboard-header-submit-grade")}
            type="button"
            onClick={onPutGrade}
          />
        </div>
      </Modal>
      <div className="flex w-full items-center space-x-3 text-neutral-800">
        <button
          type="button"
          onClick={() => {
            if (userData) {
              if (router.asPath.includes("whiteboard")) {
                router.push("/my-content");
              } else if (router.asPath.includes("answer")) {
                router.push(`/answer`);
              }
            } else {
              router.push("/");
            }
          }}
        >
          <AiOutlineLeft className="h-[30px] w-[30px]" />
        </button>
        {/* <h1 className="text-2xl">Whiteboard</h1> */}
        <input
          type="text"
          className="rounded-lg border border-neutral-200 px-3 py-2 text-xl outline-none"
          placeholder={t("whiteboard-header-title")}
          value={whiteboardTitle}
          onChange={(e) => {
            if (userData) setWhiteboardTitle(e.target.value);
          }}
        />
        {otherData && !router.asPath.includes("answer") && (
          <p className="pl-6">
            {t("header-text-code")}:{" "}
            <span className="text-sky-600">{otherData.code}</span>
          </p>
        )}
      </div>

      {(router.asPath.includes("answer") ||
        (userData && router?.query?.id)) && (
        <div className="flex items-center space-x-3">
          {router.asPath.includes("answer") && (
            <button
              type="button"
              className="whitespace-nowrap rounded-md bg-sky-400 px-3 py-1 text-white"
              onClick={() => setIsModalOpen(() => true)}
            >
              {t("whiteboard-header-put-grade")}
            </button>
          )}
          {userData && router?.query?.id && (
            <button
              type="button"
              className="whitespace-nowrap rounded-md bg-sky-400 px-3 py-1 text-white"
              onClick={onShareClick}
            >
              {t("whiteboard-header-share")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
