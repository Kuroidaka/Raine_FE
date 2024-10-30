import styled from "styled-components";
import {
  useState,
  useEffect,
  Fragment,
  useContext,
} from "react";
import {
  convertDates,
} from "../../../../Util";

import plannerData from "../../../../Page/Planner/Planner.json";
import ModalContext from "../../../../context/Modal.context";
import language from "../../../../Util/language";
import EmptyData from "../../EmptyData";
import TaskCard from "./TaskCard";
import SelectTaskDate from "./SelectDateZone";
import DateZoneLabel from "./DateZoneLabel";

const TaskList = (p) => {
  const { dataSection, dateZone, setDateZone } = p;
  const modalContext = useContext(ModalContext);
  // const { task }  = useContext(TaskContext)
  const [dateType, setDateType] = useState({
    overdue: [],
    today: [],
    tomorrow: [],
    someDay: [],
    dateAfterTomorrow: [],
    done: [],
  });
  const [dAfterTArr, setDAfterTArr] = useState();

  useEffect(() => {
    const options = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZoneName: "short",
    };

    const filterTasksByDeadline = (tasks, deadline) => {
      const deadlineDate = new Date(deadline);
      return tasks.filter((task) => {
        const taskDeadline = new Date(task.deadline);
        return (
          taskDeadline.toLocaleString("en-US", options) ===
          deadlineDate.toLocaleString("en-US", options)
        );
      });
    };

    const setupDate = () => {
      const today = new Date();

      const overDueTasks = dataSection.filter((task) => {
        if (task.deadline !== null && task.status === false) {
          const deadline = new Date(task.deadline);
          return convertDates([deadline])[0] < convertDates([today])[0];
        }
      });

      const todayTasks = filterTasksByDeadline(dataSection, today);

      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTasks = filterTasksByDeadline(dataSection, tomorrow);

      const newDateArr = [];
      const dATTasksArr = [];
      let dateAfterTomorrow = new Date();
      dateAfterTomorrow.setDate(dateAfterTomorrow.getDate() + 2);

      for (let i = 0; i < 5; i++) {
        let dateAfter = new Date();
        dateAfter.setDate(dateAfter.getDate() + 2 + i);
        newDateArr.push(
          language.date.find(
            (item) =>
              item.name ===
              dateAfter.toLocaleString("en-US", options).split(",")[0]
          )
        );
        setDAfterTArr(newDateArr);
        const dATTasks = filterTasksByDeadline(dataSection, dateAfter);
        dATTasksArr.push(dATTasks);
      }

      const someDayTasks = dataSection.filter((task) => {
        return task.deadline === null;
      });

      const doneTasks = dataSection.filter((task) => {
        return task.status === true;
      });

      setDateType({
        overdue: overDueTasks,
        today: todayTasks,
        tomorrow: tomorrowTasks,
        datesAfterTomorrow: dATTasksArr,
        someDay: someDayTasks,
        done: doneTasks,
      });

      if (
        overDueTasks.length + todayTasks.length === 0 &&
        tomorrowTasks.length + dATTasksArr.length > 0
      ) {
        const zone = "week" || plannerData["task"].dateZone[1].name;
        setDateZone(zone);
      } else if (
        tomorrowTasks.length + dATTasksArr.length === 0 &&
        someDayTasks.length > 0
      ) {
        const zone = "all" || plannerData["task"].dateZone[2].name;
        setDateZone(zone);
      }
    };

    setupDate();
  }, [dataSection]);

  const TodayDZ = () => (
    <Fragment>
      {dateType.overdue.length > 0 && (
        <Fragment>
          {/* OVERDUE */}
          <DateZoneLabel
            name="overdue"
            className="mb-10 overdue"
            title="Quá hạn"
            num={dateType.overdue.length}
          />
          <TaskCardList className="mb-30">
            {dateType.overdue.map((data, idx) => {
              return <TaskCard key={idx} data={data} />;
            })}
          </TaskCardList>
        </Fragment>
      )}
      {/* TODAY */}
      <DateZoneLabel
        name="today"
        className="mb-10"
        title="Hôm nay"
        num={dateType.today.length}
      />
      <TaskCardList className="mb-30">
        {dateType.today &&
          dateType.today.map((data, idx) => {
            return <TaskCard key={idx} data={data} />;
          })}
      </TaskCardList>
    </Fragment>
  );

  const WeekDZ = () => {

    const totalTaskAfterTomorrow = dateType.datesAfterTomorrow.reduce((total, item) => total + item.length, 0)
    const totalTaskTomorrow = dateType.tomorrow.length
    const totalTaskToday = dateType.today.length

    if((totalTaskAfterTomorrow === 0 && totalTaskTomorrow === 0 && totalTaskToday === 0)) {
      return <EmptyData sec="task" openModal={modalContext.openModal} />
    }
    return (
      <Fragment>
        <TodayDZ />
        {/* TOMORROW */}
        <DateZoneLabel
          name="tomorrow"
          className="mb-10 mt-40"
          title="Ngày mai"
          num={dateType.tomorrow.length}
        />
        {dateType.tomorrow &&
          dateType.tomorrow.map((data, idx) => {
            return <TaskCard key={idx} data={data} />;
          })}

        {/* DATES AFTER TOMORROW */}
        {dateType.datesAfterTomorrow &&
          dateType.datesAfterTomorrow.map((date, idx) => {
            return (
              <Fragment key={idx}>
                <DateZoneLabel
                  name="dateAfterTomorrow"
                  className="mb-10 mt-40"
                  title={dAfterTArr[idx]?.value?.vn}
                  num={date.length}
                />
                {date.map((data, idx) => {
                  return <TaskCard key={idx} data={data} />;
                })}
              </Fragment>
            );
          })}
      </Fragment>
    );
  };



  return (
    <Container>
      {dateZone === "today" ? (
        <TodayDZ />
      ) : dateZone === "week" ? (
        <WeekDZ />
      ) : (
        dateZone === "all" && <SelectTaskDate />
      )}
    </Container>
  );
};



export default TaskList;

const Container = styled.div`

  height: 70dvh;
  overflow-y: scroll;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;


const TaskCardList = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;