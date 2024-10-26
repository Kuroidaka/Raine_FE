import { useContext, useState } from "react";

import Sidebar from "./Sidebar";
import styled from "styled-components";
import ConversationContext from "../../../context/conversation.context";
import { toast } from "react-toastify";
import OverlayDimLoading from "../../../component/OverlayDimLoading";
import DeviceContext from "../../../context/Device.context";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const History = (p) => {
  const { children } = p;

  const { conversationList, error, isLoading, selectedConID } =
    useContext(ConversationContext);

  const [isShowHistory, setIsShowHistory] = useState(false);
  const { device } = useContext(DeviceContext);

  if (isLoading) {
    return <OverlayDimLoading />;
  }

  if (error) {
    toast.error(error.message);
  }

  const renderHistory = () => {
    if (isShowHistory) {
      return (
        <HistorySlideBar
        >
          <Overlay onClick={() => setIsShowHistory(false)} />
          <div className="slide-bar-content">
            <Sidebar data={conversationList} selectedConID={selectedConID} />
          </div>
        </HistorySlideBar>
      );
    }
    return null;
  };
  return (
    <Container>
      <div className="content-ui">{children}</div>
      {device === "desktop" && (
        <Sidebar data={conversationList} selectedConID={selectedConID} />
      )}

      {device !== "desktop" && (
        <>
          <div
            className="history_toggle_btn"
            onClick={() => setIsShowHistory(!isShowHistory)}
          >
            {isShowHistory ? <IoIosArrowForward /> : <IoIosArrowBack />}
          </div>
          {renderHistory()}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  height: 100%;
  position: relative;
  .content-ui {
    flex: 1 1 0%;
  }

  .history_toggle_btn {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    svg {
      font-size: 30px;
      color: #fff;
    }
  }
`;
const HistorySlideBar = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;

  .slide-bar-content {
    width: auto;
    z-index: 1000;
  }
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(26, 26, 26, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
`;

export default History;
