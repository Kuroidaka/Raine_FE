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
            conversationID: conversationID,
        };

        if (uploadUrl) {
            dataBody.imgURL = uploadUrl;
        }

        console.log("dataBody",dataBody )
        // Send POST request with query parameters and data body
        return axiosClient.post(url, dataBody, { params });
    },
    getConversationHistory: async() => {
        const url = `/conversation/get`;

        // Send POST request with query parameters and data body
        return axiosClient.get(url);
    },
    deleteConversation: async(id) => {
        const url = `/conversation/delete/${id}`;

        // Send POST request with query parameters and data body
        return axiosClient.delete(url);
    }
}

export default conversationApi