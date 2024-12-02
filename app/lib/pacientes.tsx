import api from './api';
import { User, Speciality, EditableUser } from '../types/types';
import Cookies from 'js-cookie';
import axios from 'axios';


// Función para detectar si estás en el lado del servidor
const isServer = typeof window === 'undefined';

// Función para obtener el token
function getToken(useLocalStorage: boolean): string | null {
  if (isServer) {
    return process.env.API_TOKEN || null; // Usar variable de entorno en el servidor
  } else if (useLocalStorage) {
    return localStorage.getItem('token');
  }
  return null;
}

// Función para obtener un usuario por ID
export async function fetchUser(id: string, useLocalStorage: boolean = true, token: string): Promise<User | null> {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const response = await api.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Comparar directamente con el código de estado 200
    if (response.status !== 200) {
      throw new Error('Failed to fetch user');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Función para obtener todos los usuarios
export const fetchUsers = async () => {
  try {
    const response = await api.get('/users/');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Aquí sabemos que 'error' es de tipo 'AxiosError'
      console.error('Error fetching users:', error.response?.data || error.message);
    } else {
      // Si no es un AxiosError, manejarlo de otra manera
      console.error('Unexpected error:', error);
    }
    throw error; // Re-lanza el error después de manejarlo
  }
};
// Función para obtener todos los usuarios con un rol específico
export const fetchUsersByRole = async (roleId: number): Promise<User[]> => {
  const token = Cookies.get('access_token');
  if (!token) {
    console.error('No access token found in cookies.');
    throw new Error('No access token available');
  }

  try {
    const res = await api.get('/users/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200) {
      throw new Error('Failed to fetch users');
    }

    const users: User[] = res.data;
    return users.filter(user => user.roles.some(role => role.id === roleId));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


// Función para crear un nuevo usuario
export const createUser = async (user: Omit<User, 'id' | 'roles'> & { roles: number[] }): Promise<void> => {
  const res = await api.post('/users/', user);
  if (res.status !== 201) {
    const errorData = res.data;
    console.error('Server Error:', errorData);
    throw new Error(`Failed to create user: ${JSON.stringify(errorData)}`);
  }
};

// Función para obtener todas las especialidades
export const getSpecialities = async (): Promise<Speciality[]> => {
  const res = await api.get('/specialities/');
  if (res.status !== 200) {
    throw new Error('Failed to fetch specialities');
  }
  return res.data;
};

// Función para actualizar un usuario
export const updateUser = async (userId: string, userData: EditableUser) => {
  try {
    const response = await api.put(`/users/${userId}/`, userData);
    if (response.status !== 200) {
      const errorMessage = response.data;
      throw new Error(`Failed to update user: ${errorMessage}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};