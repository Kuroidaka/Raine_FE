import { useContext, useState } from 'react';

import '../style/index.scss'
import DocsUploaded from "./Docs";
import Input from './Input';
import { filesToBase64, hostImages } from "../../../util" 
import ConversationContext from '../../../context/Conversation.context';
import { toast } from 'react-toastify';
import fileApi from '../../../api/file.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import conversationApi from '../../../api/conversation.api';
import { useNavigate, useParams } from 'react-router';
import ClipboardFileReader from './clipboard';

const InputBox = (p) => {
    const { handleProcessAI } = p
    const { selectedConID, addMsg } = useContext(ConversationContext);
    const [filesImages, setFilesImages] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const { id: conversationId } = useParams();

    const navigate = useNavigate()

    const queryClient = useQueryClient();

    const { data:filesData, isLoading } = useQuery({
        queryKey:['conversations', conversationId], 
        queryFn: () => conversationId && conversationApi.getConversationFile(conversationId),
        cacheTime: 0,
    });

    const uploadFileMutation = useMutation({
        mutationFn: async ({data}) => {
            const res = await fileApi.uploadFileForChat(data)
            return res
        },
        onMutate: () => setIsUploading(true),
        onSuccess: (data) => {

            queryClient.invalidateQueries(['conversations', data.conversationID])
            navigate(`/chat/${data.conversationID}`)
        },
        onError: (error) => {
            console.log("error", error)
            toast.error(`Something went wrong`)
        },
        onSettled: () => setIsUploading(false),
    });

    const deleteFileMutation = useMutation({
        mutationFn: async ({id}) => await fileApi.deleteFileForChat(id),
        onSuccess: () => queryClient.invalidateQueries(['conversations', conversationId]),        
        onError: (error) => {
            console.log("error", error)
            toast.error(`Something went wrong`)
        },
    });



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

    const handleUploadFileDocs = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        if(conversationId) formData.append('conversationId', conversationId);
        uploadFileMutation.mutate({data: formData})
    }


    const inputProp = { 
        filesImages,
        uploadFileImg: imageFile.setFileImg,
        setFilesImages,
        handleSend
    }

    const docsProp = { 
        filesData,
        handleUploadFileDocs, deleteFileMutation,
        isLoading,
        isUploading, setIsUploading

     }

    return (
        <div className='Input'>
            <ClipboardFileReader handleUploadFile={handleUploadFileDocs}/>
            <DocsUploaded {...docsProp}/>
            <Input {...inputProp}/>
        </div>
    );
}
export default InputBox;