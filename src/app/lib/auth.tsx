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

// // Otros métodos para manejar usuarios, citas, etc.
// export const getUsers = async () => {
//   const response = await api.get('users/');
//   return response.data;
// };

// export const getUser = async (token: string): Promise<number> => {
//   try {
//     const decodedToken = decodeJwt(token);
//     if (decodedToken.user_id) {
//       return decodedToken.user_id;
//     }
//   } catch (error) {
//     console.error('Error decoding token:', error);
//   }

//   const response = await api.get(`/users`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data.id;
// };

// const decodeJwt = (token: string) => {
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
//     `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`
//   ).join(''));
  
//   return JSON.parse(jsonPayload);
// };
