import { createContext, useContext, useEffect, useState } from "react";
import ModalContext from "../../../context/Modal.context";
// import Goal from "./Goal";
import { convertTimeHHmmToDate } from "../../../Util";
import TaskModal from "./taskModal";
import RoutineModal from "./RoutineModal";
import { TaskProvider } from "../../../context/Task.context";
import { RoutineProvider } from "../../../context/Routine.context";

export const ReminderModalContext = createContext();

const ReminderModalProvider = (p) => {
  const { children } = p;
  const { modal } = useContext(ModalContext);
  const [mode, setMode] = useState(modal.mode);
  const [dataInput, setDataInput] = useState({});
  const [areaData, setArea] = useState({
    health: false,
    play: false,
    spirituality: false,
    environment: false,
    work: false,
    finance: false,
    development: false,
    relationships: false,
  });
  const [isInitialized, setIsInitialized] = useState(false); // Add this state

  useEffect(() => {
    if (modal.mode) setMode(modal.mode);
  }, [modal.mode]);

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
    };

    console.log(modal.content);
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
        routineTime: modal?.content?.routineTime
          ? convertTimeHHmmToDate(modal?.content?.routineTime)
          : new Date(),
        taskAttachment: modal?.content?.taskAttachment || [],
      });

      const relate = modal.content.area.reduce((prev, next) => {
        return { ...prev, [next.area]: true };
      }, area);
      setArea(relate);
    } else {
      setDataInput({
        title: "",
        color: "",
        note: "",
        area: [],
        sub: [],
        routineDate: [],
      });
      setArea(area);
    }

    setIsInitialized(true); // Mark as initialized

    return () => setDataInput({});
  }, [modal, mode, modal.content]);

  if (!isInitialized) return null; // Render nothing until initialized

  const contextValue = {
    mode: mode,
    dataInput: dataInput,
    areaData: areaData,
    setDataInput: setDataInput,
  };
  return (
    <ReminderModalContext.Provider value={contextValue}>
      {children}
    </ReminderModalContext.Provider>
  );
  // return <ReminderContent
  //     mode={mode}
  //     dataInput={dataInput}
  //     areaData={areaData}
  //     setDataInput={setDataInput}
  // />
};

export const ReminderModal = () => {
  const { modal } = useContext(ModalContext);

  const modalList = [
    {
      type: "task",
      component: <TaskProvider><TaskModal /></TaskProvider>,
    },
    {
      type: "routine",
      component: <RoutineProvider><RoutineModal /></RoutineProvider>,
    },
    // {
    //   type: "goal",
    //   component: <Goal />,
    // },
  ];

  const renderComponent = () => {
    const Component = modalList.find((item) => item.type === modal.type)?.component;

    return Component ? (
      <ReminderModalProvider>
        {Component}
      </ReminderModalProvider>
    ) : null;
  };

  return renderComponent();
};

export default ReminderModal;
