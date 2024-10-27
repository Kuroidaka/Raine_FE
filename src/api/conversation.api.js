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
    getMessagesByConversationId: async (conversationId, page = 1, pageSize = 40) => {
        const url = `/conversation/messages/${conversationId}`;
        return axiosClient.get(url, { params: { page, pageSize } });
    },
    createChatVideo: async ({ prompt, conversationID, file, fileVideo }, isStream = false, isScreen = false) => {
        const url = `/brain/chat/video`;
    
        // Define query parameters
        const params = {
            isStream: isStream,
            isScreen: isScreen
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
    getConversationHistory: async(id, page = 1) => {

        if(id) {
            const url = `/conversation/get/${id}`
            return axiosClient.get(url);
        } else {
            const url = `/conversation/get`

            const params = {
                page: page
            }
            return axiosClient.get(url, { params });
        }
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