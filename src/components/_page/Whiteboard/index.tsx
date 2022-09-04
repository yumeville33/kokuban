import React, { useState } from "react";
import dynamic from "next/dynamic";

import { ActiveToolType, IData, Position } from "@/components/types";
import Header from "./Header";
// import Projects from "./Projects";

const DynamicBoard = dynamic(() => import("./Board"), { ssr: false });
const DynamicToolbar = dynamic(() => import("./Toolbar"), { ssr: false });

export interface WhiteboardProps {
  data?: Array<IData>;
  code?: string;
}

export const Whiteboard = ({ data, code }: WhiteboardProps) => {
  const [activeTool, setActiveTool] = useState<ActiveToolType>("pen");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);

  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [boardData, setBoardData] = React.useState<Array<IData>>(data || []);

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
        color: activeTool === "highlighter" ? `${color}50` : color,
        size: { size },
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

  return (
    <div className="h-full w-full">
      <Header code={code} />
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
          />
          {/* <Projects /> */}
        </div>
      </div>
    </div>
  );
};

// export default Whiteboard2
