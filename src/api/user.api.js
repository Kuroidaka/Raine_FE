import axiosClient from "./axiosClient";

const userApi = {

    getUser: async (id) => {
        const url = `/user/${id}`;

        // Send POST request with query parameters and data body
        return axiosClient.get(url);
    },
    setBackgroundImg: async (bgId) => {
        const url = `/user/set-background-img`;

        // Send POST request with query parameters and data body
        return axiosClient.post(url, { bgId });
    },
    getTools: async () => {
        const url = `/user/tools`;

        // Send POST request with query parameters and data body
        return axiosClient.get(url);
    },
    toggleTool: async (toolID) => {
        const url = `/user/tools/${toolID}`;

        // Send POST request with query parameters and data body
        return axiosClient.patch(url);
    },
}

export default userApi