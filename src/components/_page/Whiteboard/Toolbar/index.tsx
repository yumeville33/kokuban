import React, { useRef, useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";

import { ActiveToolType, IData, ITool } from "..";

interface ToolbarProps {
  tools: Array<ITool>;
  activeTool: string;
  setActiveTool: React.Dispatch<React.SetStateAction<ActiveToolType>>;
  toolOptionsActive: boolean;
  setToolOptionsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setPreviousTool: React.Dispatch<React.SetStateAction<string | null>>;
  previousTool: string | null;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setSelectedOptionTool: React.Dispatch<React.SetStateAction<string>>;
  selectedOptionTool: string;
  color: string;
  // setPreviousColor: React.Dispatch<React.SetStateAction<string>>;
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  data: Array<IData>;
  setData: React.Dispatch<React.SetStateAction<Array<IData>>>;
  deletedData: Array<any>;
  setDeletedData: React.Dispatch<React.SetStateAction<Array<any>>>;
  setSelectedElement: React.Dispatch<React.SetStateAction<number | null>>;
}

const Toolbar = ({
  tools,
  activeTool,
  setActiveTool,
  setToolOptionsActive,
  toolOptionsActive,
  setPreviousTool,
  previousTool,
  setColor,
  setSelectedOptionTool,
  selectedOptionTool,
  color,
  size,
  setSize,
  data,
  setData,
  deletedData,
  setDeletedData,
  setSelectedElement,
}: // setPreviousColor,
ToolbarProps) => {
  const sizes = [3, 6, 10, 15];
  const textColors = ["#000000", "#ff0000", "#00ff00", "#0000ff"];

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [textSize, setTextSize] = useState(20);
  const [textColor, setTextColor] = useState("#000000");
  const [isTextToolOpen, setIsTextToolOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      console.log("file", file);
      // const imageUrl = URL.createObjectURL(file);

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        const image = new Image();
        image.src = (event.target as any).result;

        image.onload = () => {
          const percentage = (150 / image.height) * 100;
          const newWidth = image.width * (percentage / 100);

          // console.log("image src", image.src);

          const imageData: IData = {
            id: data.length + 1,
            toolType: "image" as ActiveToolType,
            position: { x: 100, y: 100 },
            size: { width: newWidth, height: 150 },
            originalSize: { width: image.width, height: image.height },
            image: {
              uri: image.src,
              extensionType: file.type,
            },
            // image: imageUrl,
          };

          // console.log("imageData", imageData);
          setData([...data, imageData]);

          // setImage(imageData.image);
        };
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative z-[999] flex h-full w-[70px] flex-col items-center justify-center space-y-1 border-r-2 bg-white">
      {tools &&
        tools.map(({ name, Icon, options }) => (
          <React.Fragment key={name}>
            {name === "image" && (
              <input
                ref={imageInputRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
            )}
            <button
              type="button"
              className={`${name === activeTool && "bg-sky-600"} p-2`}
              onClick={() => {
                setSelectedElement(null);

                const filteredTools = ["image", "clear", "undo", "redo"];

                if (name === "text") {
                  setIsTextToolOpen((prev) => !prev);
                } else {
                  setIsTextToolOpen(false);
                }

                if (name === "image") {
                  imageInputRef.current?.click();
                  return;
                }

                if (name === "undo") {
                  if (data.length > 0) {
                    const dataToDelete = data[data.length - 1];
                    setDeletedData([...deletedData, dataToDelete]);

                    const newData = data.slice(0, -1);
                    setData(newData);
                  } else {
                    const clearedData = deletedData[deletedData.length - 1];
                    if (Array.isArray(clearedData)) {
                      const newDeletedData = deletedData.slice(0, -1);
                      setDeletedData(newDeletedData);
                      setData(clearedData);
                    }
                  }
                }

                if (name === "redo") {
                  // if (data.length < 1 && deletedData.length > 0) return;

                  if (deletedData.length > 0) {
                    const dataToRegain = deletedData[deletedData.length - 1];

                    if (Array.isArray(dataToRegain)) return;

                    setData([...data, dataToRegain]);

                    const newDeletedData = deletedData.slice(0, -1);
                    setDeletedData(newDeletedData);
                  }
                }

                if (name === "clear") {
                  if (data.length > 0) {
                    const dataToDelete = [...data];
                    setDeletedData([...deletedData, dataToDelete]);

                    setData([]);
                  }
                }

                if (filteredTools.includes(name)) return;

                setPreviousTool(() => activeTool);

                if (options && name !== "eraser") {
                  if (
                    (activeTool === previousTool && !toolOptionsActive) ||
                    activeTool === name
                  ) {
                    setToolOptionsActive((prev) => !prev);
                  } else {
                    setToolOptionsActive(true);
                    setSelectedOptionTool(() => options[0].name);

                    setColor(() =>
                      options[0].name.includes("highlighter")
                        ? `${options[0].color}50`
                        : options[0].color
                    );
                  }
                }

                if (name === "eraser") {
                  setColor(() => "#fff");
                }

                setActiveTool(() => name);
              }}
            >
              <Icon
                className={`${
                  name === activeTool && "text-white"
                } h-[30px] w-[30px]`}
              />
            </button>
            {activeTool === "text" && name === "text" && isTextToolOpen && (
              <div className="absolute -right-[295px] space-y-2 rounded-lg border border-neutral-400 bg-white p-2">
                <textarea
                  className="border border-neutral-400 p-2 outline-none"
                  name=""
                  id=""
                  cols={30}
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="flex justify-between">
                  <input
                    className="w-[70px] border border-neutral-400 p-2 outline-none"
                    type="number"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    min={5}
                    max={200}
                  />
                  <div className="flex w-full justify-evenly">
                    {textColors.map((txtColor) => (
                      <button type="button" key={txtColor}>
                        <GoPrimitiveDot
                          style={{ color: txtColor, borderColor: txtColor }}
                          className={`${
                            txtColor === textColor && "rounded-full border-2"
                          } h-[30px] w-[30px]`}
                          onClick={() => setTextColor(txtColor)}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  className="mt-1 w-full bg-sky-600 py-2 text-white"
                  type="button"
                  onClick={() => {
                    if (text.length > 0) {
                      const textData: IData = {
                        id: data.length + 1,
                        toolType: "text" as ActiveToolType,
                        size: textSize,
                        text,
                        position: { x: 100, y: 200 },
                        color: textColor,
                      };
                      setData([...data, textData]);
                      setText("");
                      // setTextSize(12);
                      setIsTextToolOpen(false);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            )}
            {toolOptionsActive && activeTool === name && options && (
              <div
                className={`${
                  name === "pen" || name === "highlighter"
                    ? "-right-[145px]"
                    : "-right-[75px]"
                } absolute  flex`}
              >
                <div className="mr-[2px] flex h-auto w-[70px] flex-col items-center justify-center space-y-1 rounded-lg border border-neutral-400 bg-white py-2">
                  {options.map((opt: any) => (
                    <button
                      style={{
                        borderColor:
                          selectedOptionTool === opt.name && opt.color,
                      }}
                      key={opt.name}
                      className={`${
                        selectedOptionTool === opt.name && `border-2`
                      } p-2`}
                      type="button"
                      onClick={() => {
                        // setPreviousColor(() => color);
                        setSelectedOptionTool(() => opt.name);

                        // func();

                        if (name === "shapes") {
                          setToolOptionsActive(false);

                          let newCreatedShape: IData = {} as IData;

                          if (opt.name === "circle") {
                            const newCircle: IData = {
                              id: data.length + 1,
                              toolType: "shapes",
                              shapeType: "circle",
                              position: { x: 100, y: 100 },
                              radius: 50,
                            };
                            newCreatedShape = newCircle;
                          }

                          if (opt.name === "square") {
                            const newSquare: IData = {
                              id: data.length + 1,
                              toolType: "shapes",
                              shapeType: "square",
                              position: { x: 100, y: 100 },
                              size: { width: 100, height: 100 },
                            };
                            newCreatedShape = newSquare;
                          }

                          if (opt.name === "triangle") {
                            const newTriangle: IData = {
                              id: data.length + 1,
                              toolType: "shapes",
                              shapeType: "triangle",
                              position: { x: 100, y: 100 },
                              sides: 3,
                              radius: 50,
                            };
                            newCreatedShape = newTriangle;
                          }

                          setData(() => [...data, newCreatedShape]);

                          return;
                        }

                        // setToolOptionsActive(false);
                        setColor(() =>
                          opt.name.includes("highlighter")
                            ? `${opt.color}50`
                            : opt.color
                        );
                      }}
                    >
                      {name === "pen" || name === "highlighter" ? (
                        <Icon
                          style={{ color: opt.color }}
                          className="h-[30px] w-[30px]"
                        />
                      ) : (
                        <opt.Icon
                          style={{ color: opt.color }}
                          className="h-[30px] w-[30px]"
                        />
                      )}
                    </button>
                  ))}
                </div>
                {(name === "pen" || name === "highlighter") && (
                  <div className="flex h-auto w-[70px] flex-col items-center justify-center space-y-1 rounded-lg border border-neutral-400 bg-white py-2">
                    {sizes.map((sz, i) => {
                      return (
                        <button
                          type="button"
                          style={{
                            borderColor: size === sz ? color : "",
                          }}
                          className={`p-2  ${size === sz && "border-2"}`}
                          onClick={() => {
                            setSize(() => sz);
                          }}
                        >
                          <div className="flex h-[30px] w-[30px] items-center justify-center">
                            <GoPrimitiveDot
                              style={{
                                color,
                              }}
                              className={`h-[${(i + 1) * 10}px] w-[${
                                (i + 1) * 10
                              }px] `}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
    </div>
  );
};

export default Toolbar;
