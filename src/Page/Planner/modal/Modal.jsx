import Modal from "../../../Component/Modal";
import { Fragment, useContext, useEffect, useState } from "react";
import ModalContext from "../../../Context/Modal.context";
import Task from "./task";
import Routine from "./Routine";
import Goal from "./Goal";
import { convertTimeHHmmToDate } from "../../../Util";

const TaskModal = () => {
    const { modal } = useContext(ModalContext)
    const [mode, setMode] = useState(modal.mode)
    const [dataInput, setDataInput] = useState({})
    const [areaData, setArea] = useState({
        health: false,
        play: false,
        spirituality: false,
        environment: false,
        work: false,
        finance: false,
        development: false,
        relationships: false,
    })
    const [isInitialized, setIsInitialized] = useState(false)  // Add this state

    useEffect(() => {
        if (modal.mode) 
            setMode(modal.mode)
    }, [modal.mode])
    
    useEffect(() => {
        const area = {
            health: false,
            play: false,
            spirituality: false,
            environment: false,
            work: false,
            finance: false,
            development: false,
            relationships: false,
        }

        if (modal.content !== null) {
            setDataInput({
                title: modal?.content?.title || "",
                color: modal?.content?.color || "",
                area: modal?.content?.area || [],
                deadline: modal?.content?.deadline,
                note: modal?.content?.note || "",
                dateDone: modal?.content?.dateDone || [],
                active: modal?.content?.active || false,
                isActive: modal?.content?.isActive || false,
                routineDate: modal?.content?.routineDate || [],
                target: modal?.content?.target || "0",
                routineTime:  modal?.content?.routineTime? convertTimeHHmmToDate(modal?.content?.routineTime) : new Date()
            })

            const relate = modal.content.area.reduce((prev, next) => {
                return { ...prev, [next.area]: true }
            }, area)
            setArea(relate)
        } else {
            setDataInput({
                title: "",
                color: "",
                note: "",
                area: [],
                sub: [],
                routineDate: []
            })
            setArea(area)
        }

        setIsInitialized(true)  // Mark as initialized

        return () => setDataInput({})
    }, [modal, mode, modal.content])

    if (!isInitialized) return null;  // Render nothing until initialized

    return <TaskContent 
        mode={mode}
        dataInput={dataInput}
        areaData={areaData}
        setDataInput={setDataInput}
    />
}

const TaskContent = (p) => {
    const { dataInput, setDataInput, mode, areaData } = p
    const { modal }  = useContext(ModalContext)

    return ( 
    <>
    {
    modal.type === "task" ?
        <Task 
            dataInput={dataInput} 
            setDataInput={setDataInput}
            mode={mode}
            areaData={areaData}/> :

    modal.type === "routine" ? 
        <Routine
            dataInput={dataInput} 
            setDataInput={setDataInput}
            mode={mode}
            areaData={areaData}/> :
    modal.type === "goal" ?
        <Goal
            dataInput={dataInput} 
            setDataInput={setDataInput}
            mode={mode}
            areaData={areaData}/> :
    modal.type === "tool" &&
        <>test</>
    } 
    </>
     );
}
 
export default TaskModal;