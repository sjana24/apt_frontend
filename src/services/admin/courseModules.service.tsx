import axiosInstance from '../../middleware/axiosInstance';

const moduleService = {
    // 1. GET ALL MODULES
    getAllModules: async () => {
        try {
            const response = await axiosInstance.get('modules/');
            return response.data;
        } catch (error) {
            console.error("Error fetching modules:", error.response?.data || error.message);
            throw error;
        }
    },

    // 2. GET SINGLE MODULE BY ID
    getModuleById: async (id) => {
        try {
            const response = await axiosInstance.get(`modules/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching module ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 3. CREATE NEW MODULE (POST)
    createModule: async (moduleData) => {
        try {
            // moduleData should be { module_name, module_code, credit }
            const response = await axiosInstance.post('modules/', moduleData);
            return response.data;
        } catch (error) {
            console.error("Error creating module:", error.response?.data || error.message);
            throw error;
        }
    },

    // 4. UPDATE MODULE (PUT)
    updateModule: async (id, updatedData) => {
        try {
            // We use the ID in the URL and pass the new data in the body
            const response = await axiosInstance.put(`modules/${id}/`, updatedData);
            return response.data;
        } catch (error) {
            console.error(`Error updating module ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 5. DELETE MODULE
    deleteModule: async (id) => {
        try {
            const response = await axiosInstance.delete(`modules/${id}/`);
            return response.data; // Usually 204 No Content
        } catch (error) {
            console.error(`Error deleting module ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }
};

export default moduleService;