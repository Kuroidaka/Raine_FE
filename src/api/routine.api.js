import axiosClient from "./axiosClient";

const routineApi = {
    createRoutine: async ({
      title, color, note, area
    }) => {
      const url = `/routine/create`;

      const data = { title, color, note }
      return axiosClient.post(url, {
        data, area
      });
    },
  
    getRoutines: async () => {
      const url = `/routine/get`;
      return axiosClient.get(url);
    },
  
    // getTaskById: async (id) => {
    //   const url = `/routine/get/${id}`;
    //   return axiosClient.get(url);
    // },
  
    updateRoutine: async (id, params = {}) => {
      const url = `/routine/update/${id}`;
      const { title, color, note, area = [], isActive, routineDate } = params;
    
      const data = { title, color, note, isActive };
    
      // Filter out undefined values from data
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );
    
      return axiosClient.patch(url, {
        data: filteredData,
        area: [...area],
        dates: routineDate
      });
    },

    check: async (id) => {
      const url = `/routine/check/${id}`;
      return axiosClient.patch(url);
    },
  
    deleteRoutine: async (id) => {
      const url = `/routine/delete/${id}`;
      return axiosClient.delete(url);
    },
  
    addSubTask: async (id, subTaskData) => {
      const url = `/routine/update/${id}/sub`;
      return axiosClient.post(url, subTaskData);
    },
  
    updateSubTask: async (subId, subTaskData) => {
      const url = `/routine/update/sub/${subId}`;
      return axiosClient.patch(url, subTaskData);
    },
  
    deleteSubTask: async (subId) => {
      const url = `/routine/delete/sub/${subId}`;
      return axiosClient.delete(url);
    },
  };
  
export default routineApi;