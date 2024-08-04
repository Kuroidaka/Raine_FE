import { createContext } from "react";
import conversationApi from "../api/conversation.api.js";
import { useQuery } from "@tanstack/react-query";

const ConversationContext = createContext()

export const ConversationProvider = (p) => {
    const { children } = p

    const { data, error, isLoading } = useQuery({
            queryKey:['conversations'], 
            queryFn: conversationApi.getConversationHistory,
            cacheTime: 0,
        });


    const contextValue = {
        conversationList: data,
        error,
        isLoading
    }

    return (
        <ConversationContext.Provider value={contextValue}>
            {children}
        </ConversationContext.Provider>
    )
}

export default ConversationContext