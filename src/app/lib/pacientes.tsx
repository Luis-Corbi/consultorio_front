import { User, Speciality, EditableUser } from '../types/types';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://consultorio-back.onrender.com/api'
  : 'http://127.0.0.1:8000/api';

// Función para obtener todos los usuarios
export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_BASE_URL}/users/`);
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  return res.json();
};

// Función para obtener un usuario específico
export const fetchUser = async (id: string): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/users/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  return res.json();
};

// Función para obtener todos los usuarios con un rol específico
export const fetchUsersByRole = async (roleId: number): Promise<User[]> => {
  const res = await fetch(`${API_BASE_URL}/users/`);
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  const users: User[] = await res.json();
  return users.filter(user => user.roles.some(role => role.id === roleId));
};

// Función para crear un nuevo usuario
export const createUser = async (user: Omit<User, 'id' | 'roles'> & { roles: number[] }): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Server Error:', errorData);
    throw new Error(`Failed to create user: ${JSON.stringify(errorData)}`);
  }
};

// Función para obtener todas las especialidades
export const getSpecialities = async (): Promise<Speciality[]> => {
  const res = await fetch(`${API_BASE_URL}/specialities/`);
  if (!res.ok) {
    throw new Error('Failed to fetch specialities');
  }
  return res.json();
};


export const updateUser = async (userId: string, userData: EditableUser) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ajusta la forma de obtener el token si es necesario
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to update user: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
