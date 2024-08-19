import axiosClient from "./axiosClient";

const authenApi = {

    login: async (username, password) => {
        const url = `/auth/login`;

        // Define data body
        const dataBody = {
            username, password
        };

        // Send POST request with query parameters and data body
        return axiosClient.post(url, dataBody);
    },
    verifyToken: async () => {
        const url = `/auth/verify_token`;
        // Send POST request with query parameters and data body
        return axiosClient.post(url);
    },
}

export default authenApi