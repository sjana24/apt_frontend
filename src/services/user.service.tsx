import axiosInstance from '../middleware/axiosInstance';

const userService = {
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('auth/me');
            return response.data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            throw error;
        }
    },

    changePassword: async (oldPassword, newPassword) => {
        try {
            const response = await axiosInstance.post('auth/change-password', {
                old_password: oldPassword,
                new_password: newPassword
            });
            return response.data;
        } catch (error) {
            console.error("Error changing password:", error);
            throw error;
        }
    }
};

export default userService;
