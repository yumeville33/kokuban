// import { BsFacebook, BsTwitter } from "react-icons/bs";
import { AiFillInstagram, AiFillYoutube } from "react-icons/ai";
import { FaLinkedinIn, FaFacebook, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const APP_NAME = "Educapp" as const;

export const NAV_LINKS = [
  "Features",
  "Pricing",
  "Resources",
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
