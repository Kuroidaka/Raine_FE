import { useContext, useEffect, useState } from 'react';
import { nanoid } from 'nanoid'

import '../style/index.scss'
import DocsUploaded from "./Docs";
import Input from './Input';
// import conversationApi from '../../../api/v1/conversation';
// import ConversationContext from '../../../context/Conversation.context';
// import FileContext from '../../../context/File.context';
// import fileApi from '../../../api/v1/file';
import { filesToBase64, hostImages } from "../../../Util" 
import ConversationContext from '../../../Context/conversation.context';

const InputBox = (p) => {
    const { handleProcessAI, conversationId } = p
    const { selectedConID, addMsg } = useContext(ConversationContext);
    const [filesImages, setFilesImages] = useState([])


    const imageFile = {
        setFileImg: (e) => {
            const uploadedFiles = e.target.files;
            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];
                setFilesImages(prevFiles => [...prevFiles, file]);
            }
        },
        handleProcess: async () => {
            // const formData = new FormData();
            // for (let i = 0; i < filesImages.length; i++) {
            //     const file = filesImages[i];
            //     formData.append("files", file);
            // }
        // // Log the formData entries for debugging
        //     for (let entry of formData.entries()) {
        //         console.log(entry);
        //     }
            // const { imgList } = await imageFile.sendToBE(formData)
            setFilesImages([])
            const listBase64 = await filesToBase64(filesImages)
            
            const imgList = await hostImages(listBase64)

            return imgList
        },
        sendToBE: async (formData) => {
            // return fileApi.uploadFileImg(formData)
            // .then((data) => {
            //     console.log("img list: ",data.data);
            //     setFilesImages([])
            //     return {
            //         imgList: data.data.data
            //     }
            // })
            // .catch((error) => {
            //     console.error(error);
            //     throw error
            // });
        }
    }
    const handleSend = async (inputValue) => {
        const dataBody = {
            prompt: inputValue
        }

        console.log("selectedConID", selectedConID)
        if(selectedConID && selectedConID !== -1 || conversationId) {
            dataBody.conversationID = selectedConID || conversationId
        }
        let isStream = true
        let isVision = false
        if (typeof handleProcessAI === "function") {
            isVision = true
            addMsg(dataBody, isStream, isVision)
            await handleProcessAI(inputValue);
        }
        else {
            await addMsg(dataBody, isStream)
        }
    };

    const inputProp = { 
        filesImages,
        uploadFileImg: imageFile.setFileImg,
        setFilesImages,
        handleSend
    }

    return (
        <div className='Input'>            
            <Input {...inputProp}/>
        </div>
    );
}
export default InputBox;