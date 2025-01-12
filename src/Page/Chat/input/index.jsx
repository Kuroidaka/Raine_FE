import { useContext, useState } from "react";
import "../style/index.scss";
import DocsUploaded from "./Docs";
import Input from "./Input";
import { filesToBase64, hostImages } from "../../../util";
import ConversationContext from "../../../context/conversation.context";
import { toast } from "react-toastify";
import fileApi from "../../../api/file.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import conversationApi from "../../../api/conversation.api";
import { useNavigate, useParams } from "react-router";
import ClipboardFileReader from "./clipboard";
import styled from "styled-components";

const InputBox = (p) => {
  const { handleProcessAI } = p;
  const { selectedConID, addMsg } = useContext(ConversationContext);
  const [filesImages, setFilesImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Store the file for processing
  const { id: conversationId } = useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: filesData, isLoading } = useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () =>
      conversationId && conversationApi.getConversationFile(conversationId),
    cacheTime: 0,
  });

  const uploadFileMutation = useMutation({
    mutationFn: async ({ data, chunkingService }) => {
      const res = await fileApi.uploadFileForChat(data, chunkingService);
      return res;
    },
    onMutate: () => setIsUploading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["conversations", data.conversationID]);
      navigate(`/chat/${data.conversationID}`);
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(`Something went wrong`);
    },
    onSettled: () => setIsUploading(false),
  });

  const deleteFileMutation = useMutation({
    mutationFn: async ({ id }) => await fileApi.deleteFileForChat(id),
    onSuccess: () =>
      queryClient.invalidateQueries(["conversations", conversationId]),
    onError: (error) => {
      console.log("error", error);
      toast.error(`Something went wrong`);
    },
  });

  const imageFile = {
    setFileImg: (e) => {
      const uploadedFiles = e.target.files;
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        setFilesImages((prevFiles) => [...prevFiles, file]);
      }
    },
    handleProcess: async () => {
      setFilesImages([]);
      const listBase64 = await filesToBase64(filesImages);
      const imgList = await hostImages(listBase64);
      return imgList;
    },
  };

  const handleSend = async (inputValue) => {
    const dataBody = { prompt: inputValue };

    if ((selectedConID && selectedConID !== -1) || conversationId) {
      dataBody.conversationID = selectedConID || conversationId;
    }
    const isStream = true;
    if (typeof handleProcessAI === "function") {
      await handleProcessAI(inputValue);
    } else {
      await addMsg(dataBody, isStream);
    }
  };

  const handleFileUpload = (file) => {
    setSelectedFile(file);
    setShowPopup(true); // Show the popup for chunking choice
  };

  const handleChunkingChoice = (chunkingService) => {
    setShowPopup(false);
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (conversationId) formData.append("conversationId", conversationId);
      uploadFileMutation.mutate({ data: formData, chunkingService });
    }
  };

  const docsProp = {
    filesData,
    handleUploadFileDocs: handleFileUpload,
    deleteFileMutation,
    isLoading,
    isUploading,
    setIsUploading,
  };

  const inputProp = {
    filesImages,
    uploadFileImg: imageFile.setFileImg,
    setFilesImages,
    handleSend,
  };

  return (
    <div className="Input">
      <ClipboardFileReader handleUploadFile={handleFileUpload} />
      <DocsUploaded {...docsProp} />
      <Input {...inputProp} />

      {showPopup && (
        <PopupOverlay>
          <PopupContent>
            <h3>Choose Chunking Method</h3>
            <Button
              onClick={() => handleChunkingChoice("agentic")}
              color="#007bff"
              hoverColor="#0056b3"
            >
              Chunk 1
            </Button>
            <Button
              onClick={() => handleChunkingChoice("semantic")}
              color="#28a745"
              hoverColor="#218838"
            >
              Chunk 2
            </Button>
            <CloseButton onClick={() => setShowPopup(false)}>
              Cancel
            </CloseButton>
          </PopupContent>
        </PopupOverlay>
      )}
    </div>
  );
};

export default InputBox;

// Popup Container
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

// Popup Content
const PopupContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 300px;
  max-width: 90%;
`;

// Popup Buttons
const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${({ color }) => color || "#007bff"};
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || "#0056b3"};
  }
`;

// Close Button (Optional styling if needed)
const CloseButton = styled(Button)`
  background-color: #6c757d;
  &:hover {
    background-color: #5a6268;
  }
`;
