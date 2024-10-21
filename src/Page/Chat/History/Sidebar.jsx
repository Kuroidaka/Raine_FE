import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SidebarNav from "./sidebar_nav";
import { useContext, useEffect, useRef } from "react";
import ConversationContext from "../../../Context/conversation.context";
import Load from "../../../component/Load";

const Sidebar = () => {
  //   const { conversationList, selectedConID } = p;
  const navigate = useNavigate();
  const {
    conversationList,
    selectedConID,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
  } = useContext(ConversationContext);
  const listRef = useRef(null);

  const hdlSelCon = (id) => {
    navigate(`/chat/${id}`);
  };

  const handleScroll = () => {
    const container = listRef.current;
    if (!container || isLoading) return;

    // Check if scrolled to the bottom
    if (
      container.scrollHeight - container.scrollTop ===
      container.clientHeight
    ) {
      console.log("scrolled to the bottom");
      //   setCurrentPage((prev) => prev + 1);
      fetchNextPage();
    }
  };

  // Attach scroll event listener
  useEffect(() => {
    const container = listRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Cleanup listener on unmount
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoading]);

  return (
    <Container>
      <div className="cover">
        <h2>History</h2>

        <div className="conversation-list" ref={listRef} aria-hidden="true">
          {conversationList && conversationList.length > 0 ? (
            <ul>
              {conversationList.map((item, index) => (
                <SidebarNav
                  key={index}
                  conversation={item} // Assuming you need to pass the whole item
                  selectedID={selectedConID} // Adjust according to your SidebarNav props
                  hdlSelCon={hdlSelCon}
                />
              ))}
            </ul>
          ) : (
            <div className="empty">
              <p>No conversation</p>
            </div>
          )}

          {isFetchingNextPage && (
            <LoadWrapper>
              <Load minsize="20px" />
            </LoadWrapper>
          )}
        </div>

        <Team />
      </div>
    </Container>
  );
};

const Team = styled.div`
  width: 100%;
  height: 10vh;
  background-color: var(--primary-color);
  /* padding: initial; */
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Container = styled.div`
  height: 100%;
  width: 235px;
  .cover {
    color: var(--white-text);
    background: var(--main-gradient);
    width: 100%;
    height: 100%;
    padding: 10px 18px;
    position: relative;
    z-index: 100;

    h2 {
      color: #ffff;
      font-size: 22px;
      line-height: 32px;
      margin-left: 10px;
    }

    .conversation-list {
      height: 80%;
      margin-top: 18px;

      &[aria-hidden="true"] {
        overflow-y: scroll;
      }
      &[aria-hidden="false"] {
        overflow-y: visible;
      }

      .title {
        color: var(--second-color);
        font-size: 12px;
        margin-bottom: 3px;
        margin-left: 10px;
        line-height: 20px;
      }
      li {
        list-style: none;
      }

      h4.title {
        user-select: none;
      }
    }
    .body {
      display: flex;
      text-align: center;

      .spinner-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .spinner {
          width: 35px;
          height: 35px;
          display: inline-block;
          border: 4px solid white;
          border-radius: 50%;
          border-top: 4px solid #ff8000;
          animation: spinner 1.5s linear infinite;
        }
        @keyframes spinner {
          to {
            transform: rotate(360deg);
          }
        }
      }
      p {
        margin-left: 5px;
      }
    }
  }
`;


const LoadWrapper = styled.div`
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Sidebar;
