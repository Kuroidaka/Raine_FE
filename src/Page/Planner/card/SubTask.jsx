import { useEffect, useState } from "react"
import styled from "styled-components"
import Input from "../../../Component/Input"
import { Img } from "../../../assets/svg";
import myCursor from '../../../assets/cursor/Labrador_Retriever.cur';

const SubTask = (p) => {
    const { color, title, done, updateSubCheck, updateSubTitle, id, deleteSubTask, mode } = p

    const [checked, setChecked] = useState(done)
    const [edit, setEdit] = useState(false)
    const [value, setValue] = useState(title)

    useEffect(() => {
        setValue(title)
    }, [title])

    const inputStyle = {
        width:"100%",
        height:"35px",
        backgroundColor:"transparent",
        border: "none",
        fontSize: "1.2rem"
    }

    const handleCheck = (e, customID = null) => {
        if(mode !== "view"){
            setChecked(!checked)
            let id 
            if(customID !== null) 
                id = customID
            else id = e.currentTarget.id
            updateSubCheck(id, !checked)
        }
    }

    const openEdit = () => {
        setEdit(true)
    }
    
    const closeEdit = async () => {
        setEdit(false)
        await updateSubTitle(id, value)
    }


    const handleInput = (e) => {
        const value = e.target.value
        setValue(value)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            closeEdit()
        }
    }

    const handleDel = (e) => {
        const id = e.currentTarget.getAttribute("name")
        deleteSubTask(id)
    }
    
    return (
    <SubTaskContainer className={`item ${color === "" ? "text-white" : ""}`}>
        <div className="title-wrapper">
        <span id={id} onClick={handleCheck} className={`${checked ? "blur" : ""}`}>{checked ? <Img.checkboxChecked /> : <Img.checkbox/>}</span>
            <div className={`title ${checked ? "line-through" : ""}`}>
                {edit
                ? <Input
                    id={id}
                    value={value}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    autoFocus={true}
                    name="title"
                    className={`${color === "" ? "text-white" : "text-black"}`}
                    inputStyle={inputStyle}
                    plhdercolor={`${color === "" ? "var(--white-text)": "var(--black-text)"}`}
                    focusborder="false"
                    onBlur={() => { 
                        closeEdit()
                    }}
                />
                : 
                <label onClick={(e) => handleCheck(e, id)} className="pointer-cursor" htmlFor={id}>{value}</label>
                }
            
            </div>
        </div>

        {mode !== "view" && <div className="option pointer-cursor">
            {!edit && <span onClick={openEdit}><Img.edit/></span>}
            <span name={id} onClick={handleDel}><Img.deleteIcon/></span>
        </div>}
    </SubTaskContainer>
    )
}

export default SubTask

const SubTaskContainer = styled.div `
    display: flex;
    justify-content: space-between;
    .title-wrapper {
        display: flex;
        align-items: center;

        span {
            line-height: 1;

            svg {
                width: 16px;
                cursor: url(${myCursor}), auto;
            }
        }

        .title {
            margin-left: .6rem;
            font-size: 1.3rem;

            label {
                font-size: 1.45rem;
            }
        }
    }

    .option {
        display: flex;
        svg {
            cursor: url(${myCursor}), auto;
            width: 15px;
            margin-left: 10px;
        }
    }
`
