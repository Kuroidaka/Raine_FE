import axiosClient from "./axiosClient";

const routineApi = {
    createRoutine: async ({
      title, color, note, area, routineTime
    }) => {
      const url = `/routine/create`;

      const data = { title, color, note, routineTime }
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
      const { title, color, note, area = [], isActive, routineDate, routineTime } = params;
    
      const data = { title, color, note, isActive, routineTime };
    
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

    deleteRoutine: async (id) => {
      const url = `/routine/delete/${id}`;
      return axiosClient.delete(url);
    },
  };
  
export default routineApi;