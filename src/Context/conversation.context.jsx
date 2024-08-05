import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import conversationApi from "../api/conversation.api.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const ConversationContext = createContext()

export const ConversationProvider = (p) => {
    const { children } = p
    const [selectedConID, setSelectConID] = useState(-1)
    const [conversation, setConversation] = useState([])
    const [currentCon, setCurrenConversation] = useState([])

    const queryClient = useQueryClient();

    const { data, error, isLoading } = useQuery({
        queryKey:['conversations'], 
        queryFn: conversationApi.getConversationHistory,
        cacheTime: 0,
    });


    useEffect(() => {
        if (data && data.length > 0) {
            setSelectConID(data[0].id);
            setConversation(data)
        }
    }, [data]);

    useEffect(() => {
        let newCon = []
        if(data && data.length > 0) {
            newCon = data.find(convo => convo.id === selectedConID)
        }else {
            newCon = []
        }
        setCurrenConversation(newCon)
    }, [selectedConID, data]);

 
    useEffect(() => {
        const socket = io('http://192.168.1.7:8001', {
          transports: ['websocket', 'polling'],
        });
    
        socket.on('chatResChunk', ({ content }) => {
            cacheConversation.addMsg({prompt: content}, true)
        });
    
        socket.on('disconnect', () => {
          console.log('Disconnected from server');
        });
    
        // Clean up the connection on unmount
        return () => {
          socket.disconnect();
        };
      }, []);


    const cacheConversation = {
        del: async (id) => {
            const newCon = conversation.filter(data => data.id !== id)
            setConversation(newCon)
        },
        addMsg: async(params, isBot = false) => {
            console.log(selectedConID, isBot);
        
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
                    conversation[index].messages.push({ text: params.prompt, isBot: false });
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
        onSuccess: () => queryClient.invalidateQueries(['conversations']),
        onError: (error) => {
            console.error("Error deleting conversation:", error);
        }
    });

    // Mutation for adding a new conversation
    const addMutation = useMutation({
        mutationFn: async ({data, isStream, isVision}) => {
            await cacheConversation.addMsg(data)
            await conversationApi.createChat(data, isStream, isVision)

        },
        onSuccess: () => queryClient.invalidateQueries(['conversations']),        
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
        error,
        isLoading,
        selectedConID, setSelectConID,
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