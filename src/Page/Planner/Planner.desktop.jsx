import TaskSection from "./TaskSection";
import { useContext, useEffect, useState } from "react";
import TaskContext from "../../context/Task.context";
import RoutineContext from "../../context/Routine.context";
import TaskList from "./card/Task/TaskList";
import RoutineCard from "./card/RoutineCard";


import Loading from "../../component/Loading";
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
               <TaskList dataSection={task} setDateSection={setTask} dateZone={taskDateZone} setDateZone={setTaskDateZone}/>
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
    const { sec, idx, children, setDateZone, loading, dateZone } = p

    return (
    <TaskSection 
        key={idx}
        className="col3"
        data={sec}
        setDateZone={setDateZone}
        dateZone={dateZone}
        >
        {
           loading ? <Loading/> : children
        }
    </TaskSection>     
    )
}
 
export default PlannerDesktop;

