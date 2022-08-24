import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IconType } from "react-icons";
import { AiOutlineHighlight } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import {
  BsEraser,
  BsPen,
  BsCircle,
  BsTriangle,
  BsSquare,
} from "react-icons/bs";
import { FaRegHandPointer, FaShapes } from "react-icons/fa";

import { GrClear, GrRedo, GrUndo } from "react-icons/gr";
import { GoTextSize } from "react-icons/go";

// import Board from "./Board";
import Header from "./Header";
import Projects from "./Projects";
// import Toolbar from "./Toolbar";

const DynamicBoard = dynamic(() => import("./Board"), { ssr: false });
const DynamicToolbar = dynamic(() => import("./Toolbar"), { ssr: false });

interface Position {
  x: number;
  y: number;
}

export type SizeType = {
  height: number;
  width: number;
};

export interface IShapes {
  id: number | string;
  type: string;
  pos: Position;
  size?: SizeType;
  radius?: number;
  sides?: number;
}

export type ActiveToolType =
  | "drag"
  | "image"
  | "shapes"
  | "text"
  | "pen"
  | "eraser"
  | "highlighter"
  | "undo"
  | "redo"
  | "clear";

export interface ITool {
  name: ActiveToolType;
  Icon: IconType;
  options?: any;
}

export type ShapeType = "circle" | "square" | "triangle" | "rectangle";

export type ImageType = {
  uri: string;
  extensionType: string;
};

export interface IData {
  id: number | string;
  toolType: ActiveToolType;
  color?: string;
  points?: Array<number>;
  position?: Position;
  size?: number | SizeType;
  radius?: number;
  shapeType?: ShapeType;
  sides?: number;
  originalSize?: SizeType;
  image?: ImageType;
  text?: string;
}

export interface WhiteboardProps {
  data?: Array<IData>;
}

export const Whiteboard = ({ data }: WhiteboardProps) => {
  const [previousTool, setPreviousTool] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveToolType>("pen");
  const [color, setColor] = useState("#000000");
  const [selectedOptionTool, setSelectedOptionTool] = useState("black-pen");
  const [toolOptionsActive, setToolOptionsActive] = useState(false);
  const [size, setSize] = useState(3);

  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [deletedData, setDeletedData] = React.useState<Array<any>>([]);
  const [boardData, setBoardData] = React.useState<Array<IData>>(data || []);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e: any) => {
    if (activeTool === "drag") {
      isDrawing.current = false;
      return;
    }

    isDrawing.current = true;
    const pos: Position = e.target.getStage().getPointerPosition();
    const newData = boardData.map((d, i) => {
      return {
        ...d,
        id: i + 1,
      };
    });

    setBoardData([
      ...newData,
      {
        id: newData.length + 1,
        color,
        size,
        toolType: activeTool,
        points: [pos.x, pos.y],
      },
    ]);
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
    const dataLastLine = boardData[boardData.length - 1];
    // add point
    dataLastLine.points = dataLastLine?.points?.concat([point.x, point.y]);
    // replace last
    boardData.splice(boardData.length - 1, 1, dataLastLine);
    setBoardData(boardData.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const tools: ITool[] = [
    {
      name: "drag",
      Icon: FaRegHandPointer,
    },
    {
      name: "image",
      Icon: BiImageAdd,
    },
    {
      name: "shapes",
      Icon: FaShapes,
      options: [
        {
          name: "circle",
          Icon: BsCircle,
        },
        {
          name: "square",
          Icon: BsSquare,
        },
        {
          name: "triangle",
          Icon: BsTriangle,
        },
      ],
    },
    {
      name: "text",
      Icon: GoTextSize,
    },
    {
      name: "pen",
      Icon: BsPen,
      options: [
        {
          name: "black-pen",
          color: "#000000",
        },
        {
          name: "red-pen",
          color: "#ff0000",
        },
        {
          name: "blue-pen",
          color: "#0000ff",
        },
        {
          name: "green-pen",
          color: "#00ff00",
        },
      ],
    },
    {
      name: "highlighter",
      Icon: AiOutlineHighlight,
      options: [
        {
          name: "black-highlighter",
          color: "#000000",
        },
        {
          name: "red-highlighter",
          color: "#ff0000",
        },
        {
          name: "blue-highlighter",
          color: "#0000ff",
        },
        {
          name: "green-highlighter",
          color: "#00ff00",
        },
      ],
    },
    {
      name: "eraser",
      Icon: BsEraser,
    },
    {
      name: "undo",
      Icon: GrUndo,
    },
    {
      name: "redo",
      Icon: GrRedo,
    },
    {
      name: "clear",
      Icon: GrClear,
    },
  ];

  return (
    <div className="h-full w-full">
      <Header />
      <div className="flex h-[calc(100%-70px)] w-full">
        <DynamicToolbar
          tools={tools}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          setToolOptionsActive={setToolOptionsActive}
          toolOptionsActive={toolOptionsActive}
          setPreviousTool={setPreviousTool}
          previousTool={previousTool}
          setColor={setColor}
          setSelectedOptionTool={setSelectedOptionTool}
          selectedOptionTool={selectedOptionTool}
          color={color}
          // setPreviousColor={setPreviousColor}
          size={size}
          setSize={setSize}
          data={boardData}
          setData={setBoardData}
          deletedData={deletedData}
          setDeletedData={setDeletedData}
          setSelectedElement={setSelectedElement}
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
            // isDragging={isDragging}
            // setIsDragging={setIsDragging}
          />
          <Projects />
        </div>
      </div>
    </div>
  );
};

// export default Whiteboard2
