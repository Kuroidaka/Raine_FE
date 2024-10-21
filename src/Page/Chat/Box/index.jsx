import styled from "styled-components";
import UserMsg from "./User_message";
import BotMsg from "./Bot_message";
// import EmptyBox from './EmptyBox';
import { useContext, useEffect, useRef, useState } from "react";
import ConversationContext from "../../../Context/conversation.context";
import Load from "../../../component/Load";

const ChatBox = () => {
  const {
    currentCon,
    currenConError,
    fetchNextMessages,
    isFetchingNextMessages,
  } = useContext(ConversationContext);

  const pageRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true); // Initially at the bottom
  const [userScrolledUp, setUserScrolledUp] = useState(false); // Track if the user manually scrolled up

  const scrollPositionRef = useRef(0); // Store the scroll position before fetching older messages

  // Scroll to bottom when new messages are added (only if user is not manually scrolling up)
  useEffect(() => {
    if (isScrolledToBottom && !userScrolledUp) {
      scrollToBottom();
    }
  }, [currentCon?.messages]);

  // Attach scroll event listener
  useEffect(() => {
    const container = pageRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Cleanup listener on unmount
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isFetchingNextMessages]);

  // Scroll to bottom of the container
  const scrollToBottom = () => {
    const container = pageRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  // Handle scrolling logic
  const handleScroll = () => {
    const container = pageRef.current;
    if (!container || isFetchingNextMessages) return;

    // Check if scrolled to the top to load older messages
    if (container.scrollTop === 0) {
      maintainScrollPositionOnLoad(); // Capture scroll height before loading more messages
      fetchNextMessages(); // Fetch previous messages when scrolled to top
    }

    // Check if the user is near the bottom
    const isAtBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 50;

    // If the user is not at the bottom and new messages are streaming, stop auto-scroll
    if (!isAtBottom) {
      setUserScrolledUp(true); // User has scrolled up manually
    } else {
      setUserScrolledUp(false); // User is back at the bottom
    }

    setIsScrolledToBottom(isAtBottom);
  };

  // Capture scroll position and maintain it after fetching older messages
  const maintainScrollPositionOnLoad = () => {
    const container = pageRef.current;
    if (!container) return;

    // Capture the current scroll height before loading older messages
    scrollPositionRef.current = container.scrollHeight;
  };

  // After messages are fetched, adjust scroll position to maintain view
  useEffect(() => {
    if (!isFetchingNextMessages && scrollPositionRef.current) {
      const container = pageRef.current;
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const scrollOffset = newScrollHeight - scrollPositionRef.current;
        container.scrollTop += scrollOffset; // Adjust scrollTop to maintain the position
      }
    }
  }, [currentCon?.messages, isFetchingNextMessages]);

  if (currenConError) {
    return <div>Something went wrong</div>;
  }

  const messages = currentCon?.messages || [];
  return (
    <Conversation ref={pageRef} className="list-chat">
      {isFetchingNextMessages && (
        <LoadWrapper>
          <Load minsize="30px" />
        </LoadWrapper>
      )}
      {messages.length > 0 && (
        <>
          {messages.map((msg) => (
            <div key={msg.id}>
              {!msg.isBot ? (
                <UserMsg
                  pageRef={pageRef}
                  text={msg.text}
                  imgList={msg.imgList}
                  videoRecord={msg.videoRecord}
                  isScrolledToBottom={isScrolledToBottom}
                />
              ) : (
                <BotMsg
                  memoryDetail={
                    msg.relatedMemo ? JSON.parse(msg.relatedMemo) : []
                  }
                  text={msg.text}
                  functionList={msg.functionData}
                  memoStorage={msg.memoStorage}
                  isScrolledToBottom={isScrolledToBottom}
                />
              )}
            </div>
          ))}
        </>
      )}
    </Conversation>
  );
};

export default ChatBox;

const Conversation = styled.div`
  /* display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start; */
  margin: 18px;
  height: 100%;
  width: 100%;
  max-width: 800px;
  overflow-y: scroll;
  overflow-x: hidden;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome, Safari and Opera */
  }

  ::-webkit-scrollbar {
    display: none;
  }

  /*chat*/
  .chat-msg + .chat-msg {
    margin-top: 40px;
  }

  .chat-msg:last-child {
    margin-bottom: 5rem;
  }
`;

const LoadWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
