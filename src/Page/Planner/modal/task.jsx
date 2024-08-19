import { Fragment, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ModalContext from "../../../Context/Modal.context";
import TaskContext from "../../../Context/Task.context";
import DOMPurify from "dompurify";
import { dateConvert, isDateString, isISODateString } from "../../../Util";
import { Img } from "../../../assets/svg";
import Input from "../../../Component/Input";
import Flatpickr from "react-flatpickr";
import ReactQuill from 'react-quill';
import { CirclePicker } from "react-color";
import Button from "../../../Component/Button";

import myCursor from "../../../assets/cursor/Labrador_Retriever.cur"
import { toast } from "react-toastify";
import { radioData, relatedArea } from "./constants";



const Task = (p) => {

    const { dataInput, setDataInput, mode, areaData } = p
    
    const { modal, closeModal }  = useContext(ModalContext)
    const { handleAddTask, handleUpdateTask }  = useContext(TaskContext)
    const [valid, setValid] = useState(true)
    const fp = useRef(null);

    const sanitizedHTML = DOMPurify.sanitize(dataInput.note);
    // const [dataInput, setDataInput] = useState(data)

    const [area, setArea] = useState(areaData)
    
    const [hex, setHex] = useState(dataInput.color);
    const [secOpen, setSecOpen] = useState({
        color: true,
        area: true,
        note: true,
        deadline: true
    });

    useEffect(() => {
        console.log("listen event close modal")
        window.addEventListener('modalClosing', closeModalProcess);

        return () => {
            window.removeEventListener('modalClosing', closeModalProcess);
        };
    }, []);

    useEffect(() => {
        areaData && setArea(areaData)
    }, [areaData]);

    useEffect(() => {
        if(dataInput) {
            dataInput.color && setHex(dataInput.color);
        }
    }, [dataInput]);

    const closeModalProcess = () => {
        setDataInput({})
        setSecOpen({
            color: true,
            area: true,
            note: true,
            deadline: true
        })
    }


    const deadlineHdle = {
        openFP: () => { // open flatpicker
            document.querySelector(".flat-picker-wrapper").style.display = "flex"
        },
        closeFP: () => { // close flatpicker
            document.querySelector(".flat-picker-wrapper").style.display = "none"
        },
        choseType: (e, mode) => { //handle Choose type of deadline

            console.log(e.target.id)
            const id = e.target.id
            let dateStr = id
            if(id === "") return 
            if(id === "today") {
                const today = new Date()
                today.setHours(23,59,59,0)
                dateStr = today
            }else if(id === "tomorrow") {
                const today = new Date()
                const tomorrow = new Date(today.setHours(0,0,0,0))
                tomorrow.setDate(tomorrow.getDate() + 1)
    
                dateStr = tomorrow
            }
            else if(id === "specific-day") {
                deadlineHdle.openFP()
            } else {
                deadlineHdle.closeFP()
                if(mode === "edit") setSecOpen({...secOpen, deadline: !secOpen.deadline })
            }
    
            console.log(dateStr)
            setDataInput({...dataInput, deadline: dateStr.toString() })
        },
        choseDateFP: (date) => { // handle choose date from flatpicker
            setDataInput(prevData => ({ ...prevData, deadline: date[0].toString() }));
            console.log(date[0].toString())
            fp.current.flatpickr.close();
        }
    }

    const openSec = async (e) => {
        const name = e.currentTarget.getAttribute("name")
        console.log(name)

        await setSecOpen({...secOpen, [name]: !secOpen[name] })
        if(name === "deadline" && isDateString(dataInput.deadline))  {
            await deadlineHdle.openFP()
        }
    }

    const handleInput = (e, from = null) => {

        const name = from || e.target.name
        const value = e.target.value

        setDataInput({...dataInput, [name]: value })
    }

    const handleChooseArea = (name) => {
        console.log(name)
        let newArea = {...area, [name]: !area[name] };
        setArea(newArea)
    
        const newData = Object.keys(newArea).reduce((prev, next) => {
            if(newArea[next]) {
                return [...prev, next]
            } else {
                return prev
            }
        }, [])
        console.log("newData", newData)
    
        setDataInput({...dataInput, area: newData })
    }

    // submit
    const handleSave = async () => {
        const valid = checkValid();
    
        try {
            if (valid) {
                setValid(true);
    
                if (mode === "edit") {
                    const taskId = modal.content.id
                    console.log("dataInput", dataInput)
                    await handleUpdateTask(taskId, dataInput);
                } else {
                   await handleAddTask(dataInput);
                }
    
                closeModal();
            }
        } catch (error) {
            console.error(error); // Using console.error for logging errors
            toast.error("An error occurred");
        }
    };
    

    const Area = (p) => {
        const { data } = p
        const Image = Img[data]
        if(Image) return <Image/>
    }

    const checkValid = () => {
        if(typeof(dataInput.title) === "undefined" || dataInput.title.trim() === "") {
            setValid(false)
            return false
        }
        return true
    }

    return ( 
    <Content>           
        {/* TITLE */}
        <ModalSectionContent title="Tiêu đề" Icon={Img.pen}>
            <Input name="title" inputStyle={{width: "80%"}} value={dataInput.title} onInput={handleInput}/>
        </ModalSectionContent>
        {!valid && <Validate>Bắt buộc phải có tiêu đề</Validate>}
        {/* COLOR */}
        <ModalSectionContent 
            title="Màu tag"
            name="color"
            Icon={Img.tag}
            plus={mode === "edit" ? false : secOpen.color}
            openSec={openSec}>
        {mode === "edit" ?
            (<EditSection name="color" onClick={openSec} isedit={secOpen.color}>
                <CirclePicker
                    colors={
                        !secOpen.color 
                            ? ["#f44336", "#e91e63", "#673ab7", "#03a9f4", "#4caf50", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"]
                            : [dataInput.color]
                        }
                    onChange={(color) => {
                        setHex(color.hex);
                        setDataInput({...dataInput, color: color.hex })
                    }}
                    color={hex}
                    circleSize={18}
                    circleSpacing={0}
                    // onSwatchHover={(color, event) => setHex(color.hex)}
                    />
                </EditSection>
            ) : (
                !secOpen.color && <CirclePicker
                colors={["#f44336", "#e91e63", "#673ab7", "#03a9f4", "#4caf50", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"]}
                onChange={(color) => {
                    setHex(color.hex);
                    setDataInput({...dataInput, color: color.hex })
                  }}
                color={hex}
                circleSize={15}
                circleSpacing={0}
                // onSwatchHover={(color, event) => setHex(color.hex)}
                />)}
        </ModalSectionContent>
        
        {/* AREA */}
        <ModalSectionContent 
            title="Liên quan"
            name="area"
            Icon={Img.area}
            plus={mode === "edit" ? false : secOpen.area}
            openSec={openSec} >
        {mode === "edit" && secOpen.area 
        ? (
            <EditSection name="area" onClick={openSec} isedit={secOpen.area}>
                <div className="area-wrapper">
                {area && Object.keys(area).map((data, idx) => {

                    if(area[data])
                    return (
                        <Area key={idx} data={data}/>
                    )})
                }
                </div>
            </EditSection>
        ) : (
            (!secOpen.area && relatedArea) && relatedArea.map(data => {
                return (
                    <RelateAres className={area[data.name] ? "text-dark" : ""} key={data.name} onClick={() => handleChooseArea(data.name)}>
                        <data.icon />
                        <p>{data.value}</p>
                    </RelateAres>
                )
            })
        )}
        
        </ModalSectionContent>

        {/* DEADLINE */}
        
        <ModalSectionContent title="Thời hạn" Icon={Img.deadline} >
            <Deadline>
            {mode === "edit" && secOpen.deadline 
                ? (
                    <EditSection name="deadline" onClick={openSec} isedit={secOpen.deadline}>
                    {isISODateString(dataInput.deadline) 
                        ? dateConvert(dataInput.deadline)
                        : radioData.find(radio => radio.id === dataInput.deadline)?.value ?? "Chọn thời hạn"}
                    </EditSection>
                ) : (
                    <Fragment>
                    <Ratio>
                        {radioData && radioData.map(radio =>{
                            let isChecked = false
                            if(mode === "edit") {
                                if(dataInput.deadline === radio.id) isChecked = true
                                if(isDateString(dataInput.deadline) && radio.id === "specific-day") isChecked = true
                            }
                        return (
                        <label key={radio.id} htmlFor={radio.id}onClick={(e) => deadlineHdle.choseType(e, mode)}>
                            <input type="radio" id={radio.id} name="radio" defaultChecked={mode === "edit" ? isChecked : radio.id === "today" && "checked"} />
                            <span>{radio.value}</span>
                        </label>
                        )})}
                    </Ratio>
                    <div className="flat-picker-wrapper">
                        <Flatpickr
                        ref={fp}
                        options={{
                            inline: true,
                            minDate: "today",
                        }}
                        value={isDateString(dataInput.deadline) ? new Date(dataInput.deadline) : null}
                        onChange={(date) => deadlineHdle.choseDateFP(date)}
                        />
                    </div>
                    </Fragment>
                )}
            </Deadline>
        </ModalSectionContent>
        
        {/* NOTE */}
        <ModalSectionContent 
            title="Ghi chú"
            name="note"
            Icon={Img.note}
            plus={mode === "edit" ? false : secOpen.note}
            openSec={openSec}>
        {mode === "edit" && secOpen.note
        ? (
            <EditSection name="note" onClick={openSec} isedit={secOpen.note}>
                <div className="note-wrapper" onClick={() => { 
                    setSecOpen({...secOpen, note: false })
                }}>
                    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} className="wrap-text"/>
                    {/* <ReactQuill
                        value={dataInput.note}
                        readOnly={true}
                        theme={"bubble"}
                        /> */}
                </div>
            </EditSection> 
        ) : (
            !secOpen.note && <ReactQuill 
                theme="snow"
                placeholder="Ghi chú của bạn..."
                value={dataInput.note}
                onChange={(value) => {
                    setDataInput({...dataInput, note: value })
                }}/>
        )}                    
        </ModalSectionContent>

        
        <Button
            title="Lưu"
            onClick={handleSave}
            className="text-center"
            style={{marginTop: "20px"}}
        />
    </Content> 
     );
}

const ModalSectionContent = (p) => {
    const { title, name, Icon, children, plus, openSec } = p
    
    return (
        <ModalSectionContentStyle className="tag">
            <Label 
                name={name}
                className={`text-dark ${plus ? "click-able" : ""}`}
                onClick={plus ? openSec : null}>
                <Icon />
                <span className="text">{title}</span>
                {plus && <span className="icon">&nbsp;+</span>}
            </Label>
            <div className="content">
                {children}
            </div>
            
        </ModalSectionContentStyle>
    )
}

const EditSection = (p) => {
    const { children, onClick, isedit, name } = p
    return (
        <EditSectionContainer name={name} isedit={isedit?.toString()}>
            {children}
        
        {name !== "note" && <span name={name} onClick={onClick} className={name === "color" && "pl-10"}><Img.edit /></span>}
        </EditSectionContainer>
    )
}
export default Task;



const EditSectionContainer = styled.div `
    display: flex;
    align-items: center;
    width: ${({name}) => name ==="note" && "100%" };

    .note-wrapper {
        width: 100%;
        background-color: #f8f8f8;
        padding: 20px 30px;
        border-radius: 12px;
    }
    .area-wrapper {
        display: flex;
        gap: 9px;

        svg {
            width: 14px;
        }
    }

    span {
        line-height: 1;
        svg {
            margin-left: 10px;
            width: 14px;
            cursor: url(${myCursor}), auto;
        }

        &:hover {
            svg {
                color: var(--second-color);
            }
        }
    }

    .ql-editor {
        max-width: 370px!important;
    }

    .circle-picker {
        width: ${({isedit}) => isedit === "true" && "10px!important" };
        display: grid!important;
        grid-template-columns: ${({isedit}) => isedit === "true" ? "0px!important" : "20px 20px 20px 20px 20px!important" };
        grid-template-rows: ${({isedit}) => isedit === "true" ? "20px!important" : "10px!important" };
        column-gap: 10px;
        row-gap: 15px;
    }
`

const Content = styled.div`

    height: calc(100vh - var(--modal-header));
    overflow-y: scroll;
    padding-bottom: 20px;

    .title {
        margin-top: 18px;

        .title-input {
            width: 100%;
            display: flex;
            justify-content: center;
        }
    }

    .tag {
        margin-top: 3.3rem;

        .color-input {
            margin-top: 10px;
            width: 100%;
            display: flex;
            justify-content: center;
        }
    }

    .circle-picker {
        gap: 7px;
        justify-content: center;  
        display: grid!important;
        grid-template-columns: 20px 20px 20px 20px 20px;
        grid-template-rows: 10px;
        column-gap: 10px;
        row-gap: 15px;
    }

`
const Label = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;
    align-items: center;
    

    svg {
        width: 15px;
    }

    .text {
        margin-left: 6px;
        font-weight: 700;
    }

    .icon {
        font-size: 17px;
        font-weight: 700;
    }

    &.click-able {
        
            cursor: url(${myCursor}), auto;
        &:hover {
            svg {
                transition: all .3s ease-in-out;
                color: var(--second-color);
            }

            .text {
                transition: all .3s ease-in-out;
                color: var(--second-color);
            }

            .icon {
                transition: all .3s ease-in-out;
                color: var(--second-color);
            }

        }
    }
`

const RelateAres = styled.div `
    text-align: center;
    color: #b8c2cc;
    cursor: url(${myCursor}), auto;
    width: 25%;

    svg {
        width: 18px;
    }

    p {
        font-size: 1.2rem;
        font-weight: 600;
    }

`
const Deadline = styled.div`
    text-align: center;
    
    .flat-picker-wrapper {
        display: none;
        justify-content: center;

    }

    input.flatpickr-input {
        display: none!important;
    }
`

const Ratio = styled.div`

    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: row;
    label {
    display: flex
            cursor: url(${myCursor}), auto;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    margin-bottom: 0.375em;
    /* Accessible outline */
    /* Remove comment to use */ 
    /*
        &:focus-within {
            outline: .125em solid #00005c;
        }
    */
    input {
        position: absolute;
        left: -9999px;
        &:checked + span {
        background-color: mix(#fff, #10163A, 84%);
        &:before {
            box-shadow: inset 0 0 0 0.3375em #10163A;
        }
        }
    }
    span {
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        padding: 0.375em 0.75em 0.375em 0.375em;
        border-radius: 99em; // or something higher...
        transition: 0.25s ease;
        &:hover {
        background-color: mix(#fff, #10163A, 84%);
        }
        &:before {
        display: flex;
        flex-shrink: 0;
        content: "";
        background-color: #fff;
        width: 1.1em;
        height: 1.1em;
        border-radius: 50%;
        margin-right: 0.375em;
        transition: 0.25s ease;
        box-shadow: inset 0 0 0 0.125em #10163A;
        }
    }
    }


`
const ModalSectionContentStyle = styled.div `
        margin-top: 18px;

        .content {
            margin-top: 10px;
            width: 100%;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 24px 0;
            padding: 0 16px;
        }

        .w-color-circle {
            div {
                width: 17px!important;
                height: 17px!important;
            }
        }
        
        .quill {
            width:100%;

            .ql-container {
            height: auto!important;
        }}
        

    `

const Validate = styled.p`
    text-align: center;
    color: red;

`
 