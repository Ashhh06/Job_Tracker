import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

//create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type' : 'application/json',
    },
});

//add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; 
    },
    (error) => {
        return Promise.reject(error);
    }
);

//handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            //unauthorized = remove token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


//auth API calls
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),
};


//applications api calls
export const applicationsAPI = {
    getAll: (params) => api.get('/applications', { params }),
    getOne: (id) => api.get(`/applications/${id}`),
    create: (data) => api.post('/applications', data),
    update: (id, data) => api.put(`/applications/${id}`, data),
    delete: (id) => api.delete(`/applications/${id}`),
    getStats: () => api.get('/applications/stats')
}
 
export default api;