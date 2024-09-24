import styled from "styled-components";
// import DOMPurify from "dompurify";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import IconCustom from "../../../assets/Icons/svg";
import { useContext, useEffect, useState  } from "react";
import Logo from "../../../assets/img/Logo";
import MarkDown from "../../../component/MarkDownChat";
import { Card as TaskCard } from "../../Planner/card/TaskCard";
import { Card as RoutineCard } from "../../Planner/card/RoutineCard";
import ModalContext from "../../../Context/Modal.context";
import { FiTerminal } from "react-icons/fi";
import { FadeIn } from "../../../Component/Motion";

const functionIcon = {
    "create_reminder": {
        "icon": "⏱️",
        "process": "Reminder Creating",
        "done": "Reminder Created"
    },
    "get_current_weather": {
        "icon": "☁️",
        "process": "Weather Getting",
        "done": "Weather"
    },
    "browse": {
        "icon": "🔍",
        "process": "Google Browsing",
        "done": "Google Browsed"
    },
    "ask_about_document":{
        "icon": "📁",
        "process": "Document Finding",
        "done": "Document Found"
    },
    "database_chat":{
        "icon": "🛢️",
        "process": "Database Chatting",
        "done": "Database Chat"            
    },
    "generate_image":{
        "icon": "🖼️",
        "process": "Image Generating",
        "done": "Image Generated"            
    },
    "follow_up_image_in_chat":{
        "icon": "👁️",
        "process": "Looking up Image",
        "done": "Image answered"            
    },
    "scrape_website":{
        "icon": "🔗",
        "process": "Website Scraping",
        "done": "Website Scraped"            
    },
    "ReminderChatService":{
        "icon": "⏱️",
        "process": "Query Tasks",
    },
    "RoutineChatService":{
        "icon": "⏱️",
        "process": "Query Routines",
    },
    "ReminderCreateChatService":{
        "icon": "⏱️",
        "process": "Create Task",
    },
    "RoutineCreateChatService":{
        "icon": "⏱️",
        "process": "Create Routine",
    },
    "FileAskChatService":{
        "icon": "📁",
        "process": "File Search",
    }

}

const BotMsg = (p) => {
    const { text, className, functionList=[], memoryDetail, memoStorage } = p

    const [thinking, setThinking] = useState(true)

    const scrollToBottom = () => {
        // pageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        const div = document.querySelector('.list-chat');
        div.scrollTop = div.scrollHeight - div.clientHeight + 1000;
    };

    useEffect(scrollToBottom, [text, functionList]);


    const renderMemoryDetail = () => {
        if(memoryDetail && memoryDetail.length > 0) {
            return <MemoAgent memo={memoryDetail}/>
        }
        return null
    }

    const renderFunctionList = () => {
        if (functionList && functionList.length > 0) {
            return functionList.map((agent) => (
                <div key={agent.id}>
                    <FadeIn className="func-data-wrapper" >
                        <FunctionAgent agent={agent}/>
                       <div className="func-data-list"> <FunctionData agent={agent}/></div>
                    </FadeIn>
                </div>
            ))  
        }
        return null
    }

    const renderMemoStorage = () => {
        if(memoStorage) {
            return <MemoStorageAgent memoStorage={memoStorage}/>
        }
        return null
    }

    useEffect(() => {
        if (text.length > 0 || functionList.length > 0) {
            setThinking(false)
        }
    }, [text, functionList])

    return ( 
    <Container className={`chat-msg bot-chat ${className}`} >
        <div className='icon'>
            <div className='bot-icon-wrapper'>
                {/* <IconCustom.logo/> */}
                <Logo className='bot-icon'></Logo>
            </div>
        </div>
        <div className="chat-content">
            <p className='chat-person'>{"Raine"}</p>
            {thinking && <p>Thinking...</p>}
            {renderMemoryDetail()}
            {renderFunctionList()}
           {(text || functionList.length > 0) &&
            <div className="bot-text-wrapper">
            {
                // checkIsImgLink(text) ? (
                //     <div className='bot-text'>
                //         <ImageCom 
                //             src={text}
                //             imgPlaceHolder={imgPlaceHolder} 
                //             imgsize={'423px' }
                //         />
                //     </div>
                // ) : (
                    <div className='bot-text'>
                        <MarkDown text={text}/>
                    </div>
                // )
            }
            </div>}
            {renderMemoStorage()}
        </div>
    </Container>   
     );
}
 
const FunctionAgent = (p) => {
    const { agent } = p
    const { openModal }  = useContext(ModalContext)

    const [listFuncData, setListFuncData] = useState({})

    useEffect(() => {
        
        const processFunctionListType = () => {
            try {
                const data = {...agent, data: JSON.parse(agent.data)}
                
                setListFuncData(data)
                
            } catch (error) {
                setListFuncData(agent)
            }
        }

        processFunctionListType()
    }, [agent]);

    const handleClickShow = () => {
        const title = agent.name
        const content = listFuncData
        const type = "tool"
        const mode = "view"
        openModal(title, content, type, mode)
    }

    return (
        <FadeIn className="bot-text-wrapper function-agent">
            <div className='bot-text'>
                <div className="function">
                    <div className="function-title">
                        <IconCustom.task></IconCustom.task>
                        Task Added:
                    </div>
                    <div className="function-name">
                        <div className="icon">{functionIcon[agent.name].icon}</div>
                        <div className="text">{functionIcon[agent.name].process}</div>
                    </div>
                </div>
                {(listFuncData.comment || listFuncData.data) && <div className="btn_show">
                    <FiTerminal onClick={handleClickShow}>Click</FiTerminal>
                </div>}
            </div>
        </FadeIn>
    )
}

const MemoAgent = (p) => {
    const { memo } = p
    const { openModal }  = useContext(ModalContext)


    const handleClickShow = () => {
        const title = "Relate Memory"
        const content = memo
        const type = "memo"
        const mode = "view"
        openModal(title, content, type, mode)
    }


    return (
        <FadeIn className="bot-text-wrapper function-agent memo-relate-agent">
            <div className='bot-text'>
                <div className="function">
                    <div className="function-title">
                        <IconCustom.task></IconCustom.task>
                    </div>
                    <div className="function-name">
                       Relate Memory
                    </div>
                </div>
                {(memo && memo.length > 0) && <div className="btn_show">
                    <FiTerminal onClick={handleClickShow}>Click</FiTerminal>
                </div>}
            </div>
        </FadeIn>
    )
}

const MemoStorageAgent = (p) => {
    const { memoStorage } = p
    const { openModal }  = useContext(ModalContext)


    const handleClickShow = () => {
        const title = "Memory saved"
        const content = memoStorage
        const type = "memo"
        const mode = "view"
        openModal(title, content, type, mode)
    }

    console.log("memoStorage", memoStorage)
    return (
        <FadeIn className="bot-text-wrapper function-agent memo-storage-agent">
            <div className='bot-text'>
                <div className="function">
                    <div className="function-title">
                        <IconCustom.task></IconCustom.task>
                    </div>
                    <div className="function-name">
                        Memory Saved
                    </div>
                </div>
                {(memoStorage && memoStorage.length > 0) && <div className="btn_show">
                    <FiTerminal onClick={handleClickShow}>Click</FiTerminal>
                </div>}
            </div>
        </FadeIn>
    )
}


const FunctionData = ({ agent }) => {
    const [listFuncData, setListFuncData] = useState([]);
    const [funcName, setFuncName] = useState("");

    useEffect(() => {
        const processFunctionListType = () => {
            try {
                // Attempt to parse agent.data if it's a string
                let data = typeof agent.data === 'string' ? JSON.parse(agent.data) : agent.data;
            
                // Ensure that data is always an array
                setListFuncData(Array.isArray(data) ? data : (data !== null && data !== undefined) ? [data] : []);
            } catch (error) {
                console.error('Failed to parse agent data:', error);
                setListFuncData([]);
            }
            setFuncName(agent.name);
        };

        processFunctionListType();
    }, [agent]);

    const renderCards = () => {
        if (!listFuncData || listFuncData.length === 0) return null;

        const cardComponents = {
            "ReminderChatService": TaskCard,
            "RoutineChatService": RoutineCard,
            "ReminderCreateChatService": TaskCard,
            "RoutineCreateChatService": RoutineCard,
            "FileAskChatService": null
        };

        const sharedProps = (funcData) => ({
            title: funcData.title,
            color: funcData.color,
            note: funcData.note,
            id: funcData.id,
            mode: "view",
        });

        const specificProps = {
            "ReminderChatService": (funcData) => ({
                ...sharedProps(funcData),
                deadline: funcData.deadline,
                area: funcData.area,
                subTask: funcData.subTask,
                status: funcData.status,
            }),
            "RoutineChatService": (funcData) => ({
                ...sharedProps(funcData),
                area: funcData.area,
                routineDate: funcData.routineDate,
                isActive: funcData.isActive,
                routineTime: funcData.routineTime,
            }),
            "ReminderCreateChatService": (funcData) => ({
                ...sharedProps(funcData),
                deadline: funcData.deadline,
                status: funcData.status,
            }),
            "RoutineCreateChatService": (funcData) => ({
                ...sharedProps(funcData),
                isActive: funcData.isActive,
                routineTime: funcData.routineTime,
            }),
            "FileAskChatService": (funcData) => ({
                ...sharedProps(funcData),
                file: funcData.file,
            }),
        };

        const CardComponent = cardComponents[funcName];
        const getProps = specificProps[funcName];

        if (!CardComponent) return null;

        return (
            <FuncDataContainer>
                {listFuncData.map((funcData) => (
                    <CardComponent key={funcData.id} {...getProps(funcData)} />
                ))}
            </FuncDataContainer>
        );
    };

    return renderCards();
};

export default BotMsg;

const Container = styled.div`
    /*bot*/
    width: 100%;
    display: flex;
    direction: ltr;

    .icon {
        display: flex;
        align-items: center;
        align-self: flex-start;
        .bot-icon-wrapper {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;

            width: 40px;
            border-radius: 50%;
            background-color: #D4DBFE;
            .bot-icon {
                width: 30px;
            }
        }
    }
    .chat-content{
        max-width: 80%;
        width: auto;
        margin-left: 18px;
        p.chat-person {
            font-size: 16px;   /* Thay đổi kích thước của chữ StudyIO */
            font-weight: bold;
            margin-bottom: 7px;
        }
        .bot-text-wrapper{
            padding: 10px;
            border-radius: 10px;
            background: #666666;
            display: flex;
            align-items: center;
            justify-content: center;
            .bot-text {
                overflow-x: scroll;
                width:100%;
                pre {
                    overflow-x: scroll;
                }
                a {
                    color: #00a5ff;
                    text-decoration: none;
                    font-weight: 500;
                }
                img {
                    width: 100%;
                    max-width: 350px;
                    margin: 10px 0;
                    /* cursor: pointer; */
                }
                p {
                    font-weight: 500;
                }
                ol,ul {
                    padding: 6px 25px;
                    li {
                        font-size: 15px;   /* Thay đổi kích thước của chữ StudyIO */
                        font-weight: 500;
                        margin: 10px 0;

                        a {
                            color: #00a5ff;
                            text-decoration: none;
                            font-weight: 500;
                        
                        }
                    }
    
                } 


            }

            & + .bot-text-wrapper  {
                margin-top: 10px;
            
            }

            &.function-agent {
                /* width: fit-content; */
                box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                background-color: #434343;
                padding: 3px 10px;
                border-top-left-radius: 10px!important;
                border-top-right-radius: 10px!important;
                border-bottom-left-radius: 0px!important;
                border-bottom-right-radius: 0px!important;
                margin-bottom: 10px;


                &.memo-storage-agent {
                    border-radius: 10px!important;
                }

                &.memo-relate-agent {
                    border-radius: 10px!important;
                }

                .bot-text {
                    display: flex;
                    justify-content: space-between;
                    gap:10px;
                }

                .function {
                    display: flex;
                    .function-title {
                        font-weight: 800;
                        gap: 6px;
                        display: flex;
                        align-items: center;
                        font-size: 13px;

                        svg {
                            &.task {
                                rotate: -45deg;
                            }
                        }
                    }

                    .function-name {
                        display: flex;
                        align-items: center;
                        margin-left: 10px;
                        font-weight: 800;
                        .icon {
                            font-size: 13px;
                            margin-right: 5px;
                        }
                        .text {
                            font-size: 13px;
                        
                        }
                    }
                }

                .btn_show {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    svg {
                        font-size: 2rem;
                        transition: all .2s linear;

                        &:hover {
                            color:var(--second-color);
                        }
                    }
                }
            }
        }

        .func-data-wrapper {
            border-radius: 10px;
            background: #666666;
            margin-bottom: 10px;
        }
    }

    &.waiting {
        @keyframes jump {
            0% { transform: translateY(5px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(5px); }
        }

        .bot-text-wrapper {
            padding: 6px;
            .bot-text {
                gap: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 25px;
                .chat-dot {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background-color: #848484;
                    border-radius: 50%;
                    animation: jump .8s linear infinite;


                    &:nth-child(1) {
                        animation-delay: 0s;
                    }
                    &:nth-child(2) {
                        animation-delay: 0.15s;
                    }
                    &:nth-child(3) {
                        animation-delay: 0.3s;
                    }

                }
            }
        }
    }
`

const FuncDataContainer = styled(FadeIn) ` 
 padding: 25px 10px 10px;
 max-height: 300px;
 overflow-y: scroll;
`