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
import { OtherDataType } from "pages/whiteboard/[id]";
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
      toast.info("You have already sent your work.");
      return;
    }

    if (userData && data.length < 1 && studentData.length < 1) {
      toast.error("Please draw something before saving.");
      return;
    }

    if (!userData && data.length < 1 && studentData.length > 0) {
      toast.error("Please sign in to save your work.");
      return;
    }

    const uri = stageRef.current?.toDataURL();
    const imageType = uri?.split(";")[0].split("/")[1];

    const isPATCH = router.query.id;
    const bodyData: any = {
      content: data,
      thumbnail: {
        uri,
        extensionType: `image/${imageType}`,
      },
      title: whiteboardTitle || "Untitled",
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
      toast.success("Your work has been saved.");
    }

    if (!userData) {
      setIsModalOpen(() => true);
    }
  };

  const onStudentSubmit = async () => {
    if (!studentName || !studentSection || !schoolName) {
      toast.error("Please fill all the fields");
      return;
    }

    const uri = stageRef.current?.toDataURL();
    const imageType = uri?.split(";")[0].split("/")[1];

    const bodyData = {
      // TODO - Edit later
      content: [...data, ...studentData],
      image: {
        uri,
        extensionType: `image/${imageType}`,
      },
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
      toast.success("Your work has been sent to the teacher.");
      setButtonDisabled(() => true);
    }
  };

  const modalContent = [
    {
      label: "Name",
      value: studentName,
      setValue: setStudentName,
    },
    {
      label: "Section",
      value: studentSection,
      setValue: setStudentSection,
    },
    {
      label: "School Name",
      value: schoolName,
      setValue: setSchoolName,
    },
  ];

  return (
    <div
      ref={boardRef}
      // className="flex h-[calc(100%-150px)] items-center justify-center bg-white"
      className="flex h-full items-center justify-center bg-white"
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
          <MainButton text="Submit" type="button" onClick={onStudentSubmit} />
        </div>
      </Modal>
      {/* 150px */}
      {!router.asPath.includes("answers") && (
        <button
          type="button"
          className="absolute right-[25px] bottom-[20px] z-[140]  cursor-pointer rounded-md bg-sky-600 px-4 py-2 text-white outline-none"
          onClick={onSave}
        >
          {!userData && router.query.id ? "Submit" : "Save"}
        </button>
      )}
      <Stage
        ref={stageRef}
        onMouseDown={(e) => {
          checkDeselect(e);

          if (isDrawing) {
            handleMouseDown(e);
          }
        }}
        onMousemove={(e: any) => {
          if (isDrawing) {
            handleMouseMove(e);
          }
        }}
        onMouseup={() => {
          if (isDrawing) {
            handleMouseUp();
          }
        }}
        onTouchStart={(e) => {
          checkDeselect(e);
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
            isDraggable={!!userData && !router.asPath.includes("answers")}
            transformable={!!userData && !router.asPath.includes("answers")}
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
