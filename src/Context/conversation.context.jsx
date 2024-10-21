import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import conversationApi from "../api/conversation.api.js";
import { useMutation, useInfiniteQuery, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { WebSocketContext } from "../context/socket.context.jsx";

const ConversationContext = createContext();

// Custom hook to fetch messages by conversationId using useInfiniteQuery
const useFetchMessages = (conversationId) => {
  return useInfiniteQuery({
    queryKey: ['messages', conversationId],   // Unique key for the query
    queryFn: ({ pageParam = 1 }) => conversationApi.getMessagesByConversationId(conversationId, pageParam, 4),  // API call
    getNextPageParam: (lastPage) => {
      if(lastPage.currentPage < lastPage.totalPages){
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};

export const ConversationProvider = (p) => {
  const { children } = p;
  const { id: selectedConID } = useParams();
  const [conversation, setConversation] = useState([]);
  const [currentCon, setCurrenConversation] = useState([]);
  let listFuncData = useRef([]);
  let listMemoData = useRef([]);
  let listMemoStorage = useRef([]);

  const socket = useContext(WebSocketContext);

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  
  // Using `useInfiniteQuery` for paginated conversation history
  const {
    data, 
    error, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: ({ pageParam = 1 }) => {
      
      return conversationApi.getConversationHistory(null, pageParam)
    },
    getNextPageParam: (lastPage) => {
      // Check if there are more pages to load
      if(lastPage.currentPage < lastPage.totalPages){
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    cacheTime: 0,
  });

  const {
    data: messages,                 // All the paginated data
    fetchNextPage: fetchNextMessages,        // Function to fetch the next page
    hasNextPage: hasNextMessages,          // Whether there are more pages to fetch
    isFetchingNextPage: isFetchingNextMessages,   // Loading state for fetching more
    isLoading: messagesLoading,            // Loading state for the initial fetch
    error: messagesError,                // Error state
  } = useFetchMessages(selectedConID);
  
  const {
    data: currentConData,
    isLoading: currentConLoading,
    error: currenConError,
  } = useQuery({
    queryKey: ["conversation", selectedConID],
    queryFn: () => 
      selectedConID 
        ? conversationApi.getConversationHistory(selectedConID) 
        : Promise.resolve([]),  // Return an empty array instead of null
    enabled: !!selectedConID,
    initialData: [], // Ensure that the data is initialized with an empty array
  });

  const updateFuncDataList = (list, newData) => {
    let updatedDataList;

    // Check if the id already exists in the state
    const existingIndex = list.findIndex((item) => item.id === newData.id);

    if (existingIndex !== -1) {
      const updatedState = [...list];
      updatedState[existingIndex] = newData;
      updatedDataList = updatedState;
      return updatedState;
    } else {
      updatedDataList = [...list, newData];
      return updatedDataList;
    }
  };

  useEffect(() => {
    if (data?.pages) {
      // Flatten and set conversations from all pages
      console.log("data", data)
      setConversation(data.pages.flatMap((page) => page.conversations));
    }
    cacheConversation.rsMsgAttach();
  }, [data]);

  useEffect(() => {
    // If no selected conversation, reset the current conversation
    if (!selectedConID) {
      setCurrenConversation([]);
    } else if (currentConData) {
      // If conversation data is available, set it
      setCurrenConversation(currentConData);
    }
  }, [selectedConID, currentConData]);
  
  useEffect(() => {
    if (messages && messages.pages && currentCon) {
      setCurrenConversation((prevCon) => {
        // If there's no change in the messages, avoid updating the state to prevent re-rendering
        if (prevCon && prevCon.messages) {
          const existingMessageIds = new Set(prevCon.messages.map(msg => msg.id));
          const newMessages = messages.pages.flatMap(page => 
            page.messages.filter(msg => !existingMessageIds.has(msg.id))
          );
  
          // Only update the state if there are new messages to add
          if (newMessages.length > 0) {
            return {
              ...prevCon,
              messages: [...newMessages, ...prevCon.messages],
            };
          } else {
            return prevCon; // Return the previous state if no new messages
          }
        } else {
          // Initialize messages if they don't exist
          return {
            ...prevCon,
            messages: messages.pages.flatMap(page => page.messages),
          };
        }
      });
    }
  }, [messages]); 

  useEffect(() => {
    if (socket) {
      socket.on("chatResChunk", ({ content }) => {
        cacheConversation.addMsg({ prompt: content }, true);
      });

      socket.on("chatResChunkFunc", async ({ functionData, id }) => {
        console.log("functionName", functionData);
        const data = { id, ...functionData };

        listFuncData.current = updateFuncDataList(listFuncData.current, data);

        console.log("listFuncData", listFuncData.current);
        const params = { prompt: "" };
        const isBot = true;
        await cacheConversation.addMsg(params, isBot, listFuncData.current);
      });

      socket.on("chatResMemo", async ({ active, memoryDetail = [] }) => {
        if(active){
          listMemoData.current = memoryDetail;
          console.log("listMemoData", listMemoData.current)
          const params = { prompt: "" };
          const isBot = true;
          await cacheConversation.addMsg(params, isBot, listFuncData.current, listMemoData.current);
        }
      });

      socket.on("chatResMemoStorage", async ({ active, memoryDetail = [] }) => {
        if(active){
          listMemoStorage.current = memoryDetail;
          console.log("listMemoStorage", listMemoStorage.current)

          const params = { prompt: "" };
          const isBot = true;
          await cacheConversation.addMsg(params, isBot, listFuncData.current, listMemoData.current, listMemoStorage.current);
        }
      })
    }

    return () => {
      if (socket) socket.off("chatResChunk");
      if (socket) socket.off("chatResChunkFunc");
      if (socket) socket.off("chatResMemo");
      if (socket) socket.off("chatResMemoStorage");
    };
  }, [socket]);

  const cacheConversation = {
    del: async (id) => {
      const newCon = conversation.filter((data) => data.id !== id);
      setConversation(newCon);
    },
    addMsg: async (params, isBot = false, functionData = [], dataMemo, memoStorage) => {
      const updateBotMessages = (prevMessages) => {
        const newMessages = [...prevMessages];

        if (newMessages[newMessages.length - 1]?.isBot === false) {
          newMessages.push({
            isBot: true,
            text: params.prompt,
            functionData:
              functionData.length > 0
                ? functionData
                : newMessages[newMessages.length - 1]?.functionData || [],
            ...(dataMemo && {relatedMemo: JSON.stringify(dataMemo)}),
            ...(memoStorage && {memoStorage: memoStorage}),
          });
        } else {
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            isBot: true,
            text: newMessages[newMessages.length - 1].text + params.prompt,
            functionData: functionData.length > 0
                ? functionData
                : newMessages[newMessages.length - 1]?.functionData || [],
            ...(dataMemo && {relatedMemo: JSON.stringify(dataMemo)}),
            ...(memoStorage && {memoStorage: memoStorage}),
          };
        }

        return newMessages;
      };

      const isNewConversation = !selectedConID || selectedConID == -1;
      if (isNewConversation) {
        if (isBot) {
          setCurrenConversation((prev) => ({
            ...prev,
            messages: updateBotMessages(prev.messages),
          }));
        } else {
          setCurrenConversation({
            id: -1,
            name: "New Chat",
            messages: [{ text: params.prompt, isBot: false }],
          });
        }

        return;
      }

      if (isBot) {
        setCurrenConversation((prev) => ({
          ...prev,
          messages: updateBotMessages(prev.messages),
        }));
      } else {
        const index = conversation.findIndex(
          (data) => data.id === selectedConID
        );
        if (index !== -1) {
          const newConversation ={
             ...currentCon,
             messages: [
              ...currentCon.messages,
              { text: params.prompt, isBot: false },
            ],
          };

          setCurrenConversation(newConversation);
        }
      }
    },
    rsMsgAttach: async () => {
      listFuncData.current = [];
      listMemoData.current = [];
      listMemoStorage.current = [];
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await conversationApi.deleteConversation(id);
      await cacheConversation.del(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
      navigate("/chat");
    },
    onError: (error) => {
      console.error("Error deleting conversation:", error);
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ data, isStream }) => {
      await cacheConversation.addMsg(data);
      return conversationApi.createChat(data, isStream);
    },
    onSuccess: (data) =>{
      if (!selectedConID) {
        setTimeout(() => {
          navigate(`/chat/${data.id}`);
        }, 1500);
        const { messages, ...rest } = data
        setConversation(prev => [rest, ...prev])
      }
      cacheConversation.rsMsgAttach();
    },
    onError: (error) => {
      toast.error(`Something went wrong`);
      console.log(error);
    },
  });

  const deleteConversation = useCallback(
    (id) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const addMsg = useCallback(
    (data, isStream, isVision = false) => {
      addMutation.mutate({ data, isStream, isVision });
    },
    [addMutation]
  );

  const contextValue = {
    conversationList: conversation,
    error,
    currenConError,
    isLoading,
    currentConLoading,
    selectedConID,
    deleteConversation,
    addMsg,
    currentCon,
    cacheConversation,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchNextMessages,
    isFetchingNextMessages,
  };

  return (
    <ConversationContext.Provider value={contextValue}>
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationContext;
