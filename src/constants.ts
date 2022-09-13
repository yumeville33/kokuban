// import { BsFacebook, BsTwitter } from "react-icons/bs";
import {
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineHighlight,
} from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import {
  BsCircle,
  BsEraser,
  BsPen,
  BsSquare,
  BsTriangle,
} from "react-icons/bs";
import {
  FaLinkedinIn,
  FaFacebook,
  FaTwitter,
  FaRegHandPointer,
  FaShapes,
} from "react-icons/fa";
import { GoTextSize } from "react-icons/go";
import { GrClear, GrRedo, GrUndo } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { HiTemplate } from "react-icons/hi";

import { ITool } from "./components/types";
import { InputType } from "./components/_page/Auth/Form";

export const APP_NAME = "Educapp" as const;

export const NAV_LINKS = [
  "Features",
  // "Pricing",
  // "Resources",
  "About",
  "Contact",
];

export const FOOTER_LINKS = [
  {
    name: "Guides",
    links: ["Step by Step Guide", "Help Center"],
  },
  {
    name: "Company",
    links: ["Blog", "About Us", "Contact"],
  },
  {
    name: "Legal",
    links: ["Terms of Use", "Privacy Policy"],
  },
];

export const FOOTER_SOCIAL_LINKS = [
  {
    name: "Facebook",
    Icon: FaFacebook,
    link: "/",
  },
  {
    name: "Instagram",
    Icon: AiFillInstagram,
    link: "/",
  },
  {
    name: "Twitter",
    Icon: FaTwitter,
    link: "/",
  },
  {
    name: "Linkedin",
    Icon: FaLinkedinIn,
    link: "/",
  },
  {
    name: "Youtube",
    Icon: AiFillYoutube,
    link: "/",
  },
  {
    name: "Email",
    Icon: MdEmail,
    link: "/",
  },
];

export const INPUT_ARRAYS = {
  sign_in: [
    {
      name: "Email",
      type: "email",
      placeholder: "Email",
      required: true,
    },
    {
      name: "Password",
      type: "password",
      placeholder: "Password",
      required: true,
    },
  ] as InputType[],
  sign_up: [
    {
      name: "Email",
      type: "email",
      placeholder: "Email",
      required: true,
    },
    {
      name: "Password",
      type: "password",
      placeholder: "Password",
      required: true,
    },
    {
      name: "Confirm Password",
      type: "password",
      placeholder: "Confirm Password",
      required: true,
    },
  ] as InputType[],
};

export const TOOLS: ITool[] = [
  {
    name: "drag",
    Icon: FaRegHandPointer,
  },
  {
    name: "template",
    Icon: HiTemplate,
  },
  {
    name: "image",
    Icon: BiImageAdd,
  },
  {
    name: "shapes",
    Icon: FaShapes,
  },
  {
    name: "text",
    Icon: GoTextSize,
  },
  {
    name: "pen",
    Icon: BsPen,
  },
  {
    name: "highlighter",
    Icon: AiOutlineHighlight,
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

export const SHAPES = [
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
];

export const SIZES = [3, 6, 10, 15];
