import axiosInstance from '../../middleware/axiosInstance';

const staffService = {
    // 1. GET ALL STAFF MEMBERS
    // Maps to backend: def get(self, request)
    getAllStaff: async () => {
        try {
            const response = await axiosInstance.get('staff/');
            return response.data;
        } catch (error) {
            console.error("Error fetching staff list:", error.response?.data || error.message);
            throw error;
        }
    },

    // 2. GET SINGLE STAFF MEMBER BY ID
    // Maps to backend: def get(self, request, pk)
    getStaffById: async (id) => {
        try {
            const response = await axiosInstance.get(`staff/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching staff member ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 3. ADD NEW STAFF MEMBER (POST)
    // Maps to backend: def post(self, request)
    // staffData: { first_name, last_name, email, department, designation }
    createStaff: async (staffData) => {
        try {
            const response = await axiosInstance.post('staff/', staffData);
            return response.data;
        } catch (error) {
            console.error("Error creating staff record:", error.response?.data || error.message);
            throw error;
        }
    },

    // 4. UPDATE STAFF DETAILS (PUT)
    // Maps to backend: def put(self, request, pk)
    updateStaff: async (id, updatedData) => {
        try {
            const response = await axiosInstance.put(`staff/${id}/`, updatedData);
            return response.data;
        } catch (error) {
            console.error(`Error updating staff member ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 5. REMOVE STAFF MEMBER (DELETE)
    // Maps to backend: def delete(self, request, pk)
    deleteStaff: async (id) => {
        try {
            const response = await axiosInstance.delete(`staff/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting staff member ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }
};

export default staffService;