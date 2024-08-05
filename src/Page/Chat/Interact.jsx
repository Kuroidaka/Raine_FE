import { Edit as EditIcon, Video as VideoIcon } from "react-feather";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import ChatBox from "./Box";
import InputBox from "./input/index";
import ConversationContext from "../../Context/conversation.context";
import { useContext } from "react";

const Interact = () => {
  const {
    conversationList,
    error,
    isLoading,
    selectedConID,
    setSelectConID,
    deleteConversation,
    addMsg,
  } = useContext(ConversationContext);

  const navigate = useNavigate();

  const handleOpenNewChat = () => {
    // createNewConversation()
    setSelectConID(-1)
  };
  const handleSwitchVideoChat = () => {
    // createNewConversation()
    navigate("/cam-chat");
  };

  return (
    <Container>
      <div className="chat-box">
        <motion.div
          className="title"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="Edit-icon" onClick={handleOpenNewChat}>
            <EditIcon />
          </motion.div>
          <motion.div className="Camera-icon" onClick={handleSwitchVideoChat}>
            <VideoIcon />
          </motion.div>
          <motion.h1>Raine</motion.h1>
        </motion.div>

        <BoxChatContainer>
          <ChatBox />
        </BoxChatContainer>

        <InputContainer>
          <InputBox />
        </InputContainer>
      </div>
    </Container>
  );
};

export default Interact;

const Container = styled.div`
  height: 100%;
  .chat-box {
    height: 100%;
    background: var(--main-gradient);
    color: #ffffff;
    position: relative;
  }

  /*title*/
  .title {
    display: flex;
    align-items: center;
    margin-left: 40px;
    height: 8vh;
    gap: 15px;
    h1 {
      font-size: 20px; /* Thay đổi kích thước của chữ StudyIO */
      font-style: "Montserrat";
    }

    .Edit-icon,
    .Camera-icon {
      width: 45px;
      height: 45px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      padding: 7px;
      border-radius: 5px;
      align-items: center;
      border: 1px solid;

      &:hover {
        background-color: #ffffff;
        color: #292a38;
      }
    }
  }
`;

const BoxChatContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 84vh;

  .start-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80%;
    p {
      font-size: 30px; /* Kích thước chữ to hơn */
      color: #fff; /* Màu trắng */
      font-weight: bold; /* Đậm đặc chữ */
    }
  }
`;
const InputContainer = styled.div`
  width: 100%;
  height: auto;
  position: absolute;
  bottom: 25px;
`;