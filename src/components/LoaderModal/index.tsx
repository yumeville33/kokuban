import React from "react";
import Modal from "react-modal";
import Spinner from "../Spinner";

Modal.setAppElement("#__next");

const modalCustomStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    backgroundColor: "transparent",
    border: "none",
  },
};
const LoaderModal = ({ isModalOpen }: { isModalOpen: boolean }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      style={modalCustomStyle}
      contentLabel="Loader Modal"
    >
      <Spinner />
    </Modal>
  );
};

export default LoaderModal;
