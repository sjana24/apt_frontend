import axiosInstance from '../../middleware/axiosInstance';

const studentService = {

      getDegreeTimeTable: async (data) => {
        try {
            const response = await axiosInstance.get('common/timeTable');
            return response.data;
        } catch (error) {
            console.error("Error fetching degrees:", error.response?.data || error.message);
            throw error; // Rethrow so the component can handle the error message
        }
    },

}
export default studentService;
