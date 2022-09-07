import React, { useEffect } from "react";
import {
  Line,
  Text,
  Circle,
  Rect,
  RegularPolygon,
  Transformer,
  Group,
} from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import { IData, SizeType } from "@/components/types";
import KonvaImage from "../KonvaImage";

interface BoardDataProps {
  data: Array<IData>;
  setData: React.Dispatch<React.SetStateAction<IData[]>>;
  activeTool: string;
  selectedElement: number | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<number | null>>;
  isDraggable: boolean;
  transformable: boolean;
}

type TransformTypeRef = {
  [key: number]: React.RefObject<Konva.Transformer>;
};

const BoardData = ({
  data,
  setData,
  activeTool,
  selectedElement,
  setSelectedElement,
  isDraggable,
  transformable,
}: BoardDataProps) => {
  const dataRefs = React.useMemo(() => {
    const refs: any = {};
    data.forEach((d) => {
      refs[d.id] = React.createRef();
    });

    return refs;
  }, [data]);

  const transformRefs = React.useMemo(() => {
    const refs: TransformTypeRef = {};

    data.forEach((d) => {
      refs[d.id as number] = React.createRef<Konva.Transformer>();
    });

    return refs;
  }, [data]);

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

  const lineData =
    data &&
    data.filter(
      (d) =>
        d.toolType === "pen" ||
        d.toolType === "eraser" ||
        d.toolType === "highlighter"
    );
  const otherData =
    data &&
    data.filter(
      (d) =>
        d.toolType !== "pen" &&
        d.toolType !== "eraser" &&
        d.toolType !== "highlighter"
    );
  return (
    <>
      <Group>
        {lineData &&
          lineData.map((line) => (
            <Line
              key={line.id}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.size!.size as number}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.toolType === "eraser" ? "destination-out" : "source-over"
              }
              // draggable={activeTool === "drag" && line.activeTool !== "eraser"}
            />
          ))}
      </Group>
      <Group>
        {otherData &&
          otherData.map((d) => {
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
                      draggable={activeTool === "drag" && isDraggable}
                      onDragEnd={(e) => handleDragging(e, d.id)}
                      onTransformEnd={() => {
                        if (d.id === selectedElement) {
                          handleTransform(d.id as number);
                        }
                      }}
                    />
                    {transformable && selectedElement === d.id && (
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
                      draggable={activeTool === "drag" && isDraggable}
                      onDragEnd={(e) => handleDragging(e, d.id)}
                      onTransformEnd={() => {
                        if (d.id === selectedElement) {
                          handleTransform(d.id as number);
                        }
                      }}
                    />
                    {transformable && selectedElement === d.id && (
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
                    draggable={activeTool === "drag" && isDraggable}
                    onDragEnd={(e) => handleDragging(e, d.id)}
                    onTransformEnd={() => {
                      if (d.id === selectedElement) {
                        handleTransform(d.id as number);
                      }
                    }}
                  />
                  {transformable && selectedElement === d.id && (
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
                      draggable: activeTool === "drag" && isDraggable,
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
                  {transformable && selectedElement === d.id && (
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
                  draggable={activeTool === "drag" && isDraggable}
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
                {transformable && selectedElement === d.id && (
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
      </Group>
    </>
  );
};

export default BoardData;
