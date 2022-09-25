import { IconType } from "react-icons";

export type ImageType = {
  url: string;
  ref?: string;
};

export interface Position {
  x: number;
  y: number;
}

export type SizeType = {
  height?: number;
  width?: number;
  size?: number;
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
  | "material"
  | "template"
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

// export type ImageType = {
//   uri: string;
//   extensionType: string;
// };

export interface IData {
  id: number | string;
  toolType: ActiveToolType;
  color?: string;
  points?: Array<number>;
  position?: Position;
  size?: SizeType;
  radius?: number;
  shapeType?: ShapeType;
  sides?: number;
  originalSize?: SizeType;
  image?: ImageType;
  text?: string;
}
