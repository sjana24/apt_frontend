import axiosInstance from '../../middleware/axiosInstance';

const labService = {
    // 1. GET ALL LABS
    // Maps to backend: def get(self, request)
    getAllLabs: async () => {
        try {
            const response = await axiosInstance.get('main/labs');
            return response.data;
        } catch (error) {
            console.error("Error fetching labs:", error.response?.data || error.message);
            throw error;
        }
    },

    // 2. GET SINGLE LAB BY ID
    // Maps to backend: def get(self, request, pk)
    getLabById: async (id) => {
        try {
            const response = await axiosInstance.get(`main/labs/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching lab ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 3. CREATE NEW LAB (POST)
    // Maps to backend: def post(self, request)
    createLab: async (labData) => {
        try {
            // labData example: { lab_name: "Computer Lab 01", capacity: 50 }
            const response = await axiosInstance.post('main/labs', labData);
            return response.data;
        } catch (error) {
            console.error("Error creating lab:", error.response?.data || error.message);
            throw error;
        }
    },

    // 4. UPDATE LAB (PUT)
    // Maps to backend: def put(self, request, pk)
    updateLab: async (id, updatedData) => {
        try {
            const response = await axiosInstance.put(`main/labs/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error(`Error updating lab ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 5. DELETE LAB
    // Maps to backend: def delete(self, request, pk)
    deleteLab: async (id) => {
        try {
            const response = await axiosInstance.delete(`main/labs/${id}`);
            return response.data; 
        } catch (error) {
            console.error(`Error deleting lab ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }
};

export default labService;