import Modal from "../../../Component/Modal";
import { useContext, useEffect, useRef, useState } from "react";
import ModalContext from "../../../Context/Modal.context";
import Task from "./task";
import Routine from "./Routine";
import Goal from "./Goal";

const TaskModal = () => {
    const { modal }  = useContext(ModalContext)
    const [editMode, setEditMode] = useState(!!modal.content)
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
        if(modal.content !== null) 
            setEditMode(true)
        else 
            setEditMode(false)
    },[modal.content])
    
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
    }, [editMode, modal.content]);



    // useEffect(() => {
    //     if(modal.content) {
    //         const relate = modal.content.area.forEach(area => { data[area] = true })
    //         setArea(relate)
    //         console.log("relate", relate)
    //     }
    // }, [editMode]);


    return <TaskContent 
                mode={ editMode ? "edit" : "add"}
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