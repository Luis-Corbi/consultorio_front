import axios from 'axios';
import Cookies from 'js-cookie';

// Configuración básica de Axios
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://consultorio-back.onrender.com/api'
    : 'http://127.0.0.1:8000/api',
});

// Interceptor para incluir el token en cada solicitud
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar el refresco de tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${api.defaults.baseURL}/login/refresh/`, {
            refresh: refreshToken,
          });
          Cookies.set('access_token', response.data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
