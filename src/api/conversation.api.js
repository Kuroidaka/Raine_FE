import axiosClient from "./axiosClient";

const conversationApi = {

    createChat: async ({inputValue, conversationId, uploadUrl}, isStream, isVision) => {
        const url = `/brain/chat`;

        // Define query parameters
        const params = {
            isStream: isStream,
            isLTMemo: true,
            isVision: isVision,
        };

        // Define data body
        const dataBody = {
            prompt: inputValue,
            conversationID: conversationId,
        };

        if (uploadUrl) {
            dataBody.imgURL = uploadUrl;
        }
        // Send POST request with query parameters and data body
        return axiosClient.post(url, dataBody, { params });
    },
    getConversationHistory: async() => {
        const url = `/conversation/get`;

        // Send POST request with query parameters and data body
        return axiosClient.get(url);
    }
}

export default conversationApi