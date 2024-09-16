import { useState } from "react";
import { motion } from "framer-motion";
import {
    Upload, File2_2, Delete2, AttachFile
} from "../../../assets/Icons/index";
import Load from "../../../component/Load";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import conversationApi from "../../../api/conversation.api";
import { useParams } from "react-router";
import fileApi from "../../../api/file.api";
import { toast } from "react-toastify";

const DocsUploaded = (p) => {
    const { 
        filesData,
        uploadFileMutation, deleteFileMutation,
        isLoading, 
        isUploading
    } = p
    const { id: conversationId } = useParams();


    const [hoveredFile, setHoveredFile] = useState(null);
    const [selectFile, setSelectFile] = useState(null);

    const handleMouseEnter = (id) => {
        setHoveredFile(id);
    };

    const handleMouseLeave = () => {
        setHoveredFile(null);
    };


    const handleDeleteClick = (id) => {
        deleteFileMutation.mutate({id: id})
    };

    const handleUploadFileDocs = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        if(conversationId) formData.append('conversationId', conversationId);
        uploadFileMutation.mutate({data: formData})
    }

    const acceptFile = ['.pdf', '.docx', '.txt', '.md']

    return (
        <div className="File_uploaded">
        {isUploading || (filesData && filesData.length > 0) ? (
            <div className="Content">
            <div className="Content_head">
                <div className="p1">Files</div>
                <div className="add_button">
                <label htmlFor="fileInput">
                    <motion.div
                        whileHover={{ y: -5 }} // Khi hover, icon sẽ di chuyển lên 5px
                    >
                        <AttachFile />
                        <div>Add</div>
                    </motion.div>
                    
                </label>
                <input
                    type="file"
                    id="fileInput"
                    accept={acceptFile.join(',')}
                    style={{ display: 'none' }}
                    onChange={(e) => handleUploadFileDocs(e)}
                    multiple
                />
                </div>
            </div>
            <hr />
            <div className="file_uploaded_area">
                {filesData && filesData.map((file) => (
                <div
                    className="file_uploaded_container"
                    key={file.id}
                    onMouseEnter={() => handleMouseEnter(file.id)}
                    onMouseLeave={handleMouseLeave}
                >
                {
                    (isLoading) ? 
                    (
                        <span className="load_button">
                            <Load minsize="15px"/>
                        </span>
                    ) : (
                        hoveredFile === file.id ? (
                        <span
                            className="delete_button"
                            onClick={() => handleDeleteClick(file.id)}
                        >
                            <Delete2 />
                        </span>
                        ) : (
                            <span>
                                <File2_2 />
                            </span>
                        ) 
                    )
                }
                    <p className="uploaded_file_name">{file.originalname}</p>
                </div>
                ))}
                {/* loading */}
                {isUploading && (
                    <div className="loading_file">
                        <Load minsize="15px"/>
                    </div>
                )}
            </div>
            </div>
        ) : (
            <label id="Icon_Upload" htmlFor="fileInput">
                <div >
                    <Upload />
                </div>
                <input
                    type="file"
                    id="fileInput"
                    accept={acceptFile.join(',')}
                    style={{ display: 'none' }}
                    onChange={(e) => handleUploadFileDocs(e)}
                    multiple
                />
            </label>

        )}
        </div>
    )
}

export default DocsUploaded
