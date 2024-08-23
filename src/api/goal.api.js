import axiosClient from "./axiosClient";

const goalApi = {
    createGoal: async ({
      title, color, note, area
    }) => {
      const url = `/goal/create`;

      const data = { title, color, note }
      return axiosClient.post(url, {
        data, area
      });
    },
  
    getGoals: async () => {
      const url = `/goal/get`;
      return axiosClient.get(url);
    },
  
    // getTaskById: async (id) => {
    //   const url = `/Goal/get/${id}`;
    //   return axiosClient.get(url);
    // },
  
    updateGoal: async (id, params = {}) => {
      const url = `/goal/update/${id}`;
      const { title, color, note, area = [], isActive, routineDate } = params;
    
      const data = { title, color, note };
    
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
  };
  
export default goalApi;