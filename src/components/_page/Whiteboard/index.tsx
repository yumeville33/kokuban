import React, { useState } from "react";
import dynamic from "next/dynamic";

import { ActiveToolType, IData, Position } from "@/components/types";
import { useAuth } from "@/contexts/AuthContext";
import { OtherDataType } from "pages/whiteboard/[id]";
import Header from "./Header";
// import Projects from "./Projects";

const DynamicBoard = dynamic(() => import("./Board"), { ssr: false });
const DynamicToolbar = dynamic(() => import("./Toolbar"), { ssr: false });

export interface WhiteboardProps {
  data?: Array<IData>;
  otherData?: OtherDataType;
}

export const Whiteboard = ({ data, otherData }: WhiteboardProps) => {
  const { userData } = useAuth();

  const [activeTool, setActiveTool] = useState<ActiveToolType>("pen");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);
  const [whiteboardTitle, setWhiteboardTitle] = useState<string | undefined>();

  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [studentSelectedElement, setStudentSelectedElement] = useState<
    number | null
  >(null);

  const [boardData, setBoardData] = useState<Array<IData>>(data || []);

  const [studentBoardData, setStudentBoardData] = useState<Array<IData>>([]);

  const [templateData, setTemplateData] = useState<Array<IData[]>>([]);

  console.log("tempalte data", templateData);

  const isDrawing = React.useRef(false);

  React.useEffect(() => {
    if (data) {
      setBoardData(data);
    }
  }, [data]);

  const handleMouseDown = (e: any) => {
    if (activeTool === "drag") {
      isDrawing.current = false;
      return;
    }

    isDrawing.current = true;
    const pos: Position = e.target.getStage().getPointerPosition();
    const dataToMap = userData ? boardData : studentBoardData;
    const newData =
      dataToMap.length > 0
        ? dataToMap.map((d, i) => {
            return {
              ...d,
              id: i + 1,
            };
          })
        : [];

    const dataToAdd = [
      ...newData,
      {
        id: newData.length + 1,
        color: activeTool === "highlighter" ? `${color}50` : color,
        size: { size },
        toolType: activeTool,
        points: [pos.x, pos.y],
      },
    ];

    if (userData) setBoardData(dataToAdd);

    if (!userData) setStudentBoardData(dataToAdd);
  };

  const handleMouseMove = (e: any) => {
    if (activeTool === "drag") {
      isDrawing.current = false;
      return;
    }

    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const dataLastLine = userData
      ? boardData[boardData.length - 1]
      : studentBoardData[studentBoardData.length - 1];

    // add point
    dataLastLine.points = dataLastLine?.points?.concat([point.x, point.y]);
    // replace last
    if (userData) {
      boardData.splice(boardData.length - 1, 1, dataLastLine);
      setBoardData(boardData.concat());
    }

    if (!userData) {
      studentBoardData.splice(studentBoardData.length - 1, 1, dataLastLine);
      setStudentBoardData(studentBoardData.concat());
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="h-full w-full">
      <Header
        otherData={otherData}
        whiteboardTitle={whiteboardTitle || otherData?.title || ""}
        setWhiteboardTitle={setWhiteboardTitle}
      />
      <div className="flex h-[calc(100%-70px)] w-full">
        <DynamicToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          setColor={setColor}
          color={color}
          size={size}
          setSize={setSize}
          data={boardData}
          setData={setBoardData}
          setSelectedElement={setSelectedElement}
          studentData={studentBoardData}
          setStudentData={setStudentBoardData}
          setStudentSelectedElement={setStudentSelectedElement}
          templateData={templateData}
          setTemplateData={setTemplateData}
        />
        <div className="h-full w-full bg-neutral-300">
          <DynamicBoard
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            activeTool={activeTool}
            // color={color}
            data={boardData}
            setData={setBoardData}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            studentData={studentBoardData}
            setStudentData={setStudentBoardData}
            studentSelectedElement={studentSelectedElement}
            setStudentSelectedElement={setStudentSelectedElement}
            otherData={otherData}
            whiteboardTitle={whiteboardTitle || otherData?.title || ""}
            templateData={templateData}
          />
          {/* <Projects /> */}
        </div>
      </div>
    </div>
  );
};

// export default Whiteboard2
