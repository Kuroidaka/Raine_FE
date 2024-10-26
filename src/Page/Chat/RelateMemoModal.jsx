import { useContext, useEffect, useState } from "react";
import ModalContext from "../../context/Modal.context";
import MarkDown from "../../component/MarkDownChat";
import JSONPretty from 'react-json-pretty';
import styled from "styled-components";
import { toast } from "react-toastify";
import { motion } from "framer-motion"

const RelateMemoModal = () => {

    
    const { modal } = useContext(ModalContext)
    const [jsonData, setJsonData] = useState(null)

    const [selectedSec, setSelectedSec] = useState("JSON")

    useEffect(() => {
        if(modal.content) {

            const dataJson = modal.content.map(data => {
                return {
                    guide: data.guide,
                    answer: data.answer,
                    criteria: data.criteria,
                    createdAt: data.createdAt,
                    distance: data.distance
                }
            })
            const jsonString = JSON.stringify(dataJson);
            setJsonData(jsonString)
        }

    }, [modal]);

    const sections = [
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
                    onClick={() => {setSelectedSec(sec.name)}}>
                    {sec.name}
                   {selectedSec === sec.name && <Underline layoutId="underline" />}
                </motion.li>
                )
            })}
            </TabList>

            {selectedSec ==="JSON" && jsonData !== null &&
            <div className="json-wrapper">
                <JSONPretty 
                id="json-pretty"
                onJSONPrettyError={() => toast.error("Error occur when pretty JSON")}
                data={jsonData}></JSONPretty>
            </div>}
        </Container>
     );
}
 
export default RelateMemoModal;

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

