import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
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
    let listFuncData = useRef([])

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


    const updateFuncDataList = (list, newData) => {
        let updatedDataList;
        
        // Check if the id already exists in the state
        const existingIndex = list.findIndex(item => item.id === newData.id);
        
        if (existingIndex !== -1) {
            // If it exists, replace the old data with the new data
            const updatedState = [...list];
            updatedState[existingIndex] = newData;
            updatedDataList = updatedState;
            return updatedState;
        } else {
            // If it doesn't exist, add the new data to the state
            updatedDataList = [...list, newData];
            return updatedDataList;
        }
        
    }
    

    useEffect(() => {
        if (data && data.length > 0) {
            setConversation(data)
        }
        listFuncData.current = []
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

            socket.on('chatResChunkFunc', async ({ functionData, id }) => {
                // cacheConversation.addMsg({prompt: content}, true)
                console.log("functionName", functionData)
                const data = { id, ...functionData }

                listFuncData.current = updateFuncDataList(listFuncData.current, data)

                console.log("listFuncData", listFuncData.current)
                const params = { prompt: "" }
                const isBot = true
                await cacheConversation.addMsg(params, isBot, listFuncData.current)
            });
        }
    
        // Clean up the connection on unmount
        return () => {
            if(socket) socket.off('chatResChunk');
            if(socket) socket.off('chatResChunkFunc');
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
        addMsg: async (params, isBot = false, functionData=[]) => {
            // Helper function to update messages
            const updateBotMessages = (prevMessages) => {
                const newMessages = [...prevMessages];
                
                if (newMessages[newMessages.length - 1]?.isBot === false) {
                    // If the last message is not from the bot, add a new bot message
                    newMessages.push({
                        isBot: true,
                        text: params.prompt,
                        functionData: functionData.length > 0 ? functionData : newMessages[newMessages.length - 1]?.functionData || []
                    });
                } else {
                    // If the last message is from the bot, merge the new prompt with the old text
                    newMessages[newMessages.length - 1] = {
                        isBot: true,
                        text: newMessages[newMessages.length - 1].text + params.prompt,
                        functionData: functionData.length > 0 ? functionData : newMessages[newMessages.length - 1]?.functionData || []
                    };
                }
                
                return newMessages;
            };
        
            const isNewConversation = !selectedConID || selectedConID == -1
        
            if (isNewConversation) { // New conversation
                if (isBot) {
                    setCurrenConversation(prev => ({
                        ...prev,
                        messages: updateBotMessages(prev.messages)
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
                    messages: updateBotMessages(prev.messages)
                }));
            } else {
                const index = conversation.findIndex(data => data.id === selectedConID);
                if (index !== -1) {
                    const newConversations = [...conversation];
                    newConversations[index] = {
                        ...newConversations[index],
                        messages: [
                            ...newConversations[index].messages, 
                            { text: params.prompt, isBot: false }
                        ]
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
        currentCon,
    }

    return (
        <ConversationContext.Provider value={contextValue}>
            {children}
        </ConversationContext.Provider>
    )
}

export default ConversationContext