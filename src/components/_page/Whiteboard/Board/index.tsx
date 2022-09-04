import React, { useState, useEffect, useRef } from "react";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import {
  Stage,
  Layer,
  Line,
  Text,
  Circle,
  Rect,
  RegularPolygon,
  Transformer,
} from "react-konva";
import { useRouter } from "next/router";

import useWindowDimensions from "@/hooks/useDimensions";
import fetchAPI from "@/utils/fetch";
import { useAuth } from "@/contexts/AuthContext";
import { IData, SizeType } from "@/components/types";
import KonvaImage from "../KonvaImage";

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
}: BoardProps) => {
  const { userData } = useAuth();
  const router = useRouter();

  const [boardSize, setBoardSize] = useState({ height: 0, width: 0 });

  const stageRef = React.useRef<Konva.Stage>(null);

  const dataRefs = React.useMemo(() => {
    const refs: any = {};
    data.forEach((d) => {
      refs[d.id] = React.createRef();
    });

    return refs;
  }, [data]);

  type TransformTypeRef = {
    [key: number]: React.RefObject<Konva.Transformer>;
  };

  const transformRefs = React.useMemo(() => {
    const refs: TransformTypeRef = {};
    data.forEach((d) => {
      refs[d.id as number] = React.createRef<Konva.Transformer>();
    });

    return refs;
  }, [data]);

  const boardRef = useRef<HTMLDivElement>(null);

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (
      selectedElement &&
      transformRefs[selectedElement].current &&
      dataRefs[selectedElement].current
    ) {
      transformRefs[selectedElement]?.current?.nodes([
        dataRefs[selectedElement].current,
      ]);
      transformRefs[selectedElement]?.current?.getLayer()?.batchDraw();
    }
  }, [selectedElement, dataRefs, transformRefs]);

  console.log("Data on whiteboard", data);
  console.log("selectedElement", selectedElement);

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

  const handleDragging = (
    e: KonvaEventObject<DragEvent>,
    id: string | number
  ) => {
    const newData = data.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          position: { x: e.target.x(), y: e.target.y() },
        };
      }
      return d;
    });

    setData(newData);
  };

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedElement(null);
    }
  };

  const handleTransform = (id: number) => {
    if (selectedElement) {
      const node = dataRefs[id].current;
      const scaleX = node?.scaleX();
      const scaleY = node?.scaleY();

      // we will reset it back
      node.scaleX(1);
      node.scaleY(1);

      const newData = data.map((d) => {
        if (d.id === id && d.id === selectedElement) {
          // console.log("d.id", d.id);
          // console.log("id", id);
          // console.log("selectedElement", selectedElement);

          const newObj: IData = {
            ...d,
            position: {
              x: node?.x(),
              y: node?.y(),
            },
          };

          if (d.shapeType === "circle") {
            newObj.radius = Math.max(5, node.radius() * scaleX);
          } else if (d.toolType === "text") {
            newObj.size!.size = Math.max(5, node.fontSize() * scaleX);
          } else {
            newObj.size = {
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            };
          }

          return newObj;
        }

        return d;
      });

      setData(() => newData);
    }
  };

  const onSave = async () => {
    if (!userData) return;

    const uri = stageRef.current?.toDataURL();
    const imageType = uri?.split(";")[0].split("/")[1];

    const isPATCH = router.query.id;
    const bodyData: any = {
      content: data,
      thumbnail: {
        uri,
        extensionType: `image/${imageType}`,
      },
    };

    if (isPATCH) bodyData.contentId = isPATCH;
    // eslint-disable-next-line no-underscore-dangle
    const userId = userData.data.user._id;
    const res = await fetchAPI(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT as string}content/${userId}/save`,
      isPATCH ? "PATCH" : "POST",
      bodyData
    );

    if (res.status === "success" && !isPATCH) router.push("/my-content");
  };

  return (
    <div
      ref={boardRef}
      // className="flex h-[calc(100%-150px)] items-center justify-center bg-white"
      className="flex h-full items-center justify-center bg-white"
    >
      <button
        type="button"
        className="absolute  right-0 top-0 mt-[19px] mr-[150px] cursor-pointer rounded-md bg-sky-600 px-3 py-1 text-white outline-none"
        onClick={onSave}
      >
        Save
      </button>
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
          {data &&
            data.map((d) => {
              if (
                d.toolType === "pen" ||
                d.toolType === "highlighter" ||
                d.toolType === "eraser"
              ) {
                return (
                  <Line
                    key={d.id}
                    points={d.points}
                    stroke={d.color}
                    strokeWidth={d.size!.size as number}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                      d.toolType === "eraser"
                        ? "destination-out"
                        : "source-over"
                    }
                    // draggable={activeTool === "drag" && line.activeTool !== "eraser"}
                  />
                );
              }

              if (d.toolType === "shapes") {
                if (d.shapeType === "circle") {
                  return (
                    <React.Fragment key={d.id}>
                      <Circle
                        key={d.id}
                        ref={dataRefs[d.id as number]}
                        onClick={() => {
                          if (activeTool === "drag") {
                            setSelectedElement(d.id as number);
                          }
                        }}
                        x={d.position!.x}
                        y={d.position!.y}
                        radius={d.radius}
                        stroke={d.color}
                        strokeWidth={4}
                        draggable={activeTool === "drag"}
                        onDragEnd={(e) => handleDragging(e, d.id)}
                        onTransformEnd={() => {
                          if (d.id === selectedElement) {
                            handleTransform(d.id as number);
                          }
                        }}
                      />
                      {selectedElement === d.id && (
                        <Transformer
                          ref={
                            transformRefs[
                              d.id as number
                            ] as React.Ref<Konva.Transformer>
                          }
                          boundBoxFunc={(oldBox, newBox) => {
                            // limit resize
                            if (newBox.width < 5 || newBox.height < 5) {
                              return oldBox;
                            }
                            return newBox;
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                }

                if (d.shapeType === "square") {
                  const newSize = d.size as SizeType;

                  return (
                    <React.Fragment key={d.id}>
                      <Rect
                        key={d.id}
                        ref={dataRefs[d.id as number] as React.Ref<Konva.Rect>}
                        onClick={() => {
                          if (activeTool === "drag") {
                            setSelectedElement(d.id as number);
                          }
                        }}
                        x={d.position!.x}
                        y={d.position!.y}
                        width={newSize.width}
                        height={newSize.height}
                        stroke={d.color}
                        strokeWidth={4}
                        draggable={activeTool === "drag"}
                        onDragEnd={(e) => handleDragging(e, d.id)}
                        onTransformEnd={() => {
                          if (d.id === selectedElement) {
                            handleTransform(d.id as number);
                          }
                        }}
                      />
                      {selectedElement === d.id && (
                        <Transformer
                          ref={
                            transformRefs[
                              d.id as number
                            ] as React.Ref<Konva.Transformer>
                          }
                          boundBoxFunc={(oldBox, newBox) => {
                            // limit resize
                            if (newBox.width < 5 || newBox.height < 5) {
                              return oldBox;
                            }
                            return newBox;
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                }

                return (
                  <React.Fragment key={d.id}>
                    <RegularPolygon
                      key={d.id}
                      ref={
                        dataRefs[
                          d.id as number
                        ] as React.Ref<Konva.RegularPolygon>
                      }
                      onClick={() => {
                        if (activeTool === "drag") {
                          setSelectedElement(d.id as number);
                        }
                      }}
                      x={d.position!.x}
                      y={d.position!.y}
                      sides={d.sides!}
                      radius={d.radius!}
                      stroke={d.color}
                      strokeWidth={4}
                      draggable={activeTool === "drag"}
                      onDragEnd={(e) => handleDragging(e, d.id)}
                      onTransformEnd={() => {
                        if (d.id === selectedElement) {
                          handleTransform(d.id as number);
                        }
                      }}
                    />
                    {selectedElement === d.id && (
                      <Transformer
                        ref={
                          transformRefs[
                            d.id as number
                          ] as React.Ref<Konva.Transformer>
                        }
                        boundBoxFunc={(oldBox, newBox) => {
                          // limit resize
                          if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                          }
                          return newBox;
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              }

              if (d.toolType === "image") {
                const isDesiredHeight = d.originalSize?.height! <= 150;
                const size = d.size as SizeType;

                return (
                  <React.Fragment key={d.id}>
                    <KonvaImage
                      key={d.id}
                      src={d?.image?.uri!}
                      ref={dataRefs[d.id as number] as React.Ref<Konva.Image>}
                      imageProps={{
                        x: d.position!.x,
                        y: d.position!.y,
                        height: isDesiredHeight
                          ? d.originalSize?.height
                          : size.height,
                        width: isDesiredHeight
                          ? d.originalSize?.width
                          : size.width,
                        draggable: activeTool === "drag",
                        onDragEnd: (e: KonvaEventObject<DragEvent>) =>
                          handleDragging(e, d.id),
                        onClick: () => {
                          if (activeTool === "drag") {
                            setSelectedElement(d.id as number);
                          }
                        },
                        onTransformEnd: () => {
                          if (d.id === selectedElement) {
                            handleTransform(d.id as number);
                          }
                        },
                      }}
                    />
                    {selectedElement === d.id && (
                      <Transformer
                        ref={
                          transformRefs[
                            d.id as number
                          ] as React.Ref<Konva.Transformer>
                        }
                        boundBoxFunc={(oldBox, newBox) => {
                          // limit resize
                          if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                          }
                          return newBox;
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={d.id}>
                  <Text
                    key={d.id}
                    x={d.position!.x}
                    y={d.position!.y}
                    text={d.text!}
                    fontSize={d.size!.size as number}
                    // width={d.size as number}
                    // height={d.size as number}
                    fontFamily="Arial"
                    fill={d.color}
                    draggable={activeTool === "drag"}
                    onDragEnd={(e) => handleDragging(e, d.id)}
                    onClick={() => {
                      if (activeTool === "drag") {
                        setSelectedElement(d.id as number);
                      }
                    }}
                    onTap={() => {
                      if (activeTool === "drag") {
                        setSelectedElement(d.id as number);
                      }
                    }}
                    onTransformEnd={() => {
                      if (d.id === selectedElement) {
                        handleTransform(d.id as number);
                      }
                    }}
                  />
                  {selectedElement === d.id && (
                    <Transformer
                      ref={transformRefs[d.id as number]}
                      boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                          return oldBox;
                        }
                        return newBox;
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
        </Layer>
      </Stage>
    </div>
  );
};
export default Board;
