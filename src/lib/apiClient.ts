// src/lib/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor buat auto-attach token + fix Content-Type untuk FormData
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // Biarkan browser set multipart/form-data + boundary otomatis
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
});

// Interceptor buat handle 401 (token expired) global
apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            // redirect ke login, clear token, dll
        }
        return Promise.reject(error);
    }
);