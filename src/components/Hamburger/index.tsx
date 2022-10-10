import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import LanguageSelector from "../LanguageSelector";

Modal.setAppElement("#__next");

const modalCustomStyle = {
  content: {
    top: "0",
    right: "0",
    bottom: "0",
    left: "auto",
    zIndex: 999,
    width: "auto",
    height: "100vh",
    backgroundColor: "white",
  },
};

interface HamburgerProps {
  links: Array<{ name: string; href: string }>;
  handleLogout: () => void;
}

const Hamburger = ({ links, handleLogout }: HamburgerProps) => {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const router = useRouter();

  const [burgerOpen, setBurgerOpen] = useState(false);

  useEffect(() => {
    if (burgerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [burgerOpen]);

  const handleLinkClick = (link: string) => {
    router.push(link, undefined, { shallow: true });
  };

  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setBurgerOpen(true)}>
        <GiHamburgerMenu className="h-[30px] w-[30px] text-neutral-800" />
      </button>
      <Modal
        isOpen={burgerOpen}
        onRequestClose={() => setBurgerOpen(() => false)}
        contentLabel="Burger Menu"
        style={modalCustomStyle}
        closeTimeoutMS={200}
      >
        <div className="flex h-full flex-col items-center justify-between">
          <div className="flex flex-col items-center space-y-3 px-5">
            {links.map((link, i) => (
              <button
                key={link.name}
                type="button"
                onClick={() => {
                  // router.push(link.href);
                  handleLinkClick(link.href);
                  setBurgerOpen(false);
                }}
              >
                <p className="text-lg">{t(`nav-link-${i + 1}`)}</p>
              </button>
            ))}
            {userData && (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setBurgerOpen(false);
                }}
              >
                <p className="text-lg">{t("nav-link-5")}</p>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                handleLinkClick(userData ? "/my-content" : "/auth");

                // router.push(userData ? "/my-content" : "/auth");
                setBurgerOpen(false);
              }}
            >
              <p className="text-lg">
                {userData ? t(`nav-link-6`) : t("nav-link-4")}
              </p>
            </button>
            <LanguageSelector />
          </div>
          <button
            type="button"
            className="mb-10 text-center"
            onClick={() => setBurgerOpen(false)}
          >
            <AiOutlineClose className="h-[30px] w-[30px] text-neutral-800" />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Hamburger;
