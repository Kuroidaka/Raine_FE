import styled from "styled-components";

import IconCustom from "../../../assets/Icons/svg";
import { useContext, useEffect, useState } from "react";
import Logo from "../../../assets/img/Logo";
import MarkDown from "../../../component/MarkDownChat";
import TaskCard from "../../Planner/card/Task/TaskCard";
import { Card as RoutineCard } from "../../Planner/card/RoutineCard";
import ModalContext from "../../../context/Modal.context";
import { FiTerminal } from "react-icons/fi";
import { FadeIn } from "../../../component/Motion";
import { TaskProvider } from "../../../context/Task.context";
import { RoutineProvider } from "../../../context/Routine.context";

const functionIcon = {
  create_reminder: {
    icon: "⏱️",
    process: "Reminder Creating",
    done: "Reminder Created",
  },
  generate_image: {
    icon: "🖼️",
    process: "Image Generating",
    done: "Image Generated",
  },
  ReminderChatService: {
    icon: "⏱️",
    process: "Query Tasks",
  },
  RoutineChatService: {
    icon: "⏱️",
    process: "Query Routines",
  },
  ReminderCreateChatService: {
    icon: "⏱️",
    process: "Create Task",
  },
  RoutineCreateChatService: {
    icon: "⏱️",
    process: "Create Routine",
  },
  FileAskChatService: {
    icon: "📁",
    process: "File Search",
  },
  BrowseChatService: {
    icon: "🔍",
    process: "Searching Google",
    done: "Google Browsed",
  },
};

const BotMsg = (p) => {
  const { text, className, functionList = [], memoryDetail, memoStorage } = p;

  const [thinking, setThinking] = useState(true);


  const renderMemoryDetail = () => {
    if (memoryDetail && memoryDetail.length > 0) {
      return <MemoAgent memo={memoryDetail} />;
    }
    return null;
  };

  const renderFunctionList = () => {
    if (functionList && functionList.length > 0) {
      return functionList.map((agent) => (
        <div key={agent.id}>
          <FadeIn className="func-data-wrapper">
            <FunctionAgent agent={agent} />
            <div className="func-data-list">
              {" "}
              <FunctionData agent={agent} />
            </div>
          </FadeIn>
        </div>
      ));
    }
    return null;
  };

  const renderMemoStorage = () => {
    if (memoStorage) {
      return <MemoStorageAgent memoStorage={memoStorage} />;
    }
    return null;
  };

  useEffect(() => {
    if (text.length > 0 || functionList.length > 0) {
      setThinking(false);
    }
  }, [text, functionList]);

  return (
    <Container className={`chat-msg bot-chat ${className}`}>
      <div className="icon">
        <div className="bot-icon-wrapper">
          {/* <IconCustom.logo/> */}
          <Logo className="bot-icon"></Logo>
        </div>
      </div>
      <div className="chat-content">
        <p className="chat-person">{"Raine"}</p>
        {thinking && <p>Thinking...</p>}
        {renderMemoryDetail()}
        {renderFunctionList()}
        {(text || functionList.length > 0) && (
          <div className="bot-text-wrapper">
            {
              <div className="bot-text">
                <MarkDown text={text} />
              </div>
            }
          </div>
        )}
        {renderMemoStorage()}
      </div>
    </Container>
  );
};

export const FunctionAgent = (p) => {
  const { agent } = p;
  const { openModal } = useContext(ModalContext);

  const [listFuncData, setListFuncData] = useState({});

  useEffect(() => {
    const processFunctionListType = () => {
      try {
        const data = { ...agent, data: JSON.parse(agent.data) };

        setListFuncData(data);
      } catch (error) {
        setListFuncData(agent);
      }
    };

    processFunctionListType();
  }, [agent]);

  const handleClickShow = () => {
    const title = agent.name;
    const content = listFuncData;
    const type = "tool";
    const mode = "view";
    openModal(title, content, type, mode);
  };

  return (
    <FadeIn className="bot-text-wrapper function-agent">
      <div className="bot-text">
        <div className="function">
          <div className="function-title">
            <IconCustom.task></IconCustom.task>
            Task Added:
          </div>
          <div className="function-name">
            <div className="icon">{functionIcon[agent.name].icon}</div>
            <div className="text">{functionIcon[agent.name].process}</div>
          </div>
        </div>
        {(listFuncData.comment || listFuncData.data) && (
          <div className="btn_show">
            <FiTerminal onClick={handleClickShow}>Click</FiTerminal>
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export const MemoAgent = (p) => {
  const { memo } = p;
  const { openModal } = useContext(ModalContext);

  const handleClickShow = () => {
    const title = "Relate Memory";
    const content = memo;
    const type = "memo";
    const mode = "view";
    openModal(title, content, type, mode);
  };

  return (
    <FadeIn className="bot-text-wrapper function-agent memo-relate-agent">
      <div className="bot-text">
        <div className="function">
          <div className="function-title">
            <IconCustom.task></IconCustom.task>
          </div>
          <div className="function-name">Relate Memory</div>
        </div>
        {memo && memo.length > 0 && (
          <div className="btn_show">
            <FiTerminal onClick={handleClickShow}>Click</FiTerminal>
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export const MemoStorageAgent = (p) => {
  const { memoStorage } = p;
  const { openModal } = useContext(ModalContext);

  const handleClickShow = () => {
    const title = "Memory saved";
    const content = memoStorage;
    const type = "memo";
    const mode = "view";
    openModal(title, content, type, mode);
  };

  // console.log("memoStorage", memoStorage);
  return (
    <FadeIn className="bot-text-wrapper function-agent memo-storage-agent">
      <div className="bot-text">
        <div className="function">
          <div className="function-title">
            <IconCustom.task></IconCustom.task>
          </div>
          <div className="function-name">Memory Saved</div>
        </div>
        {memoStorage && memoStorage.length > 0 && (
          <div className="btn_show">
            <FiTerminal onClick={handleClickShow}>Click</FiTerminal>
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export const FunctionData = ({ agent }) => {
    const [listFuncData, setListFuncData] = useState([]);
    const [funcName, setFuncName] = useState("");
  
    useEffect(() => {
      const processFunctionListType = () => {
        try {
          // Parse agent.data if it's a string, or use the original data if not
          const data = typeof agent.data === "string" ? JSON.parse(agent.data) : agent.data;
  
          // Ensure the data is always an array
          setListFuncData(Array.isArray(data) ? data : data ? [data] : []);
        } catch (error) {
          console.error("Failed to parse agent data:", error);
          setListFuncData([]);
        }
        setFuncName(agent.name);
      };
  
      if (agent) {
        processFunctionListType();
      }
    }, [agent]);
  
    const renderCards = () => {
      if (!listFuncData.length) return null;
  
      // Define functions that return components, not JSX literals
      const TaskCardComponent = (props) => (
        <TaskProvider>
          <TaskCard {...props} />
        </TaskProvider>
      );
      const RoutineCardComponent = (props) => (
        <RoutineProvider>
          <RoutineCard {...props} />
        </RoutineProvider>
      );
  
      // Store component functions, not JSX literals
      const cardComponents = {
        ReminderChatService: TaskCardComponent,
        RoutineChatService: RoutineCardComponent,
        ReminderCreateChatService: TaskCardComponent,
        RoutineCreateChatService: RoutineCardComponent,
        FileAskChatService: null,  // No card for FileAskChatService
      };
  
      const sharedProps = {
        mode: "view",
      };
  
      const specificProps = {
        ReminderChatService: (funcData) => ({
          ...sharedProps,
          data: funcData,
        }),
        RoutineChatService: (funcData) => ({
          ...sharedProps,
          data: funcData,
        }),
        ReminderCreateChatService: (funcData) => ({
          ...sharedProps,
          data: funcData,
        }),
        RoutineCreateChatService: (funcData) => ({
          ...sharedProps,
          data: funcData,
        }),
        FileAskChatService: (funcData) => ({
          ...sharedProps,
          file: funcData.file,
        }),
      };
  
      const CardComponent = cardComponents[funcName];
      const getProps = specificProps[funcName];
  
      if (!CardComponent || !getProps) return null;
  
      return (
        <FuncDataContainer>
          {listFuncData.map((funcData) => (
            <CardComponent key={funcData.id} {...getProps(funcData)} />
          ))}
        </FuncDataContainer>
      );
    };
  
    return renderCards();
  };

export default BotMsg;

const Container = styled.div`
  /*bot*/
  width: 100%;
  display: flex;
  direction: ltr;

  .icon {
    display: flex;
    align-items: center;
    align-self: flex-start;
    .bot-icon-wrapper {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      width: 40px;
      border-radius: 50%;
      background-color: #d4dbfe;
      .bot-icon {
        width: 30px;
      }
    }
  }
  .chat-content {
    max-width: 80%;
    min-width: 50%;
    width: auto;
    margin-left: 18px;
    p.chat-person {
      font-size: 16px; /* Thay đổi kích thước của chữ StudyIO */
      font-weight: bold;
      margin-bottom: 7px;
    }
    .bot-text-wrapper {
      padding: 10px;
      border-radius: 10px;
      background: #666666;
      display: flex;
      align-items: center;
      justify-content: center;
      .bot-text {
        overflow-x: scroll;
        width: 100%;
        pre {
          overflow-x: scroll;
        }
        a {
          color: #00a5ff;
          text-decoration: none;
          font-weight: 500;
        }
        img {
          width: 100%;
          max-width: 350px;
          margin: 10px 0;
          /* cursor: pointer; */
        }
        p {
          font-weight: 500;
        }
        ol,
        ul {
          padding: 6px 25px;
          li {
            font-size: 15px; /* Thay đổi kích thước của chữ StudyIO */
            font-weight: 500;
            margin: 10px 0;

            a {
              color: #00a5ff;
              text-decoration: none;
              font-weight: 500;
            }
          }
        }
      }

      & + .bot-text-wrapper {
        margin-top: 10px;
      }

      &.function-agent {
        /* width: fit-content; */
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        background-color: #434343;
        padding: 3px 10px;
        border-top-left-radius: 10px !important;
        border-top-right-radius: 10px !important;
        border-bottom-left-radius: 0px !important;
        border-bottom-right-radius: 0px !important;
        margin-bottom: 10px;

        &.memo-storage-agent {
          border-radius: 10px !important;
        }

        &.memo-relate-agent {
          border-radius: 10px !important;
        }

        .bot-text {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .function {
          display: flex;
          .function-title {
            font-weight: 800;
            gap: 6px;
            display: flex;
            align-items: center;
            font-size: 13px;

            svg {
              &.task {
                rotate: -45deg;
              }
            }
          }

          .function-name {
            display: flex;
            align-items: center;
            margin-left: 10px;
            font-weight: 800;
            .icon {
              font-size: 13px;
              margin-right: 5px;
            }
            .text {
              font-size: 13px;
            }
          }
        }

        .btn_show {
          display: flex;
          justify-content: center;
          align-items: center;

          svg {
            font-size: 2rem;
            transition: all 0.2s linear;

            &:hover {
              color: var(--second-color);
            }
          }
        }
      }
    }

    .func-data-wrapper {
      border-radius: 10px;
      background: #666666;
      margin-bottom: 10px;
    }
  }

  &.waiting {
    @keyframes jump {
      0% {
        transform: translateY(5px);
      }
      50% {
        transform: translateY(-5px);
      }
      100% {
        transform: translateY(5px);
      }
    }

    .bot-text-wrapper {
      padding: 6px;
      .bot-text {
        gap: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 25px;
        .chat-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          background-color: #848484;
          border-radius: 50%;
          animation: jump 0.8s linear infinite;

          &:nth-child(1) {
            animation-delay: 0s;
          }
          &:nth-child(2) {
            animation-delay: 0.15s;
          }
          &:nth-child(3) {
            animation-delay: 0.3s;
          }
        }
      }
    }
  }
`;

const FuncDataContainer = styled(FadeIn)`
  padding: 25px 10px 10px;
  max-height: 300px;
  overflow-y: scroll;
`;
