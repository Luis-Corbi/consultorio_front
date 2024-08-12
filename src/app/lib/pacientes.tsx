import { User , Speciality} from '../types/types';

// Función para obtener todos los usuarios
export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('http://127.0.0.1:8000/api/users/');
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  return res.json();
};

// Función para obtener un usuario específico
export const fetchUser = async (id: string): Promise<User> => {
  const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  return res.json();
};
// Función para obtener todos los usuarios con un rol específico
export const fetchUsersByRole = async (roleId: number): Promise<User[]> => {
  const res = await fetch('http://127.0.0.1:8000/api/users/');
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  const users: User[] = await res.json();
  return users.filter(user => user.roles.some(role => role.id === roleId));
};
export const createUser = async (user: Omit<User, 'id' | 'roles'> & { roles: number[] }): Promise<void> => {
  const res = await fetch('http://127.0.0.1:8000/api/users/', {
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
export const getSpecialities = async (): Promise<Speciality[]> => {
  const res = await fetch('http://127.0.0.1:8000/api/specialities/');
  if (!res.ok) {
    throw new Error('Failed to fetch specialities');
  }
  const specialities: Speciality[] = await res.json();
  return specialities;
};