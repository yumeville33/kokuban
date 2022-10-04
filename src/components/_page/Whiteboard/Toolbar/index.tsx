/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-lonely-if */
import React, { useRef, useState, useEffect } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { ChromePicker } from "react-color";
import { MdColorLens } from "react-icons/md";

import { TOOLS, SHAPES, SIZES, materialCategories } from "@/constants";
import { ActiveToolType, IData, ShapeType } from "@/components/types";
import { useAuth } from "@/contexts/AuthContext";
import fetchAPI from "@/utils/fetch";
import NextImage from "next/image";
import imageUpload from "@/utils/imageUpload";
import { useMaterials } from "@/hooks";
import { blobUrlToFile } from "@/utils/images";
import { useTranslation } from "react-i18next";

interface ToolbarProps {
  activeTool: string;
  setActiveTool: React.Dispatch<React.SetStateAction<ActiveToolType>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  color: string;
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  data: Array<IData>;
  setData: React.Dispatch<React.SetStateAction<Array<IData>>>;
  setSelectedElement: React.Dispatch<React.SetStateAction<number | null>>;
  studentData: Array<IData>;
  setStudentData: React.Dispatch<React.SetStateAction<Array<IData>>>;
  setStudentSelectedElement: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  templateData: Array<IData[]>;
  setTemplateData: React.Dispatch<React.SetStateAction<Array<IData[]>>>;
}

const Toolbar = ({
  activeTool,
  setActiveTool,
  color,
  setColor,
  size,
  setSize,
  data,
  setData,
  setSelectedElement,
  studentData,
  setStudentData,
  setStudentSelectedElement,
  templateData,
  setTemplateData,
}: ToolbarProps) => {
  const { userData } = useAuth();
  const { i18n } = useTranslation();

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [textColorPickerOpen, setTextColorPickerOpen] = useState(false);
  const [isSizeToolOpen, setIsSizeToolOpen] = useState(false);
  const [previousColor, setPreviousColor] = useState<string | null>(null);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [templates, setTemplates] = useState<Array<any>>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("art");

  // const { materials, currentMaterials, handlePrev, handleNext, loading } =
  //   useMaterials(selectedMaterial.toLowerCase().replace(/ /g, "-"));

  const { materials, currentMaterials, handlePrev, handleNext, loading } =
    useMaterials(selectedMaterial);

  const [deletedData, setDeletedData] = useState<Array<any>>([]);
  const [studentDeletedData, setStudentDeletedData] = useState<Array<any>>([]);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [textSize, setTextSize] = useState(20);

  console.log("selectedMaterial", selectedMaterial);

  const handleMaterialClick = async (material: string) => {
    const file = await blobUrlToFile(material);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = (e.target as any).result;
      img.onload = () => {
        const percentage = (150 / img.height) * 100;
        const newWidth = img.width * (percentage / 100);

        const imgData: IData = {
          id: userData ? data.length + 1 : studentData.length + 1,
          toolType: "image" as ActiveToolType,
          position: { x: 100, y: 100 },
          size: { width: newWidth, height: 150 },
          originalSize: { width: img.width, height: img.height },
          image: {
            url: material,
            ref: material,
          },
        };

        if (userData) {
          setData([...data, imgData]);
        } else {
          setStudentData([...studentData, imgData]);
        }
      };
    };

    reader.readAsDataURL(file);

    setActiveTool("drag");
  };

  useEffect(() => {
    const getOtherUserContents = async () => {
      const res = await fetchAPI(
        `${
          process.env.NEXT_PUBLIC_API_ENDPOINT as string
        }contents/otherContents/${userData?.data.user._id}`,
        "GET"
      );

      if (res.status === "success") {
        setTemplates(res.data.data);
      }
    };

    if (userData) {
      getOtherUserContents();
    }
  }, [userData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const imageUrl = await imageUpload(file);
      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent) => {
        const image = new Image();
        image.src = (event.target as any).result;

        image.onload = () => {
          const percentage = (150 / image.height) * 100;
          const newWidth = image.width * (percentage / 100);

          const imageData: IData = {
            id: userData ? data.length + 1 : studentData.length + 1,
            toolType: "image" as ActiveToolType,
            position: { x: 100, y: 100 },
            size: { width: newWidth, height: 150 },
            originalSize: { width: image.width, height: image.height },
            image: imageUrl,
          };

          if (userData) {
            setData([...data, imageData]);
          } else {
            setStudentData([...studentData, imageData]);
          }
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const handleToolClick = (toolName: ActiveToolType) => {
    if (userData) setSelectedElement(null);

    if (!userData) setStudentSelectedElement(null);

    setIsColorPickerOpen(false);
    setTextColorPickerOpen(false);
    setIsSizeToolOpen(false);

    const filteredTools = ["image", "clear", "undo", "redo"];

    if (toolName === activeTool) {
      setIsToolOpen((prev) => !prev);
    } else if (!filteredTools.includes(toolName)) {
      setIsToolOpen(true);
    }

    if (toolName === "image") {
      imageInputRef.current?.click();
      return;
    }

    if (toolName === "undo") {
      if (userData) {
        if (data.length > 0) {
          const lastElement = data[data.length - 1];
          setDeletedData([...deletedData, lastElement]);
          setData(data.slice(0, -1));
        } else {
          const clearedData = deletedData[deletedData.length - 1];
          if (Array.isArray(clearedData)) {
            const newDeletedData = deletedData.slice(0, -1);
            setDeletedData(newDeletedData);
            setData(clearedData);
          }
        }
      }

      if (!userData) {
        if (studentData.length > 0) {
          const lastElement = studentData[studentData.length - 1];
          setStudentDeletedData([...studentDeletedData, lastElement]);
          setStudentData(studentData.slice(0, -1));
        } else {
          const studentClearedData =
            studentDeletedData[studentDeletedData.length - 1];
          if (Array.isArray(studentClearedData)) {
            const newStudentDeletedData = studentDeletedData.slice(0, -1);
            setStudentDeletedData(newStudentDeletedData);
            setStudentData(studentClearedData);
          }
        }
      }
    }

    if (toolName === "redo") {
      if (userData) {
        if (deletedData.length > 0) {
          const dataToRegain = deletedData[deletedData.length - 1];
          if (Array.isArray(dataToRegain)) return;

          setData([...data, dataToRegain]);
          const newDeletedData = [...deletedData].slice(0, -1);
          setDeletedData(newDeletedData);
        }
      }

      if (!userData) {
        if (studentDeletedData.length > 0) {
          const dataToRegain =
            studentDeletedData[studentDeletedData.length - 1];
          if (Array.isArray(dataToRegain)) return;
          setStudentData([...studentData, dataToRegain]);
          const newDeletedData = [...studentDeletedData].slice(0, -1);
          setStudentDeletedData(newDeletedData);
        }
      }
    }

    if (toolName === "clear") {
      if (userData) {
        if (data.length > 0) {
          const dataToDelete = [...data];
          setDeletedData([...deletedData, dataToDelete]);
          setData([]);
        }
      }

      if (!userData) {
        if (studentData.length > 0) {
          const dataToDelete = [...studentData];
          setStudentDeletedData([...studentDeletedData, dataToDelete]);
          setStudentData([]);
        }
      }
    }

    if (filteredTools.includes(toolName)) return;

    // setPreviousTool(() => activeTool);

    // if (options && toolName !== "eraser") {
    //   if (
    //     (activeTool === previousTool && !toolOptionsActive) ||
    //     activeTool === toolName
    //   ) {
    //     setToolOptionsActive((prev) => !prev);
    //   } else {
    //     setToolOptionsActive(true);
    //     setSelectedOptionTool(() => options[0].toolName);
    //   }
    // }

    if (previousColor) {
      setColor(previousColor);
      setPreviousColor(null);
    }

    if (toolName === "eraser") {
      setPreviousColor(() => color);
      setColor(() => "#fff");
    }

    setActiveTool(() => toolName);
  };

  const handleShapeTool = (shapeType: ShapeType) => {
    let newCreatedShape: IData = {} as IData;

    if (shapeType === "circle") {
      const newCircle: IData = {
        id: userData ? data.length + 1 : studentData.length + 1,
        toolType: "shapes",
        shapeType: "circle",
        position: { x: 100, y: 100 },
        radius: 50,
        color,
      };
      newCreatedShape = newCircle;
    }

    if (shapeType === "square") {
      const newSquare: IData = {
        id: userData ? data.length + 1 : studentData.length + 1,
        toolType: "shapes",
        shapeType: "square",
        position: { x: 100, y: 100 },
        size: { width: 100, height: 100 },
        color,
      };
      newCreatedShape = newSquare;
    }

    if (shapeType === "triangle") {
      const newTriangle: IData = {
        id: userData ? data.length + 1 : studentData.length + 1,
        toolType: "shapes",
        shapeType: "triangle",
        position: { x: 100, y: 100 },
        sides: 3,
        radius: 50,
        color,
      };
      newCreatedShape = newTriangle;
    }

    if (userData) setData(() => [...data, newCreatedShape]);
    if (!userData) setStudentData(() => [...studentData, newCreatedShape]);
  };

  const handleTextTool = () => {
    if (text.length > 0) {
      const textData: IData = {
        id: userData ? data.length + 1 : studentData.length + 1,
        toolType: "text" as ActiveToolType,
        size: {
          size: textSize,
        },
        text,
        position: { x: 100, y: 200 },
        color,
      };

      if (userData) setData([...data, textData]);

      if (!userData) setStudentData([...studentData, textData]);

      setText("");
      setIsToolOpen(false);
      setTextColorPickerOpen(false);
    }
  };

  return (
    <div
      className={`relative z-[50] flex h-full w-[70px] flex-col items-center justify-center space-y-1 border-r-2 bg-white ${
        i18n.language === "en" ? "font-enSans" : "font-jaSans"
      }`}
    >
      {TOOLS &&
        TOOLS.map(({ name, Icon }) => {
          if (name === "template" && !userData) return null;

          return (
            <React.Fragment key={name}>
              {name === "image" && (
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e)}
                />
              )}
              <button
                type="button"
                className={`${name === activeTool && "bg-sky-600"} p-2`}
                onClick={() => {
                  handleToolClick(name);
                }}
              >
                <Icon
                  className={`${
                    name === activeTool && "text-white"
                  } h-[25px] w-[25px] xl:h-[30px] xl:w-[30px]`}
                />
              </button>
              {activeTool === "material" && name === "material" && isToolOpen && (
                <div className="absolute left-[70px]  w-auto rounded-lg border border-neutral-400 bg-white p-2">
                  <div className="flex items-center justify-between py-3 px-2">
                    {/* <div className="text-lg font-medium">
                      Choose type of material
                    </div> */}
                    <select
                      className="rounded-lg border border-neutral-400 px-2 py-1 outline-none"
                      onChange={(e) => {
                        console.log("e.target.value", e.target.value);
                        setSelectedMaterial(e.target.value);
                      }}
                    >
                      {materialCategories.map((category) => {
                        return (
                          <option key={category.key} value={category.key}>
                            {i18n.language === "en"
                              ? category.enName
                              : category.jaName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {materials && materials.length === 0 && (
                    <div className="text-center text-sm text-neutral-400">
                      No material available
                    </div>
                  )}
                  {loading && (
                    <div className="flex h-[240px] items-center justify-center">
                      <p>Loading materials...</p>
                    </div>
                  )}
                  <div className="grid w-[410px] grid-cols-3 gap-[5px]">
                    {!loading &&
                      currentMaterials.map((material) => (
                        <button
                          key={material}
                          className="relative h-[80px] w-[130px] border border-neutral-300"
                          type="button"
                          onClick={() => {
                            handleMaterialClick(material);
                          }}
                        >
                          {/* <NextImage
                          layout="fill"
                          objectPosition="center"
                          objectFit="contain"
                          src={material}
                        /> */}
                          {/* // eslint-disable-next-line @next/next/no-img-element */}

                          <img
                            src={material}
                            alt=""
                            className="h-full w-full object-contain object-center"
                          />
                        </button>
                      ))}
                  </div>

                  <div className="mt-[10px] flex w-full">
                    <div className="mx-auto space-x-3">
                      <button
                        type="button"
                        className="rounded-md border border-neutral-300 bg-neutral-300 py-[2px] px-5 text-sm font-medium text-neutral-700"
                        onClick={() => {
                          handlePrev();
                        }}
                      >
                        previous
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-neutral-300 bg-neutral-300 py-[2px] px-5 text-sm font-medium text-neutral-700"
                        onClick={() => {
                          handleNext();
                        }}
                      >
                        next
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeTool === "template" && name === "template" && isToolOpen && (
                <div className="absolute left-[70px]  rounded-lg border border-neutral-400 bg-white p-2">
                  <div className="mb-2 text-center text-sm">Templates</div>
                  <div className="space-y-2">
                    {templates.length === 0 && (
                      <div className="text-center text-sm text-neutral-400">
                        No template available
                      </div>
                    )}
                    <div></div>
                    {templates.map((template) => (
                      <button
                        key={template._id}
                        className="relative h-[80px] w-[130px] border border-neutral-300"
                        type="button"
                        onClick={() => {
                          // set
                          setTemplateData([...templateData, template.content]);
                        }}
                      >
                        <NextImage
                          layout="fill"
                          objectPosition="center"
                          objectFit="contain"
                          src={template.thumbnail.url}
                        />
                      </button>
                    ))}
                    <div className="flex w-full justify-evenly ">
                      <button
                        type="button"
                        className="border border-neutral-300 py-[2px] px-2"
                      >
                        {"<"}
                      </button>
                      <button
                        type="button"
                        className="border border-neutral-300 py-[2px] px-2"
                      >
                        {">"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeTool === "text" && name === "text" && isToolOpen && (
                <div className="absolute left-[70px] space-y-2 rounded-lg border border-neutral-400 bg-white p-2">
                  <textarea
                    className="border border-neutral-400 p-2 outline-none"
                    name=""
                    id=""
                    cols={25}
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
                    <div className="flex items-center">
                      <MdColorLens
                        style={{ color }}
                        className="h-[30px] w-[30px]"
                      />
                      <button
                        className="h-full"
                        type="button"
                        onClick={() => setTextColorPickerOpen((prev) => !prev)}
                      >
                        <div
                          style={{ backgroundColor: color }}
                          className="h-full w-[50px]"
                        />
                      </button>
                    </div>
                  </div>
                  <button
                    className="mt-1 w-full bg-sky-600 py-2 text-white"
                    type="button"
                    onClick={handleTextTool}
                  >
                    Apply
                  </button>
                  {textColorPickerOpen && (
                    <div className="absolute -right-[232px] -top-[8px]">
                      <ChromePicker
                        color={color}
                        onChange={(clr) => {
                          setColor(clr.hex);
                        }}
                        disableAlpha
                      />
                    </div>
                  )}
                </div>
              )}
              {(activeTool === "pen" ||
                activeTool === "highlighter" ||
                activeTool === "shapes") &&
                isToolOpen && (
                  <div className={`absolute -right-[80px] h-auto `}>
                    <div className="mr-[2px] flex h-auto w-[70px] flex-col items-center justify-center space-y-1 rounded-lg border border-neutral-400 bg-white py-2">
                      <button
                        type="button"
                        className="mb-2 flex flex-col justify-center"
                        onClick={() => {
                          setIsSizeToolOpen(false);
                          setIsColorPickerOpen((prev) => !prev);
                        }}
                      >
                        <div className="text-xs">Color</div>
                        <div
                          style={{ backgroundColor: color }}
                          className="h-[30px] w-[30px]"
                        />
                      </button>

                      {activeTool === "shapes" &&
                        SHAPES.map((s) => (
                          <button
                            type="button"
                            key={s.name}
                            className="p-2"
                            onClick={() => {
                              const shape = s.name as ShapeType;
                              handleShapeTool(shape);
                            }}
                          >
                            <s.Icon
                              style={{ color }}
                              className="h-[30px] w-[30px]"
                            />
                          </button>
                        ))}
                      {(activeTool === "pen" ||
                        activeTool === "highlighter") && (
                        <button
                          type="button"
                          className=""
                          onClick={() => {
                            setIsColorPickerOpen(false);
                            setIsSizeToolOpen((prev) => !prev);
                          }}
                        >
                          <GoPrimitiveDot
                            style={{
                              color,
                              fontSize:
                                size +
                                10 * (1 + SIZES.findIndex((sz) => sz === size)),
                            }}
                            className=""
                          />
                        </button>
                      )}
                    </div>
                    {isSizeToolOpen && (
                      <div className="absolute left-[75px] bottom-[0px] flex rounded-lg border border-neutral-400 bg-white">
                        {SIZES.map((sz, i) => {
                          return (
                            <button
                              type="button"
                              className="px-2"
                              key={sz}
                              onClick={() => setSize(sz)}
                            >
                              <GoPrimitiveDot
                                style={{ color, fontSize: sz + 10 * (1 + i) }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {isColorPickerOpen && (
                      <div className="absolute -right-[232px] top-[2px]">
                        <ChromePicker
                          color={color}
                          onChange={(clr) => {
                            setColor(clr.hex);
                          }}
                          disableAlpha
                        />
                      </div>
                    )}
                  </div>
                )}
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default Toolbar;
