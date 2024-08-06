
import styled from 'styled-components';
import UserMsg from './User_message';
import BotMsg from './Bot_message';
import EmptyBox from './EmptyBox';
import { useContext, useRef } from 'react';
import ConversationContext from '../../../Context/conversation.context';




const ChatBox = () => {
    const { currentCon, currenConError } = useContext(ConversationContext);
    // const { id } = useParams();
    // const { data: currentCon, error, isLoading } = useQuery({
    //     queryKey: ['conversation', id],
    //     queryFn: () => conversationApi.getConversationHistory(id)
    // });

    console.log("currentCon", currentCon)
    const pageRef = useRef(null);
  
    // if (currentConLoading) {
    //   return <Loading />;
    // }
  
    if (currenConError) {
      return <div>Some thing went wrong</div>;
    }
  
    const messages = currentCon?.messages || [];
    return (
        <Conversation ref={pageRef} className='list-chat'>
            {messages.length > 0 ? (
                messages.map((msg, index) => (
                    !msg.isBot ? (
                        <UserMsg 
                            pageRef={pageRef} 
                            key={index} 
                            text={msg.text} 
                            imgList={msg.imgList} 
                        />
                    ) : (
                        <BotMsg 
                            key={index} 
                            text={msg.text} 
                            functionList={msg.functionList} 
                        />
                    )
                ))
            ) : (
                <EmptyBox />
            )}
        </Conversation>
    );
}

 
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
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    &::-webkit-scrollbar {
        display: none;/* Hide scrollbar for Chrome, Safari and Opera */
    }

    ::-webkit-scrollbar {
        display: none;
    }

    /*chat*/
    .chat-msg + .chat-msg {
        margin-top: 40px;
    }

    .chat-msg:last-child {
        margin-bottom: 100px;
    }



`