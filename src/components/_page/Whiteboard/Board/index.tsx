import React, { useState, useEffect, useRef } from "react";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage, Layer } from "react-konva";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Modal from "react-modal";

import useWindowDimensions from "@/hooks/useDimensions";
import fetchAPI from "@/utils/fetch";
import { useAuth } from "@/contexts/AuthContext";
import { IData } from "@/components/types";
import { MainButton } from "@/components/Buttons";
import imageUpload from "@/utils/imageUpload";
import { OtherDataType } from "pages/whiteboard/[id]";
import { useTranslation } from "react-i18next";
import BoardData from "../BoardData";

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

interface BoardProps {
  // eslint-disable-next-line no-unused-vars
  handleMouseDown: (e: any) => void;
  // eslint-disable-next-line no-unused-vars
  handleMouseMove: (e: any) => void;
  handleMouseUp: () => void;
  activeTool: string;
  // color: string;
  data: IData[];
  setData: React.Dispatch<React.SetStateAction<IData[]>>;
  selectedElement: number | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<number | null>>;
  studentData: IData[];
  setStudentData: React.Dispatch<React.SetStateAction<IData[]>>;
  studentSelectedElement: number | null;
  setStudentSelectedElement: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  otherData?: OtherDataType;
  whiteboardTitle: string;
  templateData?: Array<IData[]>;
}

const Board = ({
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  activeTool,
  // color,
  data,
  setData,
  selectedElement,
  setSelectedElement,
  studentData,
  setStudentData,
  studentSelectedElement,
  setStudentSelectedElement,
  otherData,
  whiteboardTitle,
  templateData,
}: BoardProps) => {
  const { userData } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [schoolName, setSchoolName] = useState("");

  const [boardSize, setBoardSize] = useState({ height: 0, width: 0 });

  const stageRef = React.useRef<Konva.Stage>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const { height, width } = useWindowDimensions();

  const isDrawing =
    activeTool === "pen" ||
    activeTool === "highlighter" ||
    activeTool === "eraser";

  useEffect(() => {
    if (boardRef.current) {
      setBoardSize({
        height: boardRef.current.clientHeight,
        width: boardRef.current.clientWidth,
      });
    }
  }, [boardRef, height, width]);

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedElement(null);
      setStudentSelectedElement(null);
    }
  };

  const onSave = async () => {
    if (!userData && buttonDisabled) {
      toast.info(t("whiteboard-save-student-2"));
      return;
    }

    if (userData && data.length < 1 && studentData.length < 1) {
      toast.error(t("whiteboard-save-no-user-teacher-1"));
      return;
    }

    if (!userData && data.length < 1 && studentData.length > 0) {
      toast.error(t("whiteboard-save-no-user-teacher-2"));
      return;
    }

    const uri = stageRef.current?.toDataURL();
    // const imageType = uri?.split(";")[0].split("/")[1];
    if (!uri) return;

    const imageUrl = await imageUpload(uri);

    const isPATCH = router.query.id;
    const bodyData: any = {
      content: data,
      thumbnail: imageUrl,
      title: whiteboardTitle || null,
    };

    if (isPATCH) bodyData.contentId = isPATCH;
    if (userData) {
      const userId = userData.data.user._id;
      const res = await fetchAPI(
        `${
          process.env.NEXT_PUBLIC_API_ENDPOINT as string
        }contents/${userId}/save`,
        isPATCH ? "PATCH" : "POST",
        bodyData
      );

      if (res.status === "success" && !isPATCH) router.push("/my-content");
    }

    if (userData && isPATCH) {
      toast.success(t("whiteboard-save-teacher-1"));
    }

    if (!userData) {
      setIsModalOpen(() => true);
    }
  };

  const onStudentSubmit = async () => {
    if (!studentName || !studentSection || !schoolName) {
      toast.error(t("whiteboard-save-student-error-1"));
      return;
    }

    const uri = stageRef.current?.toDataURL();
    // const imageType = uri?.split(";")[0].split("/")[1];

    if (!uri) return;

    const imageUrl = await imageUpload(uri);

    const bodyData = {
      // TODO - Edit later
      content: [...data, ...studentData],
      image: imageUrl,
      studentName,
      studentSection,
      schoolName,
      boardOwner: otherData?.user,
      boardRef: router.query.id,
    };

    const res = await fetchAPI(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT as string}students/answer/${
        router.query.id
      }`,
      "POST",
      bodyData
    );
    if (res.status === "success") {
      setIsModalOpen(() => false);
      toast.success(t("whiteboard-save-student-1"));
      setButtonDisabled(() => true);
    }
  };

  const modalContent = [
    {
      label: t("whiteboard-save-student-field-1"),
      value: studentName,
      setValue: setStudentName,
    },
    {
      label: t("whiteboard-save-student-field-1"),
      value: studentSection,
      setValue: setStudentSection,
    },
    {
      label: t("whiteboard-save-student-field-1"),
      value: schoolName,
      setValue: setSchoolName,
    },
  ];

  return (
    <div
      ref={boardRef}
      // className="flex h-[calc(100%-150px)] items-center justify-center bg-white"
      className={`flex h-full w-full items-center justify-center bg-white ${
        i18n.language === "en" ? "enSans" : "jaSans"
      }`}
    >
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(() => false)}
        contentLabel="Student info modal"
        style={modalCustomStyle}
      >
        <div className="flex  flex-col space-y-5">
          {modalContent.map((c) => {
            return (
              <input
                key={c.label}
                className="w-[300px] border border-neutral-300 px-3 py-3 outline-none"
                type="text"
                required
                placeholder={c.label}
                value={c.value}
                onChange={(e) => {
                  c.setValue(e.target.value);
                }}
              />
            );
          })}
          <MainButton
            text={t("whiteboard-save-button-2")}
            type="button"
            onClick={onStudentSubmit}
          />
        </div>
      </Modal>
      {/* 150px */}
      {!router.asPath.includes("answer") && (
        <button
          type="button"
          className="absolute right-[25px] bottom-[20px] z-[140]  cursor-pointer rounded-md bg-sky-600 px-4 py-2 text-white outline-none"
          onClick={onSave}
        >
          {!userData && router.query.id
            ? t("whiteboard-save-button-2")
            : t("whiteboard-save-button-1")}
        </button>
      )}
      <Stage
        ref={stageRef}
        onMouseDown={(e) => {
          checkDeselect(e);
          if (isDrawing) handleMouseDown(e);
        }}
        onMousemove={(e: any) => {
          if (isDrawing) handleMouseMove(e);
        }}
        onMouseup={() => {
          if (isDrawing) handleMouseUp();
        }}
        onTouchStart={(e) => {
          checkDeselect(e);
          if (isDrawing) handleMouseDown(e);
        }}
        onTouchMove={(e) => {
          if (isDrawing) handleMouseMove(e);
        }}
        onTouchEnd={() => {
          if (isDrawing) handleMouseUp();
        }}
        width={boardSize.width}
        height={boardSize.height}
      >
        <Layer>
          {/* template data */}
          {templateData &&
            templateData.length > 0 &&
            templateData.map((template, i) => (
              <BoardData
                key={i}
                data={template}
                setData={() => {}}
                activeTool=""
                selectedElement={null}
                setSelectedElement={() => {}}
                isDraggable={false}
                transformable={false}
              />
            ))}

          {/* Teachers data */}
          <BoardData
            data={data}
            setData={setData}
            activeTool={activeTool}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            isDraggable={!!userData && !router.asPath.includes("answer")}
            transformable={!!userData && !router.asPath.includes("answer")}
          />

          {/* Students data */}
          {!userData && (
            <BoardData
              data={studentData}
              setData={setStudentData}
              activeTool={activeTool}
              selectedElement={studentSelectedElement}
              setSelectedElement={setStudentSelectedElement}
              isDraggable
              transformable
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};
export default Board;
