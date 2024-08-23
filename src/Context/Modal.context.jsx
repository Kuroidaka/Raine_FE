import React, { createContext, useContext } from "react";
import OverlayContext from "./Overlay.context";
import DeviceContext from "./Device.context";
// import OverlayContext from "./Overlay.context";

const ModalContext = createContext()

export const ModalProvider = (p) => {
    const { children } = p

    const { closeOverlay, openOverlay } = useContext(OverlayContext)
    const { device } = React.useContext(DeviceContext)

    const [modal, setModal] = React.useState({
        isOpen: false,
        title: null,
        content: null,
        type: null,
        mode: null
      });
      const [isDataLoaded, setIsDataLoaded] = React.useState(false);
      
      const openModal = (title = null, content = null, type = null, mode = "view") => {
        device !== "mobile" && openOverlay()
        setModal({
          isOpen: true,
          title,
          content,
          type,
          mode
        });
        window.dispatchEvent(new CustomEvent('modalOpening'));
      };
    
      const closeModal = () => {
        console.log("close modal")
        device !== "mobile" && closeOverlay()
        setModal({
          isOpen: false,
          content: null,
          title: null,
          type: null,
          mode: null
        });
        setIsDataLoaded(false);
        window.dispatchEvent(new CustomEvent('modalClosing'));
      };

      const valueContext = {
        modal, openModal, closeModal, isDataLoaded, setIsDataLoaded
      }

    return (
        <ModalContext.Provider value={valueContext}>
            {children}
        </ModalContext.Provider>
    )
}

export default ModalContext