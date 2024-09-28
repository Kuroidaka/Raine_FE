import axiosClient from "./axiosClient";

const conversationApi = {

    createChat: async ({prompt, conversationID, uploadUrl}, isStream=false) => {
        const url = `/brain/chat`;

        // Define query parameters
        const params = {
            isStream: isStream,
        };

        // Define data body
        const dataBody = {
            prompt: prompt,
        };
        if(conversationID) {
            dataBody.conversationID = conversationID;
        }
        if (uploadUrl) {
            dataBody.imgURL = uploadUrl;
        }

        console.log("dataBody",dataBody )
        // Send POST request with query parameters and data body
        return axiosClient.post(url, dataBody, { params });
    },
    createChatVideo: async ({ prompt, conversationID, file, fileVideo }, isStream = false) => {
        const url = `/brain/chat/video`;
    
        // Define query parameters
        const params = {
            isStream: isStream,
        };
    
        // Create a FormData object
        const formData = new FormData();
        formData.append('prompt', prompt);
    
        if (conversationID) {
            formData.append('conversationID', conversationID);
        }
        if (file) {
            formData.append('file', file);  // Assuming 'file' is a File object
        }
        if (fileVideo) {
            formData.append('fileVideo', fileVideo);  // Assuming 'file' is a File object
        }
    
        console.log("FormData", formData);
    
        // Send POST request with query parameters and form-data body
        return axiosClient.post(url, formData, {
            params,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getConversationHistory: async(id) => {
        const url = id
            ? `/conversation/get/${id}`
            : `/conversation/get`;

        // Send POST request with query parameters and data body
        return axiosClient.get(url);
    },
    deleteConversation: async(id) => {
        const url = `/conversation/delete/${id}`;

        // Send POST request with query parameters and data body
        return axiosClient.delete(url);
    },
    stt: async (formData) => {
        const url = `/brain/stt/`;

        return axiosClient.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        });
    },
    tts: async (text) => {
        const url = `/brain/tts`;

        return axiosClient.post(url, { text });

        // return URL.createObjectURL(response);
    },
    getConversationFile: async (id) => {
        const url = `/conversation/file/${id}`;

        return axiosClient.get(url);
    }
}

export default conversationApi