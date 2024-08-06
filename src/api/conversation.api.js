import axiosClient from "./axiosClient";

const conversationApi = {

    createChat: async ({prompt, conversationID, uploadUrl}, isStream=false, isVision=false) => {
        const url = `/brain/chat`;

        // Define query parameters
        const params = {
            isStream: isStream,
            isLTMemo: true,
            isVision: isVision,
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
    }
}

export default conversationApi