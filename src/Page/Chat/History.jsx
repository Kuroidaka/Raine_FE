import { Fragment, useContext, useState } from "react";
import { ChevronRight, ChevronLeft } from 'react-feather';

import Sidebar from "./History/Sidebar";
import styled from "styled-components";
import ConversationContext from "../../Context/conversation.context";
import { toast } from "react-toastify";
import Loading from "../../Component/Loadding";


const History = (p) => {
    const { children } = p

    const { conversationList, error, isLoading } = useContext(ConversationContext)

    if(isLoading) {
        return <Loading></Loading>
    }

    if(error) {
        toast.error(error.message)
    }
    console.log("conversationList", conversationList )
    return (
        <Container>
            <div className="content-ui">
                {children}
            </div>
            <Sidebar data={conversationList}/>
        </Container>
    )
}
 

const Container = styled.div` 
    width: 100%;
    display: flex;
    height: 100%;

    .content-ui {
        flex: 1 1 0%;
    }


`


export default History; 