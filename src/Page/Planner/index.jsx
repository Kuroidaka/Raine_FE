import { useContext, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import DeviceContext from "../../context/Device.context";
import PlannerMobile from "./Planner.mobile";
import PlannerDesktop from "./Planner.desktop";
import myCursor from "../../assets/cursor/Labrador_Retriever.cur";
import { TaskProvider } from "../../context/Task.context";
import { RoutineProvider } from "../../context/Routine.context";
import { GoalProvider } from "../../context/Goal.context";

const Planner = () => {
  // const [modalData, setModalData] = useState("")
  const [tab, setTab] = useState("task");

  const { device } = useContext(DeviceContext);

  const selectTab = (e) => {
    const name = e.target.getAttribute("name");
    setTab(name);
  };

  const Mobile = () => {
    return (
      <Container>
        <PlannerMobile selectTab={selectTab} tab={tab} />
      </Container>
    );
  };

  const Desktop = () => {
    return (
      <Container style={{ paddingTop: "40px" }}>
        <PlannerDesktop />
      </Container>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.75, transition: { duration: 0.5 } }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.25 } }}
      >
        <TaskProvider>
          <RoutineProvider>
            <GoalProvider>
              {device === "desktop" ? <Desktop /> : <Mobile />}
            </GoalProvider>
          </RoutineProvider>
        </TaskProvider>
      </motion.div>
    </AnimatePresence>
  );
};

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
        color: #fdbd3e;
      }
    }
  }
`;
