"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserPageContainer from './UserProfile';
import { User } from '../types/types';
import api from '../lib/api';
import Cookies from 'js-cookie';
import Loading from '@/loading';
import { useUser } from '../context/UserContext';

const UserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser: setContextUser } = useUser();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          console.log('No se encontró token en las cookies');
          router.push('/');
          return;
        }


        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
          throw new Error('No se encontraron datos de usuario en localStorage');
        }

        const userData = JSON.parse(storedUserData);


        const response = await api.get(`/users/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status !== 200) {
          throw new Error('Error al obtener datos actualizados del usuario');
        }

        setUser(response.data);
        localStorage.setItem('userData', JSON.stringify(response.data));
      } catch (err) {
        console.error('Error al obtener usuario actual:', err);
        setError('Error al cargar los datos del usuario. Por favor, inicie sesión nuevamente.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>No se pudo cargar la información del usuario. Por favor, inicie sesión.</div>;
  }

  return <UserPageContainer user={user} token={Cookies.get('access_token') || ''} />;
  

};
export default UserPage;