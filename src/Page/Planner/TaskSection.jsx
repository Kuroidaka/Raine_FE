import { motion } from "framer-motion"
import { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import plannerData from "./Planner.json";
import ModalContext from "../../context/Modal.context";
import myCursor from '../../assets/cursor/Labrador_Retriever.cur';
import { Icon } from "../../assets/icon"

const TaskSection = (p) => {

    const { data, children, setDateZone, dateZone } = p
    // 
    const [state, setState] = useState(dateZone)
    const { openModal }  = useContext(ModalContext)
    
    const hleSelctDateZ = (e) => {
        const name = e.target.getAttribute("name")
        console.log(data, name)
        setDateZone(name);
        setState(name)
    }

    const handleClickAdd = (e) => {
        const name = e.currentTarget.getAttribute("name")
        console.log("name", name)
        openModal(name, null, name, "add")
    }
    useEffect(() => {
        setState(dateZone)
    }, [dateZone]);
    
    return (
    <Task 
        // drag
        // dragDirectionLock
        // dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        // dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        // dragElastic={0.5}
        >
        <h2 className="select-none text-dark title">{plannerData[data].value}
            <div className="icon-wrap" >
                <span name={plannerData[data].name} onClick={handleClickAdd} ><Icon.plus /></span>
            </div>
        </h2>
        <DateZone >
            {plannerData[data].dateZone && plannerData[data].dateZone.map(date => {    
                return (
                <span 
                    style={{cursor: `url(${myCursor}), auto`}}
                    key={date.name}
                    name={date.name}
                    className={`select-none ${state === date.name ? "active" : ""}`}
                    onClick={hleSelctDateZ}>{date.value}</span>
                )
            })}
        </DateZone> 
        {children}
    </Task>
    )
}

export default TaskSection;


const Task = styled(motion.section)`
    width: 100%;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    margin-top: 16px;

    h2.title {
        letter-spacing: 4px;
        line-height: 0;
    }

    .icon-wrap {
        margin-left: 10px;
        span {
            display: flex;
            position: relative;
            top: -10px;
            justify-content: center;
            width: 31px;
            svg {
                font-size: 2.4rem;
            }
        }
    }
`

const DateZone = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: 20px;
    line-height: 2;

    span {
        margin-right: 1.5rem;
        color: #626262;
        font-weight: 500;
        font-family: fantasy;
        font-weight: 600;
        transition: all 0.3s ease-in-out;

        &:hover {
            color: #FDBD3E;
        }

        &.active {
            color: #000000;
            font-size: larger;
            font-weight: 800;
        }
    }
`
