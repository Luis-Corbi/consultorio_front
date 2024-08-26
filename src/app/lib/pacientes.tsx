import api from './api';
import { User, Speciality, EditableUser } from '../types/types';

// Función para obtener todos los usuarios
export const fetchUsers = async (): Promise<User[]> => {
  const res = await api.get('/users/');
  if (res.status !== 200) {
    throw new Error('Failed to fetch users');
  }
  return res.data;
};

// Función para obtener un usuario específico
export const fetchUser = async (id: string): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  if (res.status !== 200) {
    console.log
    throw new Error('Failed to fetch user');
  }
  return res.data;
};

// Función para obtener todos los usuarios con un rol específico
export const fetchUsersByRole = async (roleId: number): Promise<User[]> => {
  const res = await api.get('/users/');
  if (res.status !== 200) {
    throw new Error('Failed to fetch users');
  }
  const users: User[] = res.data;
  return users.filter(user => user.roles.some(role => role.id === roleId));
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
