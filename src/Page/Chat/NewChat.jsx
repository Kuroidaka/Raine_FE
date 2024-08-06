import { ToastContainer } from "react-toastify";
import { ConversationProvider } from "../../Context/conversation.context";

import Interact from "./interact";
import History from "./History/History";

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