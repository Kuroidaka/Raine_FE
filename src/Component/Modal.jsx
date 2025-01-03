import styled from "styled-components";
import { Icon } from "/src/assets/icon.js";
import { Fragment, useEffect, useState, useContext } from "react";
import DeviceContext from "../context/Device.context";
import ModalContext from "../context/Modal.context";
import Loading from "./Loading"
import Overlay from "../Layout/Component/Overlay";
import myCursor from '../assets/cursor/Labrador_Retriever.cur';
import ToolsDataModal from "../Page/Chat/ToolsDataModal";
import RelateMemoModal from "../Page/Chat/RelateMemoModal";
import ResizeAbleModal from "./ResizeableModal";
import ReminderModal from "../page/Planner/modal/Modal";

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
            return <ReminderModal />
        }

        if(modal.type === "tool") {
            return <ToolsDataModal />
        }

        if(modal.type === "memo") {
            return <RelateMemoModal />
        }
    }

    return (   
     <Fragment>
        <ResizeAbleModal modal={modal}>
            <div style={{width: "100%"}}>
                <Title>
                    <h1>{modal.title}</h1>
                    <Icon.x onClick={hdleToggle}  style={{cursor: `url(${myCursor}), auto`}}/>
                </Title>
            {isDataLoaded ? renderModalContent(): <Loading />}
            </div>
        </ResizeAbleModal> 
        <Overlay onClick={hdleClickOverLay} 
            isOpen={isOpenOverlay}
            setIsOpen={setIsOpenOverlay}
            zIndex={"1000"}
            />
     </Fragment>
    );
}
 
export default Modal;


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

