import { createContext, useCallback, useContext, useEffect, useState } from "react";
import conversationApi from "../api/conversation.api.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { WebSocketContext } from "./socket.context.jsx";

const ConversationContext = createContext()

export const ConversationProvider = (p) => {
    const { children } = p
    const { id:selectedConID } = useParams();
    const [conversation, setConversation] = useState([])
    const [currentCon, setCurrenConversation] = useState([])

    const socket =  useContext(WebSocketContext);

    const navigate = useNavigate()

    const queryClient = useQueryClient();

    const { data, error, isLoading } = useQuery({
        queryKey:['conversations'], 
        queryFn: () => conversationApi.getConversationHistory(),
        cacheTime: 0,
    });

    const { data: currentConData, isLoading: currentConLoading, error:currenConError } = useQuery({
        queryKey: ['conversation', selectedConID],
        queryFn: () => selectedConID ? conversationApi.getConversationHistory(selectedConID) : Promise.resolve(null),
        enabled: !!selectedConID 
    });


    useEffect(() => {
        if (data && data.length > 0) {
            setConversation(data)
        }
    }, [data]);

    useEffect(() => {
        if(!selectedConID) setCurrenConversation([])
        else if (currentConData) {
            console.log("currentConData", currentConData)
            setCurrenConversation(currentConData)
        }
    }, [selectedConID, currentConData]);

 
    useEffect(() => {
        if(socket) {
            socket.on('chatResChunk', ({ content }) => {
                cacheConversation.addMsg({prompt: content}, true)
            });
        }
    
        // Clean up the connection on unmount
        return () => {
            if(socket) socket.off('chatResChunk');
        };
      }, [socket]);

    // useEffect(() => {
    //     console.log("error", error)
    // }, [error]);

    const cacheConversation = {
        del: async (id) => {
            const newCon = conversation.filter(data => data.id !== id)
            setConversation(newCon)
        },
        addMsg: async(params, isBot = false) => {       
            // Helper function to update messages
            const updateMessages = (prevMessages) => {
                const newMessages = [...prevMessages];
                if (newMessages[newMessages.length - 1]?.isBot === false) {
                    newMessages.push({ isBot: true, text: params.prompt });
                } else {
                    newMessages[newMessages.length - 1] = { isBot: true, text: params.prompt };
                }
                return newMessages;
            };

            const isNewConversation = !selectedConID || selectedConID == -1
        
            if (isNewConversation) { // New conversation
                if (isBot) {
                    setCurrenConversation(prev => ({
                        ...prev,
                        messages: updateMessages(prev.messages)
                    }));
                } else {
                    setCurrenConversation({
                        id: -1,
                        name: "New Chat",
                        messages: [{ text: params.prompt, isBot: false }]
                    });
                }
                return;
            }
        
            // Existing conversation
            if (isBot) {
                setCurrenConversation(prev => ({
                    ...prev,
                    messages: updateMessages(prev.messages)
                }));
            } else {
                const index = conversation.findIndex(data => data.id === selectedConID);
                if (index !== -1) {
                    const newConversations = [...conversation];
                    newConversations[index] = {
                        ...newConversations[index],
                        messages: [...newConversations[index].messages, { text: params.prompt, isBot: false }]
                    };
                
                    setConversation(newConversations);
                    setCurrenConversation(newConversations[index]);
                }
            }
        }
        
    }

    // Mutation for deleting a conversation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await conversationApi.deleteConversation(id)
            await cacheConversation.del(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['conversations'])
            navigate('/chat')
        },
        onError: (error) => {
            console.error("Error deleting conversation:", error);
        }
    });

    // Mutation for adding a new conversation
    const addMutation = useMutation({
        mutationFn: async ({data, isStream, isVision}) => {
            await cacheConversation.addMsg(data)
            const con = await conversationApi.createChat(data, isStream, isVision)
            if(!selectedConID) {
                setTimeout(() => {
                    navigate(`/chat/${con.conversationID}`)
                }, 1000);
            } 
        },
        onSuccess: () => queryClient.invalidateQueries(['conversations', selectedConID]),        
        onError: (error) => {
            toast.error(`Something went wrong`)
            console.log(error)
        },
    });
    

    // Function to delete a conversation
    const deleteConversation = useCallback((id) => {
        deleteMutation.mutate(id);
    }, [deleteMutation]);

    // Function to add a new conversation
    const addMsg = useCallback((data, isStream, isVision) => {
        addMutation.mutate({data, isStream, isVision});
    }, [addMutation]);


    const contextValue = {
        conversationList: conversation,
        error, currenConError,
        isLoading, currentConLoading,
        selectedConID,
        deleteConversation, addMsg,
        currentCon
    }

    return (
        <ConversationContext.Provider value={contextValue}>
            {children}
        </ConversationContext.Provider>
    )
}

export default ConversationContext