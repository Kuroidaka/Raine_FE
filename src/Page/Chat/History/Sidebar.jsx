import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SidebarNav from "./sidebar_nav";
import { useState } from "react";

// import SidebarNav from "../../../../../FE_TEMp/src/layout/component/sidebar/sidebar_nav";
// import Load from "../../../../../FE_TEMp/src/component/Load";
// import { useContext } from "react";
// import ConversationContext from "../../../../../FE_TEMp/src/context/Conversation.context";


const Sidebar = (p) => {
    const { data } = p
    const [selectedID, setSelect] = useState("")

    const navigate = useNavigate()

    const hdlSelCon = (id) => {
        // selectCon({id, dayRef})
        setSelect(id)
        navigate('/chat')
    }

    return ( 
        <Container>
            <div className="cover">
                <h2>History</h2>

                <div className="conversation-list" aria-hidden="true">
                {(data && data.length > 0 ) ?
                (
                    data.map((item, index) => (
                    <div className="day-ref-section" key={index}>
                        {item.messages.length > 0 && <h4 className="title">test</h4>}
                        <ul >
                            {item.messages && 
                            item.messages.map((conversation, index) => {
                              return (
                                <SidebarNav
                                    key={index} 
                                    conversation={conversation}
                                    selectedID={selectedID}
                                    hdlSelCon={hdlSelCon}
                                > </SidebarNav>
                              )
                            })}
                        </ul>
                    </div>
                ))
                ) : (
                    <div className="empty">
                        <p>No conversation</p>
                </div>)
                }
            </div>

                <Team>
                </Team>

            </div>
        </Container>
     );
}

const Team = styled.div`
    width: 100%;
    height: 10vh;
    background-color: var(--primary-color);
    /* padding: initial; */
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
`


const Container = styled.div ` 

    height: 100%;
    width: 235px;
    .cover{
        color: var(--white-text);
        background: var(--main-gradient);
        width: 100%;
        height: 100%;
        padding: 10px 18px;
        position: relative;
        z-index: 100;

        h2{
            color: #ffff;
            font-size: 22px;
            line-height: 32px;
            margin-left: 10px;
        }

        .conversation-list{
            height: 80%;
            margin-top: 18px;
            
            &[aria-hidden="true"]  { overflow-y: scroll; }
            &[aria-hidden="false"] { overflow-y: visible; }

            .title{
                color: var(--second-color);
                font-size: 12px;
                margin-bottom: 3px;
                margin-left: 10px;
                line-height: 20px;
            }
            li{
                list-style: none;
            }

            .conversation{
                cursor: pointer;
                display: flex;
                position: relative;
                margin: 7px 0;
                height: 30px;
                align-items: center;
                justify-content: space-between;
                border-radius: 5px;
                transition: all 0.3s ease-in-out;
                .setting{
                    display: none;
                    height: 100%;
                    align-items: center;
                    position: absolute;
                    right: 0;
                    justify-content: center;
                    width: 34%;

                    .icon-wrapper {
                        height: 100%;
                        display: flex;
                        width: 100%;
                        padding-right: 10px;
                        border-bottom-right-radius: 5px;
                        border-top-right-radius: 5px;
                        align-items: center;
                        justify-content: center;
                        background: var(--selected-color);
                        svg {
                            background-color: white;
                            font-size: 1.9rem;
                            transition: all 0.3s ease-in-out;
                        }
                    }

                    .gradient-overlay {
                        background: linear-gradient(to right, transparent, var(--selected-color));
                        width: 100%;
                        height: 100%;
                    }
                }
                .item {
                    height: 100%;
                    padding: 0px 10px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    p {
                        font-size: 13px;
                        transition: all 0.3s ease-in-out;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 100%;
                        color: #ebebeb;
                    }
                }

                &.selected{
                    background-color: var(--selected-color);
                    .item p {
                        font-weight: 700;
                    }
                    .setting{
                        display: flex;
                    }
                }

                &.hover-effect {
                    background-color: var(--third-color);
                    
                    box-sizing: border-box;
                    .setting{
                        display: flex;
                        cursor: pointer;
                    }
                }
                
                &:not(.selected):hover {
                    background-color: var(--third-color);
                    
                    box-sizing: border-box;
                    .setting{
                        display: flex;
                        cursor: pointer;

                        .icon-wrapper {

                            background: var(--third-color);
                            svg {
                                background-color: white;
                            }
                        }

                        .gradient-overlay {
                            background: linear-gradient(to right, transparent, var(--third-color));

                        }
                    }
                }
            }


            h4.title {
                user-select: none;
            }
            
        }
        .body{
            display: flex;
            text-align: center;

            .spinner-wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                .spinner{
                    width: 35px;
                    height: 35px;
                    display: inline-block;
                    border: 4px solid white;
                    border-radius: 50%;
                    border-top: 4px solid #ff8000;
                    animation: spinner 1.5s linear infinite;
                }
                @keyframes spinner {
                    to {
                      transform: rotate(360deg);
                    }
                  }

            }
            p{
                margin-left: 5px;
            }
              
        }
    }


`

export default Sidebar;
