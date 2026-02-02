import axiosInstance from '../../middleware/axiosInstance';

const timeTableService = {
    // 1. Get all degrees
    getByDegreeAndRange: async (degreeId, startDate, endDate) => {
        try {
            const response = await axiosInstance.get('main/timetable/by-degree', {
                params: {
                    degree_id: degreeId,
                    start_date: startDate,
                    end_date: endDate
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching degrees:", error.response?.data || error.message);
            throw error; // Rethrow so the component can handle the error message
        }
    },
    getByLabAndRange: async (degreeId, startDate, endDate) => {
        try {
            const data = {
                lab_id: degreeId,
                start_date: startDate,
                end_date: endDate
            }
            const response = await axiosInstance.post('main/timetable-slots/by-lab', data);

            return response.data;
        } catch (error) {
            console.error("Error fetching degrees:", error.response?.data || error.message);
            throw error; // Rethrow so the component can handle the error message
        }
    },

    // 2. Get a single degree by ID
    getDegreeById: async (id) => {
        try {
            const response = await axiosInstance.get(`degrees/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching degree ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    checkAvalibilityForSlot: async (date, timeRange) => {
        try {
            const response = await axiosInstance.get('main/labs/check-availability', {
                params: {
                    date: date,
                    time_range: timeRange,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching degrees:", error.response?.data || error.message);
            throw error; // Rethrow so the component can handle the error message
        }
    },

    // 3. Create a new degree
    createTimeSlot: async (data) => {
        try {
            const response = await axiosInstance.post('main/timetable-slots', data);
            return response.data;
        } catch (error) {
            console.error("Error creating degree:", error.response?.data || error.message);
            throw error;
        }
    },

    // 4. Update an existing degree
    // updateDegree: async (id, data) => {
    //     try {
    //         console.log("xxxxxxxxxxxxxxxxxx",data);
    //         const response = await axiosInstance.put(`main/degree/${id}`, data);
    //         return response.data;
    //     } catch (error) {
    //         console.error(`Error updating degree ${id}:`, error.response?.data || error.message);
    //         throw error;
    //     }
    // },

    // // 5. Delete a deleteTimetableSlot
    deleteTimetableSlot: async (id) => {
        try {
            const response = await axiosInstance.delete(`main/timetable-slots/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting degree ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    getDashboardStats: async () => {
        try {
            const response = await axiosInstance.get('main/timetable/dashboard-stats');
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard stats:", error.response?.data || error.message);
            throw error;
        }
    },

    getMySchedule: async () => {
        try {
            const response = await axiosInstance.get('main/timetable/my-schedule');
            return response.data;
        } catch (error) {
            console.error("Error fetching my schedule:", error.response?.data || error.message);
            throw error;
        }
    }
};

export default timeTableService;