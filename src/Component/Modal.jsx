import { motion } from "framer-motion";
import styled from "styled-components";
import { Icon } from "/src/assets/icon.js";
import { Fragment, useEffect, useState, useContext } from "react";
import DeviceContext from "../Context/Device.context";
import ModalContext from "../Context/Modal.context";
import Loading from "./Loading"
import Overlay from "../Layout/Component/Overlay";
import myCursor from '../assets/cursor/Labrador_Retriever.cur';
import TaskModal from "../Page/Planner/modal/Modal";
import ToolsDataModal from "../Page/Chat/ToolsDataModal";

const Modal = () => {

    const { device } = useContext(DeviceContext)

    const { modal, closeModal, isDataLoaded, setIsDataLoaded } = useContext(ModalContext);
    const [isOpenOverlay, setIsOpenOverlay] = useState(false);
    useEffect(() => {
        console.log("listen event opening modal")
        window.addEventListener('modalOpening', openingModal);
        window.addEventListener('modalClosing', () => {
            device !== "mobile" && setIsOpenOverlay(false)
        });

        
        
        return () => {
          window.removeEventListener('modalOpening', openingModal);
        };
      }, [device]);

    const modalStyle = {
        open: () => ({
            width: device === "desktop" ? "400px" : "100vw",
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 50
            }
        }),
        closed: {
            width: 0,
            opacity: 0,
            transition: {
                delay: 0,
                type: 'spring',
                stiffness: 900,
                damping: 40
            }
        }
    };

    const openingModal = () => { // prepare a lazy loading waiting for the animation loaded
        device !== "mobile" && setIsOpenOverlay(true)
        setTimeout(() => {
            setIsDataLoaded(true);
        }, 500); 
    }

    const hdleToggle = () => {
        closeModal()
        setIsOpenOverlay(false)
    }

    const hdleClickOverLay = () => {
        return hdleToggle()

    }

    const renderModalContent = () => {

        if(["task", "goal", "routine"].indexOf(modal.type) !== -1) {
            return <TaskModal />
        }

        if(modal.type === "tool") {
            return <ToolsDataModal />
        }
    }

    return (   
     <Fragment>
        <Container
            initial={"closed"}
            animate={modal.isOpen ? 'open' : 'closed'}
            variants={modalStyle}
            >
            <Title>
                <h1>{modal.title}</h1>
                <Icon.x onClick={hdleToggle}  style={{cursor: `url(${myCursor}), auto`}}/>
            </Title>
           {isDataLoaded ? renderModalContent(): <Loading />}
        </Container> 
        <Overlay onClick={hdleClickOverLay} 
            isOpen={isOpenOverlay}
            setIsOpen={setIsOpenOverlay}
            zIndex={"1000"}
            />
     </Fragment>
    );
}
 
export default Modal;

const Container = styled(motion.div)` 
    right: 0;
    height: 100dvh;
    z-index: 1002;
    background-color: #ffffff;
    position: fixed;
    top: 0;
`

const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    height: var(--modal-header);

    h1 {
        font-size: 2.3rem;
        color: #2c2c2c;
    }

    svg {
        font-size: 2.4rem;
    }
`

