import axiosInstance from '../../middleware/axiosInstance';

const assignmentService = {
    // 1. GET ALL ASSIGNMENTS
    getAllAssignments: async () => {
        try {
            const response = await axiosInstance.get('main/assignments');
            return response.data;
        } catch (error) {
            console.error("Error fetching assignments:", error.response?.data || error.message);
            throw error;
        }
    },

    // 2. CREATE ASSIGNMENT
    createAssignment: async (data: any) => {
        try {
            console.log("data", data);
            const response = await axiosInstance.post('main/assignments', data);
            return response.data;
        } catch (error) {
            console.error("Error creating assignment:", error.response?.data || error.message);
            throw error;
        }
    },

    // 3. UPDATE ASSIGNMENT
    updateAssignment: async (id: number, data: any) => {
        try {
            const response = await axiosInstance.put(`main/assignments/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating assignment ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 4. DELETE ASSIGNMENT
    deleteAssignment: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`main/assignments/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting assignment ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default assignmentService;
