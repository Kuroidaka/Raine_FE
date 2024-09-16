import axiosClient from "./axiosClient";

const fileApi = {

    getBGImages: async () => {
        const url = `/file/background/image`;

        // Send POST request with query parameters and data body
        return axiosClient.get(url);
    },
    uploadBGImages: async (file) => {
        const url = `/file/background/image`;

        // Create a FormData object
        const formData = new FormData();
        formData.append('file', file);  // Assuming 'file' is a File object
    
        // Send POST request with query parameters and form-data body
        return axiosClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    uploadFileForChat: async (formData) => {
        const url = `/file/ask/upload`;
        return axiosClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteFileForChat: async (id) => {
        const url = `/file/ask/delete/${id}`;
        return axiosClient.delete(url);
    }
}

export default fileApi