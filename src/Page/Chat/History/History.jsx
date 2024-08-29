import { Fragment, useContext, useState } from "react";
import { ChevronRight, ChevronLeft } from 'react-feather';

import Sidebar from "./Sidebar";
import styled from "styled-components";
import ConversationContext from "../../../Context/conversation.context";
import { toast } from "react-toastify";
import Loading from "../../../Component/Loading";
import OverlayDimLoading from "../../../Component/Overlay";


const History = (p) => {
    const { children } = p

    const { conversationList, error, isLoading,
        selectedConID

     } = useContext(ConversationContext)


    if(isLoading) {
        return <OverlayDimLoading />
    }

    if(error) {
        toast.error(error.message)
    }
    return (
        <Container>
            <div className="content-ui">
                {children}
            </div>
            <Sidebar data={conversationList} selectedConID={selectedConID}/>
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