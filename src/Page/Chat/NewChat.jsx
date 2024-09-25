import { ToastContainer } from "react-toastify";
import { ConversationProvider } from "../../Context/conversation.context";

import EmptyInteract from "./InteractEmpty";
import History from "./History/History";

const NewChat = () => {
    return ( 
        <ConversationProvider>
            <ToastContainer />
            <History>
                <EmptyInteract/>
            </History>
        </ConversationProvider>
     );
}
 
export default NewChat;