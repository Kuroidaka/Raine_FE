import { useContext, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import DeviceContext from "../../Context/Device.context";
import PlannerMobile from "./Planner.mobile";
import PlannerDesktop from "./Planner.desktop";
import { ModalProvider } from "../../Context/Modal.context";
import TaskModal from "./modal/Modal";
import { TaskProvider } from "../../Context/Task.context";
import { RoutineProvider } from "../../Context/Routine.context";
import { GoalProvider } from "../../Context/Goal.context";
import myCursor from "../../assets/cursor/Labrador_Retriever.cur";

const Planner = () => {

    // const [modalData, setModalData] = useState("")
    const [tab, setTab] = useState("task")
    

    const { device } = useContext(DeviceContext)


    const selectTab = (e) => {
        const name = e.target.getAttribute("name")
        setTab(name)
    }
    
    const Mobile = () => {
        return (
            <Container >
                <PlannerMobile selectTab={selectTab} tab={tab} />
            </Container>
    )}

    const Desktop = () => {
        return (
            <Container style={{paddingTop: "40px"}}> 
                <PlannerDesktop/>
            </Container>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <TaskProvider>
                <RoutineProvider>
                    <GoalProvider>
                        <ModalProvider>
                            <motion.div initial={{ opacity: 0,  scale: .75, transition: { duration: .5 } }}
                                        animate={{ opacity: 1, scale: 1, transition: { duration: .25 } }}>
                                <TaskModal />
                                {device === "desktop" ? <Desktop /> : <Mobile /> }
                            </motion.div>
                        </ModalProvider>
                    </GoalProvider>
                </RoutineProvider>
            </TaskProvider> 
        </AnimatePresence>
    )
}


export default Planner;

const Container = styled(motion.div)`
    width: 100%;
    height: 100%;
    padding-right: 25px;
    padding-bottom: 0px;
    padding-left: 25px;
    display: flex;

    section h2 {
        white-space: nowrap;

    }

    section h2.title {
        font-size: 45px;
        font-weight: 900;
        display: flex;
        align-items: center;
        font-family: fantasy;
        padding-top: 30px;
        .icon-wrap {
            display: block;
            line-height: 30px;
            font-size: 43px;
            position: relative;
            cursor: url(${myCursor}), auto;
            transition: all 0.3s ease-in-out;

            &:hover {
                    color: #FDBD3E;
                }
        }
    }
`
