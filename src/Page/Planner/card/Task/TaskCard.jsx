import styled from "styled-components";
import Tippy from "@tippyjs/react/headless";
import { Img } from "../../../../assets/svg";
import Input from "../../../../component/Input";
import {
  useState,
  useEffect,
  Fragment,
  useContext,
  useMemo,
  useRef,
} from "react";
import {
  convertDates,
  convertToTodayWithSameTime,
  dateConvert,
} from "../../../../Util";

import ModalContext from "../../../../context/Modal.context";
import TaskContext from "../../../../context/Task.context";
import SubTask from "../SubTask";

import myCursor from "../../../../assets/cursor/Labrador_Retriever.cur";
import { motion } from "framer-motion";
import reminderApi from "../../../../api/reminder.api";
import { toast } from "react-toastify";

export const Card = (p) => {
  const {
    data: {
      title,
      color = null,
      deadline = "",
      area = [],
      note = "",
      subTask = [],
      id,
      status,
      taskAttachment,
    },
    mode = "edit",
  } = p;

  const { handleCheckTask, handleDeleteTask } = useContext(TaskContext);
  const { openModal } = useContext(ModalContext);

  const [checked] = useState(status);
  const [subOpen, setSubOpen] = useState(false);
  const [subs, setSubs] = useState(subTask);
  const [subDone, setSubDone] = useState(0);
  const [option, setOption] = useState(false);

  const countCurrSub = (dataSub) => {
    return dataSub.reduce((total, curr) => {
      if (curr.status === true) {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
  };

  const memoizedCount = useMemo(() => countCurrSub(subs), [subs]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setSubDone(memoizedCount);
    }

    return () => {
      isMounted = false;
    };
  }, [memoizedCount]);

  const taskHandle = {
    open: () => {
      // Open modal detail
      const data = {
        title,
        color,
        deadline,
        area,
        note,
        id,
        taskAttachment,
      };
      openModal(title, data, "task", mode);
    },
    check: async () => {
      // Check task
      if (mode !== "view") await handleCheckTask(id);
      // setChecked(!checked)
    },
    option: {
      //handle option
      open: () => {
        setOption(true);
      },
      close: () => {
        setOption(false);
      },
      toggle: () => {
        setOption(!option);
      },
      delete: async (id) => {
        const task = document.querySelector(`[name='${id}']`);
        task.style.opacity = "0";

        setTimeout(async () => {
          await handleDeleteTask(id);
        }, 100);
      },
    },
    // selectWhenClick: (id) => {
    // }
  };

  const subTaskHandle = {
    delete: async (id) => {
      // Delete subtask
      try {
        let newSub = [...subs]; //prevent mutating

        await reminderApi.deleteSubTask(id);
        newSub = newSub.filter((data) => data.id !== id);
        setSubs(newSub);
      } catch (error) {
        toast.error(error.message);
      }
    },
    add: async (data) => {
      // Add new subtask
      try {
        const subData = await reminderApi.addSubTask(id, data);
        const newData = [...subs, subData];
        setSubs(newData);
      } catch (error) {
        toast.error(error.message);
      }
    },
    open: () => {
      // Open list subtask
      setSubOpen(!subOpen);
    },
    updateSubtask: async (id, updates) => {
      try {
        const newSub = [...subs]; // Prevent mutating

        await reminderApi.updateSubTask(id, updates);
        const index = newSub.findIndex((e) => e.id === id);

        if (index !== -1) {
          newSub[index] = { ...newSub[index], ...updates };
          setSubs(newSub);
        }
      } catch (error) {
        toast.error(error.message);
      }
    },

    check: async (id, check) => {
      await subTaskHandle.updateSubtask(id, { status: check });
    },

    update: async (id, title) => {
      await subTaskHandle.updateSubtask(id, { title: title });
    },
  };

  const Area = (p) => {
    const { data } = p;
    const Image = Img[data.area];
    if (Image) return <Image />;
  };

  return (
    <TaskCardContainer
      // onClick={() => taskHandle.selectWhenClick(id)}
      name={id}
      style={
        color !== ""
          ? { backgroundColor: color }
          : { backgroundColor: "#FFFFF", color: "#000" }
      }
      className={`task-card text-dark `}
    >
      <MainTask>
        <div
          className={`card-title ${
            color === "" ? "text-dark" : "text-white"
          }  ${checked ? "blur" : ""}`}
        >
          <Title className={`${color === "" ? "text-dark" : "text-white"}`}>
            <span onClick={taskHandle.check}>
              {checked ? <Img.checkboxChecked /> : <Img.checkbox />}
            </span>
            <div className={`title ${checked ? "line-through" : ""}`}>
              {title}
            </div>
          </Title>

          <Deadline className={`${color === "" ? "text-dark" : "text-white"}`}>
            <Img.deadline />
            <span>{dateConvert(deadline)}</span>
          </Deadline>

          <RelateArea
            className={`${color === "" ? "text-dark" : "text-white"}`}
          >
            {area.length > 0 &&
              area.map((item, idx) => <Area key={idx} data={item} />)}
          </RelateArea>
        </div>

        <div
          className={`card-sub ${color === "" ? "text-dark" : "text-white"}`}
          onClick={subTaskHandle.open}
        >
          {subs.length > 0 && (
            <span>
              ({subDone}/{subs.length})
            </span>
          )}
          <span>
            <Img.subTask />
          </span>
        </div>

        <div
          className={`card-option ${color === "" ? "text-dark" : "text-white"}`}
        >
          <Tippy
            interactive
            content="Tooltip"
            render={(attrs) => (
              <Option
                {...attrs}
                taskId={id}
                openDetail={taskHandle.open}
                deleteTask={taskHandle.option.delete}
                deadline={deadline}
                setOption={setOption}
              />
            )}
            visible={option}
            onClickOutside={taskHandle.option.close}
            offset={[10, 0]}
          >
            {mode !== "view" && (
              <OptionBtnCon
                className="mr-5"
                style={{ position: "relative" }}
                onClick={taskHandle.option.toggle}
              >
                <Img.option />
              </OptionBtnCon>
            )}
          </Tippy>
          <span onClick={taskHandle.open}>
            <Img.arrowRight />
          </span>
        </div>
      </MainTask>

      {subOpen && (
        <Fragment>
          <SubTaskList>
            {subs.length > 0 &&
              subs.map((sub, idx) => {
                return (
                  <SubTask
                    key={idx}
                    id={sub.id}
                    color={color}
                    title={sub.title}
                    done={sub.status}
                    updateSubTitle={subTaskHandle.updateSubtask}
                    updateSubCheck={subTaskHandle.check}
                    deleteSubTask={subTaskHandle.delete}
                    mode={mode}
                  />
                );
              })}
          </SubTaskList>

          {mode !== "view" && (
            <AddSubTask
              id={id}
              color={color}
              AddSub={subTaskHandle.add}
              placeholder={subs.length > 0 ? "" : "Thêm subtask"}
            />
          )}
        </Fragment>
      )}
    </TaskCardContainer>
  );
};

const AddSubTask = (p) => {
  const { id, color, AddSub, placeholder } = p;
  console.log("p", p);

  const [value, setValue] = useState("");

  const inputRef = useRef(null);

  const inputStyle = {
    width: "80%",
    height: "35px",
    backgroundColor: "transparent",
    border: "none",
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setValue(value);
  };

  const saveSubTask = async () => {
    try {
      const newData = {
        title: value,
      };
      AddSub(newData);
      setValue("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddSubTask = (event) => {
    if (event.key === "Enter") {
      saveSubTask();
    }
  };

  // useEffect(() => {
  //     if(id){
  //         const plusIcon = document.querySelector(`.${id}.plus`)
  //         if(plusIcon) {
  //             const input = document.querySelector(`.subtask-input.${id}`)

  //             plusIcon.addEventListener("click", () => {
  //                 input.focus()
  //             })
  //         }

  //     }
  // }, [id]);

  return (
    <AddSubTaskContainer className={`${color === "" ? "text-white" : ""}`}>
      {value === "" ? (
        <span className={`${id} plus`}>
          <Img.plus />
        </span>
      ) : (
        <span onClick={saveSubTask}>
          <Img.plusCircle />
        </span>
      )}
      <Input
        id={id}
        value={value}
        onInput={handleInput}
        onKeyDown={handleAddSubTask}
        ref={inputRef}
        name="title"
        className={`${color !== "" ? "text-white" : ""} subtask-input ${id}`}
        inputStyle={inputStyle}
        placeholder={placeholder}
        plhdercolor={`${
          color !== "" ? "var(--white-text)" : "var(--black-text)"
        }`}
        focusborder="false"
      />
    </AddSubTaskContainer>
  );
};

const Option = (p) => {
  const { openDetail, deleteTask, taskId, deadline, setOption } = p;
  const { handleUpdateTask, task } = useContext(TaskContext);

  const findTask = (taskId) => {
    const result = task.find((i) => i.id === taskId);
    return result;
  };

  const listOption = [
    {
      name: "today",
      value: "Hôm nay",
      icon: "deadline",
      handleClick: async () => {
        const task = findTask(taskId);

        await handleUpdateTask(taskId, {
          deadline: convertToTodayWithSameTime(task.deadline),
          area: task.area,
        });
      },
    },
    {
      name: "tomorrow",
      value: "Mai",
      icon: "deadline",
      handleClick: async () => {
        const task = findTask(taskId);
        const tomorrow = new Date(task.deadline);
        tomorrow.setDate(tomorrow.getDate() + 1);

        await handleUpdateTask(taskId, {
          deadline: tomorrow,
          area: task.area,
        });
      },
    },
    {
      name: "edit",
      value: "Sửa",
      icon: "edit",
      handleClick: () => {
        openDetail();
        setOption(false);
      },
    },
    {
      name: "delete",
      value: "Xóa",
      icon: "deleteIcon",
      handleClick: async () => {
        deleteTask(taskId);
      },
    },
  ];

  const Icon = (p) => {
    const { icon } = p;
    const Image = Img[icon];

    if (Image) return <Image />;
  };

  return (
    <OptionContainer>
      {listOption &&
        listOption.map((item, idx) => {
          return (
            <li
              key={idx}
              onClick={item.handleClick}
              className={
                (convertDates([new Date()])[0] ===
                  convertDates([deadline])[0] &&
                  item.name === "today") ||
                (convertDates([
                  new Date().setDate(new Date().getDate() + 1),
                ])[0] === convertDates([deadline])[0] &&
                  item.name === "tomorrow") ||
                (deadline === "someday" && item.name === "someDay")
                  ? "disable"
                  : ""
              }
            >
              <Icon icon={item.icon} />
              <span className="ml-7">{item.value}</span>
            </li>
          );
        })}
    </OptionContainer>
  );
};

const TaskCardContainer = styled(motion.div)`
  max-width: 50rem;
  width: 100%;
  height: auto;
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  padding: 0.9rem 1.3rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  }

  &.active {
    border: 1.5px solid #626060;
  }
`;
const MainTask = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  .card-title {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;

    svg {
      flex-shrink: 0;
    }
  }

  .card-sub {
    display: flex;
    align-items: center;
    line-height: 1;
    margin-right: 10px;

    span {
      font-size: 1.2rem;
      cursor: url(${myCursor}), auto;
      &:nth-child(2),
      &:nth-child(1) {
        svg {
          width: 17.8px;
        }
      }
    }

    &:hover {
      span {
        color: var(--second-color);
      }
    }
  }

  .card-option {
    display: flex;
    line-height: 1;
  }
`;

const OptionBtnCon = styled.div`
  svg {
    width: 17.8px;
    cursor: url(${myCursor}), auto;
  }
`;
const SubTaskList = styled.div`
  padding: 8px 12px;
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  /* max-height: 4rem; */

  span {
    line-height: 1;
    svg {
      width: 17px;
      cursor: url(${myCursor}), auto;
    }
  }

  .title {
    font-size: 1.4rem;
    font-weight: 700;
    margin-left: 6px;
  }
`;
const Deadline = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 12px;
  }

  span {
    margin-left: 6px;
    font-size: 1.2rem;
  }
`;
const RelateArea = styled.div`
  display: flex;
  gap: 6px;
  svg {
    width: 12px;
  }
`;
const AddSubTaskContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    display: flex;
    align-items: center;

    svg {
      width: 18px;
    }
  }
`;
const OptionContainer = styled.ul`
  position: absolute;
  top: 0;
  right: -10px;
  width: 200px;
  padding: 10px 8px;
  height: auto;
  color: #373a3c;
  box-shadow: 0 0 0 0;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  text-align: left;
  list-style: none;
  background-color: #fff;

  li {
    user-select: none;
    display: flex;
    cursor: url(${myCursor}), auto;
    align-items: center;
    border-radius: 5px;
    padding: 5px 9px;
    transition: all 0.3s ease-in-out;
    font-weight: 600;
    font-size: 1.26rem;

    &.disable {
      cursor: not-allowed;
      pointer-events: none;
      user-select: none;
      opacity: 0.5;
    }

    span {
      font-size: 1.25rem;
    }
    svg {
      width: 15px;
      margin-right: 5px;
    }

    &:not(.disable):hover {
      background-color: #f5f5f5;
    }
  }
`;
