import { useContext, useEffect, useState } from 'react';
import { nanoid } from 'nanoid'

import '../style/index.scss'
import DocsUploaded from "./Docs";
import Input from './Input';
// import conversationApi from '../../../api/v1/conversation';
// import ConversationContext from '../../../context/Conversation.context';
// import FileContext from '../../../context/File.context';
// import fileApi from '../../../api/v1/file';
import { filesToBase64, hostImages, filesToBlobURLs } from "../../../Util" 
import ConversationContext from '../../../Context/conversation.context';

const InputBox = () => {

    const { selectedConID, addMsg } = useContext(ConversationContext);
    // const { filesDocs, setFilesDocs, delFile, isLoadingFile, uploadFile } = useContext(FileContext);
    const [loadingFileList, setLoadingFileList] = useState([]);
    // file image for upload at the input box
    const [filesImages, setFilesImages] = useState(
    [
        // { id: 1, type: 'image', name: 'phong_canh.png' },
        // { id: 3, type: 'file', name: 'chinh_sach_moi.pdf' }
    ]
    )


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

    // const handleUploadFileImg = async (event) => {
        
    //     const uploadedFiles = event.target.files;
    //     const formData = new FormData();
    //     for (let i = 0; i < uploadedFiles.length; i++) {
    //         const file = uploadedFiles[i];
    //         const newFile = { id: Date.now() + i, type: 'file', name: file.name };   
    //         formData.append("images", file);
    //         setFilesImages(prevFiles => [...prevFiles, newFile]);
    //     }
    //     const result = await uploadFileImg(formData)

    //     return result

    // };

    const handleUploadFileDocs = (event) => {
        const uploadedFiles = event.target.files;
        const formData = new FormData();
        const newListFile = []
        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            const newFile = { id: Date.now() + i,size: file.size, name: file.name };   

            formData.append("files", file);
            newListFile.push(newFile)
            // setFilesDocs(prevFiles => [...prevFiles, newFile])
            setLoadingFileList(prevFiles => [...prevFiles, newFile.name])
        }

        // uploadFile(formData)
    };

    // useEffect(() => {
    //     if(!isLoadingFile) {
    //         setLoadingFileList([])
    //     }
    // }, [isLoadingFile]);

    const handleSend = async (inputValue) => {
        const dataBody = {
            prompt: inputValue
        }

        if(selectedConID && selectedConID !== -1) {
            dataBody.conversationID = selectedConID
        }

        await addMsg(dataBody, true)

    };

    // const docsProp = { filesDocs, handleUploadFileDocs, setFilesDocs, delFile, isLoadingFile, loadingFileList }
    const inputProp = { 
        filesImages,
        uploadFileImg: imageFile.setFileImg,
        setFilesImages,
        handleSend
    }

    return (
        <div className='Input'>            
            {/* <DocsUploaded {...docsProp}/> */}
            <Input {...inputProp}/>
        </div>
    );
}
export default InputBox;