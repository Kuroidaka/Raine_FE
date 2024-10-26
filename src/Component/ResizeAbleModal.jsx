import { motion } from "framer-motion";
import { useCallback, useContext, useEffect, useState, useRef, forwardRef } from "react";
import styled from "styled-components";
import DeviceContext from "../context/Device.context";

function ResizeAbleModal(p) {
  const { modal, children } = p;
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(368);
  const { device } = useContext(DeviceContext);

  const startResizing = useCallback((mouseDownEvent) => {
    setIsResizing(true);
    mouseDownEvent.preventDefault(); // Prevent text selection
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent) => {
        if (isResizing && sidebarRef.current) {
            const newWidth =
             sidebarRef.current.getBoundingClientRect().right - mouseMoveEvent.clientX;
        setSidebarWidth(newWidth); // Minimum width safeguard
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const modalStyle = {
    open: () => ({
      width: device === "desktop" ? `${sidebarWidth}px` : "100vw",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 50,
      },
    }),
    closed: {
      width: 0,
      opacity: 0,
      transition: {
        delay: 0,
        type: "spring",
        stiffness: 900,
        damping: 40,
      },
    },
  };

  return (
    <ModalWrapper
      modal={modal}
      sidebarWidth={sidebarWidth}
      modalStyle={modalStyle}
      ref={sidebarRef}
    >
      {device === "desktop" && <AppSidebarResizer onMouseDown={startResizing} />}
      {children}
    </ModalWrapper>
  );
}

export default ResizeAbleModal;

const ModalWrapper = forwardRef((p, ref) => {

    const { children, modal, sidebarWidth, modalStyle } = p;

    return (
    <StyledModalWrapper
      initial="closed"
      animate={modal.isOpen ? "open" : "closed"}
      variants={modalStyle}
      ref={ref}
      style={{ 
        width: `${sidebarWidth}px!important`, 
        minWidth: modal.isOpen ? "200px" : "0px",
        maxWidth: modal.isOpen ? "600px" : "0px",
      }}
    >
      {modal.isOpen && children}
    </StyledModalWrapper>
  );
});

ModalWrapper.displayName = "ModalWrapper";

const StyledModalWrapper = styled(motion.div)`
  right: 0;
  height: 100vh;
  min-width: 200px;
  max-width: 600px;
  z-index: 1002;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  border-right: 1px solid #e9e9e9;
  display: flex;
`;

const AppSidebarResizer = styled.div`
  width: 6px;
  cursor: col-resize;
  background-color: #c1c3c5;
  flex-shrink: 0;

  &:hover {
    background-color: #a9a9a9;
  }
`;
