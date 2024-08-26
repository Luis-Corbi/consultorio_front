import api from './api';
import Cookies from 'js-cookie';

// Función para el login
export const login = async (email: string, password: string) => {
  const response = await api.post('login/', { username: email, password });
  Cookies.set('access_token', response.data.access);
  Cookies.set('refresh_token', response.data.refresh);
  return response.data;
};

// Función para el logout
export const logout = async () => {
  await api.post('logout/');
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

// Otros métodos para manejar usuarios, citas, etc.
export const getUsers = async () => {
  const response = await api.get('users/');
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`users/${id}/`);
  return response.data;
};
