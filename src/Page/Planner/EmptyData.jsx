import { Fragment } from "react";
import styled from "styled-components";
import task from "../../assets/svg/task.svg";
import routine from "../../assets/svg/routine.svg";
import goal from "../../assets/svg/goal.svg";
import plannerData from "./Planner.json";
import Button from "../../component/Button";

const EmptyData = (p) => {
  const { sec, openModal } = p;

  const onClickCreateTaskbtn = e => {
      const name = e.target.getAttribute("name")
      openModal(name, null, name, "add")
  }
  return (
    <Fragment>
      <ImgMotivation>
        <img
          src={
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

      <Button
        title={`Tạo ${sec}`}
        onClick={onClickCreateTaskbtn}
        name={sec}
        className="text-center"
        style={{ marginTop: "16px" }}
      />
    </Fragment>
  );
};

export default EmptyData;

const ImgMotivation = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  img {
    max-width: 350px;
    width: 100%;
  }
`;

const TextMotivation = styled.div`
  p:nth-child(1) {
    text-align: center;
    font-weight: 600;
  }
  p:nth-child(2) {
    text-align: center;
    margin-top: 0.5rem;
    font-size: 1.15rem;
  }
  p:nth-child(3) {
    text-align: center;
    margin-top: 0.5rem;
    font-style: italic;
    font-size: 1rem;
  }
`;
