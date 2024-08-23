import styled from "styled-components";

import plannerData from "./Planner.json";
import TaskSection from "./TaskSection";
import Button from "../../Component/Button";
import { Fragment, useContext, useEffect, useState } from "react";
import TaskContext from "../../Context/Task.context";
import RoutineContext from "../../Context/Routine.context";
import TaskCard from "./card/TaskCard";
import RoutineCard from "./card/RoutineCard";
import ModalContext from "../../Context/Modal.context";
// import GoalContext from "../../Context/Goal.context";
// import GoalCard from "./card/GoalCard";

import task from '../../assets/svg/task.svg'
import routine from '../../assets/svg/routine.svg'
import goal from '../../assets/svg/goal.svg'
import Loading from "../../Component/Loading";
import { ToastContainer } from "react-toastify";

const PlannerDesktop = () => {
    const [taskDateZone, setTaskDateZone] = useState("today")
    const [routineDateZone, setRoutineDateZone] = useState("today")
    // const [goalDateZone, setGoalDateZone] = useState("today")
    const { task, setTask, loading:taskLoad }  = useContext(TaskContext)
    const { routine, setRoutine, loading:routineLoad }  = useContext(RoutineContext)
    // const { goal, setGoal, loading:goalLoad }  = useContext(GoalContext)
    
    useEffect(() => {
        console.log("taskLoad", taskLoad)
    }, [taskLoad]);

    return ( 
        <>
            <ToastContainer/>
            <SectionContent sec="task" loading={taskLoad} dateZone={taskDateZone} 
                            dataSection={task} setDateSection={setTask} 
                            setDateZone={setTaskDateZone}>
               <TaskCard dataSection={task} setDateSection={setTask} dateZone={taskDateZone} setDateZone={setTaskDateZone}/>
            </SectionContent>

            <SectionContent sec="routine" loading={routineLoad} dateZone={routineDateZone}
                            dataSection={routine} setDateSection={setRoutine} 
                            setDateZone={setRoutineDateZone} >
               <RoutineCard dataSection={routine} setDateSection={setRoutine} dateZone={routineDateZone} setDateZone={setRoutineDateZone}/>
            </SectionContent>

            {/* <SectionContent sec="goal" loading={goalLoad} dateZone={goalDateZone}
                            dataSection={goal} setDateSection={setGoal} 
                            setDateZone={setGoalDateZone}>
               <GoalCard dataSection={goal} setDateSection={setGoal} dateZone={goalDateZone} setDateZone={setGoalDateZone}/>
            </SectionContent> */}
        </>
     );
}

const SectionContent = (p) => {
    const { sec, idx, dataSection, children, setDateZone, loading, dateZone } = p

    const { openModal }  = useContext(ModalContext)

    const onClickCreateTaskbtn = e => {
        const name = e.target.getAttribute("name")
        openModal(name, null, name, "add")
    }

    return (
    <TaskSection 
        key={idx}
        className="col3"
        data={sec}
        setDateZone={setDateZone}
        dateZone={dateZone}
        >
        {
           loading ? <Loading/> :
            <Fragment>
            {   dataSection.length > 0 ?
                children :
                <Fragment>
                    <ImgMotivation>
                        <img src={
                            sec === "task" ? task :
                            sec === "routine" ? routine :
                            sec === "goal" && goal
                        } 
                        alt={
                            sec === "task" ? "task-management" :
                            sec === "routine" ? "routine-management" :
                            sec === "goal" && "goal-management"
                        } 
                        />
                    </ImgMotivation> 
        
                    <TextMotivation>
                        <p>{plannerData[sec]?.empty?.text1}</p>
                        <p>{plannerData[sec]?.empty?.text2}</p>
                        <p>{plannerData[sec]?.empty?.text3}</p>
                    </TextMotivation>
                    
                    <Button title={`Tạo ${sec}`} onClick={onClickCreateTaskbtn} 
                            name={sec}
                            className="text-center"
                            style={{marginTop: "16px"}}/>
                </Fragment>
            }
            </Fragment>
        }
    </TaskSection>     
    )
}
 
export default PlannerDesktop;

const ImgMotivation = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;

    img {
        max-width: 350px;
        width: 100%;
    }
`

const TextMotivation = styled.div`

    p:nth-child(1) {
        text-align: center;
        font-weight: 600;
    }
    p:nth-child(2) {
        text-align: center;
        margin-top: .5rem;
        font-size: 1.15rem;

    }
    p:nth-child(3) {
        text-align: center;
        margin-top: .5rem;
        font-style: italic;
        font-size: 1rem;
    }
`