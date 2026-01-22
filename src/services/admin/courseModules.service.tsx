import axiosInstance from '../../middleware/axiosInstance';

const moduleService = {
    // 1. GET ALL MODULES
    getAllModules: async () => {
        try {
            const response = await axiosInstance.get('main/course');
            return response.data;
        } catch (error) {
            console.error("Error fetching modules:", error.response?.data || error.message);
            throw error;
        }
    },

    // 2. GET SINGLE MODULE BY ID
    getModuleById: async (id) => {
        try {
            const response = await axiosInstance.get(`main/course/${id}`);
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
            const response = await axiosInstance.post('main/course', moduleData);
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
            const response = await axiosInstance.put(`main/course/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error(`Error updating module ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 5. DELETE MODULE
    deleteModule: async (id) => {
        try {
            const response = await axiosInstance.delete(`main/course/${id}`);
            return response.data; // Usually 204 No Content
        } catch (error) {
            console.error(`Error deleting module ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

     getAllModulesForSingleStaff: async (id:number,data) => {
        try {
            // main/course/staff/1?degree_id=2
            const response = await axiosInstance.get(`main/course/staff/${id}`,{
                params: {
                    degree_id: data,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching modules:", error.response?.data || error.message);
            throw error;
        }
    },
    fetchFilteredData: async (searchTerm) => {
        try {
            // This sends a request like: /api/items/?search=yourtext
            // const response1 = await axios.get('/api/items/', {
            //     params: { search: searchTerm }
            // });
            const response = await axiosInstance.get(`main/degreeSearch`,{params: { search: searchTerm }});
            console.log("dfdsfdf",response.data)
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }
};

export default moduleService;