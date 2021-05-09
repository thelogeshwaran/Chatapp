import React from "react";
import { motion } from "framer-motion";
import { usePopupProvider } from "../../Context/PopupProvider";
import "./Modal.css";

const Modal = () => {
  const { selected, setSelected } = usePopupProvider();
  const handleClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setSelected(null);
    }
  };
  return (
    <div className="modal" onClick={handleClick}>
      <motion.img
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        src={selected}
        alt="selected img"
      />
    </div>
  );
};

export default Modal;
