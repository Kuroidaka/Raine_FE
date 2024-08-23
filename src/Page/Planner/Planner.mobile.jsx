import styled from "styled-components";
import {  Fragment, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import TaskSection from "./TaskSection";
import plannerData from "./Planner.json";
import Button from "../../Component/Button";
import TaskCard from "./card/TaskCard";
import TaskContext from "../../Context/Task.context";
import Loading from "../../Component/Loading";
import ModalContext from "../../Context/Modal.context";
import RoutineContext from "../../Context/Routine.context";
import RoutineCard from "./card/RoutineCard";
import GoalContext from "../../Context/Goal.context";
import GoalCard from "./card/GoalCard";
import { ToastContainer } from "react-toastify";

const PlannerMobile = (p) => {
    const { selectTab, tab } = p
    const { task, loading:taskLoad, setTask }  = useContext(TaskContext)
    const { routine, loading:routineLoad, setRoutine }  = useContext(RoutineContext)
    const { goal, setGoal, loading:goalLoad }  = useContext(GoalContext)
    // const selectTab = (e) => {
    //     const name = e.target.getAttribute("name")
    //     setTab(name)
    // }

    useEffect(() => {
        console.log(tab)
    }, [tab]);

    return ( 
        <Container>
            <Header>
                <TabList>
                {plannerData && Object.keys(plannerData).map((plan) => {
                    return (
                        <motion.li
                            key={plan}
                            name={plan}
                            className={`col3 pointer-cursor ${tab === plan ? "active" : ""}`}
                            onClick={selectTab}>
                        {plan}
                        {tab === plan ? (<Underline layoutId="underline" />) : null}
                        </motion.li>
                    )
                })}
                </TabList> 
            </Header>
            
            <ToastContainer/>
            { 
                tab === "task" ? taskLoad ? <Loading /> :
                    <TaskSectionMobile 
                        tab={tab} 
                        data={task}
                        setDateSection={setTask}
                    />:
                
                tab === "routine" ? routineLoad ? <Loading /> :
                    <TaskSectionMobile 
                        tab={tab} 
                        data={routine}
                        setDateSection={setRoutine}
                    />:
                tab === "goal" && goalLoad ? <Loading /> :
                    <TaskSectionMobile 
                        tab={tab} 
                        data={goal}
                        setDateSection={setGoal}
                    />
                
            }
        </Container>
     );
}


const TaskSectionMobile = (p) => {
    const { tab, data, setDateSection,  } = p
    const [dateZone, setDateZone] = useState('task')
    const { openModal }  = useContext(ModalContext)

    const tabStyle = {
        initial: () => {
            return {
                x: -50,
                opacity: 0
            }
        },
        appear: () => {
            return {
                x: 0,
                opacity: 1
            }
        },
        disappear: () => {
            return {
                x: 50,
                opacity: 0
            }
        }
    }


    const hdleClickBtn = (e) => {
        const name = e.target.getAttribute("name")
        openModal(name, null, name, "add")
    }

    return (
    <AnimatePresence mode="wait">
        <motion.div key={tab ? tab : "task" } 
                    variants={tabStyle}
                    animate="appear"
                    initial="initial"
                    exit="disappear"
                    transition={{ duration: 0.2 }} 
                    >
            
            <TaskSection 
                key={tab} 
                className="col3" 
                data={tab} // task, routine, goal
                setDateZone={setDateZone}
                dateZone={dateZone}
                >
            {data && data.length > 0 &&
                tab === "task" ?<TaskCard dataSection={data} setDateSection={setDateSection} dateZone={dateZone} setDateZone={setDateZone}/> :
                tab === "routine" ?<RoutineCard dataSection={data} setDateSection={setDateSection} dateZone={dateZone} setDateZone={setDateZone}/> :
                tab === "goal" ?<GoalCard dataSection={data} setDateSection={setDateSection} dateZone={dateZone} setDateZone={setDateZone}/> 
                :<Fragment>
                    <ImgMotivation>
                        <img src={plannerData[tab]?.empty?.img} 
                            alt={
                                tab === "task" ? "task-management" :
                                tab === "routine" ? "routine-management" :
                                tab === "goal" && "goal-management"
                            } 
                        />
                    </ImgMotivation> 

                    <TextMotivation>
                        <p>{plannerData[tab]?.empty?.text1}</p>
                        <p>{plannerData[tab]?.empty?.text2}</p>
                        <p>{plannerData[tab]?.empty?.text3}</p>
                    </TextMotivation>
                    
                    <Button title={`Tạo ${tab}`}  
                            className="text-center"
                            style={{marginTop: "16px"}}
                            name={tab}
                            onClick={hdleClickBtn}/>
                </Fragment>
            }
            </TaskSection>     
        </motion.div>
    </AnimatePresence>
    )
}



export default PlannerMobile;

const Container = styled.div`
    width: 100%;
    height: 100%;
    
`

const Header = styled.div`
    width: 100%;
    height: 30px;
`

const TabList = styled.ul`
    list-style: none;
    display: flex;
    justify-content: center;
    height: 100%;
    box-shadow: 0 0 25px 0 rgba(0,0,0,.04);

    li {
        text-align: center;
        height: 100%;
        font-size: 1.4rem;
        font-weight: 500;
        position: relative;
        transition: all 0.3s ease-in-out;
        &.active {
            user-select: none;

        }
    }
`

const ImgMotivation = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;

    img {
        max-width: 250px;
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
const Underline = styled(motion.div) `
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--main-gradient);
    border-radius: 10px;
`

