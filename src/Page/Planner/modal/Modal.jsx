import Modal from "../../../Component/Modal";
import { useContext, useEffect, useState } from "react";
import ModalContext from "../../../Context/Modal.context";
import Task from "./task";
import Routine from "./Routine";
import Goal from "./Goal";

const TaskModal = () => {
    const { modal }  = useContext(ModalContext)
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

    useEffect(() => {
        if(modal.mode) 
            setMode(modal.mode)
    },[modal.mode])
    
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
        
        console.log("modal", modal)

        if(modal.content !== null) {
            
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
            })


            const relate = modal.content.area.reduce((prev, next) => {
                return {...prev, [next.area]: true}
            }, area)
            console.log("relate", relate)
            setArea(relate)
        } else {
            setDataInput({
                title: "",
                color: "",
                note: "",
                // deadline: "",
                area: [],
                sub: [],
                routineDate: []
            })
            setArea(area)
        }

        return () => setDataInput({})
    }, [modal, mode, modal.content]);


    return <TaskContent 
                mode={ mode }
                dataInput={ dataInput }
                areaData={ areaData }
                setDataInput = {setDataInput}
                // areaData={area} 
                />
}

const TaskContent = (p) => {
    const { dataInput, setDataInput, mode, areaData } = p
    const { modal }  = useContext(ModalContext)


    return ( 
    <Modal >
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
    modal.type === "goal" &&
        <Goal
            dataInput={dataInput} 
            setDataInput={setDataInput}
            mode={mode}
            areaData={areaData}/> 
    }
    </Modal>
     );
}
 
export default TaskModal;