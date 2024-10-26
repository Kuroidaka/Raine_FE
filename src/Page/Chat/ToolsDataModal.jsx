import { useContext, useEffect, useState } from "react";
import ModalContext from "../../context/Modal.context";
import MarkDown from "../../component/MarkDownChat";
import JSONPretty from 'react-json-pretty';
import styled from "styled-components";
import { toast } from "react-toastify";
import { motion } from "framer-motion"

const ToolsDataModal = () => {

    
    const { modal } = useContext(ModalContext)
    const [message, setMessage] = useState("")
    const [jsonData, setJsonData] = useState(null)

    const [selectedSec, setSelectedSec] = useState("Comment")

    useEffect(() => {
        if(modal.content) {
            const jsonString = JSON.stringify(modal.content.data);
            setJsonData(jsonString)
            setMessage(modal.content.comment)
        }

    }, [modal]);

    const sections = [
        {
            name: "Comment"
        },
        {
            name: "JSON"
        }

    ]

    return ( 
        <Container>
            <TabList>
            {sections.map((sec, idx) => {
                return (
                <motion.li
                    key={idx}
                    className={`col3 pointer-cursor active`}
                    onClick={() => {setSelectedSec( sec.name)}}>
                    {sec.name}
                   {selectedSec === sec.name && <Underline layoutId="underline" />}
                </motion.li>
                )
            })}
            </TabList>

            {selectedSec ==="Comment" ?
                 <div className="mark-down-wrapper">
                 <MarkDown text={message}></MarkDown>
                </div> :
            selectedSec ==="JSON" && jsonData !== null &&
            <div className="json-wrapper">
                <JSONPretty 
                id="json-pretty"
                onJSONPrettyError={() => toast.error("Error occur when pretty JSON")}
                data={jsonData}></JSONPretty>
            </div>
            }

           
        </Container>
     );
}
 
export default ToolsDataModal;

const Container = styled.div` 
    padding: 10px;
    height: 90%;

    .json-wrapper {
        height: 100%;
        overflow-y: scroll;
        margin-bottom: 20px;
    }

    .mark-down-wrapper {
        height: 100%;
        overflow-y: scroll;
        padding: 5px 19px 0px;
    }
`

const TabList = styled.ul`
    list-style: none;
    display: flex;
    justify-content: center;
    height: 3%;
    box-shadow: 0 0 25px 0 rgba(0,0,0,.04);
    margin-bottom: 10px;
    li {
        text-align: center;
        height: 100%;
        font-size: 1.4rem;
        font-weight: 500;
        position: relative;
        transition: all 0.3s ease-in-out;
        &.active {
            user-select: none;

        }
    }
`

const Underline = styled(motion.div) `
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--main-gradient);
    border-radius: 10px;
`

