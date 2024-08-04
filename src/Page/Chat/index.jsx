import { ToastContainer } from "react-toastify";
import { ConversationProvider } from "../../Context/conversation.context";
import History from "./History";
import Interact from "./interact";

const ChatPage = () => {
    
    return ( 
        <ConversationProvider>
            <ToastContainer />
            <History>
                <Interact/>
            </History>
        </ConversationProvider>
     );
}
 
export default ChatPage;