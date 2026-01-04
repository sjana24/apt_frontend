import axiosInstance from '../../middleware/axiosInstance';

const degreeService = {
    getAllDegrees: () => axiosInstance.get('degrees/').then(res => res.data),
    
    getDegreeById: (id) => axiosInstance.get(`degrees/${id}/`).then(res => res.data),
    
    createDegree: (data) => axiosInstance.post('degrees/', data).then(res => res.data),
    
    updateDegree: (id, data) => axiosInstance.put(`degrees/${id}/`, data).then(res => res.data),
    
    deleteDegree: (id) => axiosInstance.delete(`degrees/${id}/`).then(res => res.data)
};

export default degreeService;