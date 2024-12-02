"use client";
import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '../lib/api';
import Loading from '@/loading';

interface UserData {
  id: number;
  username: string;
  email: string;
  name: string;
  lastname: string;
  specialty?: string;
  birth_date: string;
  telephone: string;
  address: string;
  gender: string;
  DNI: string;
  health_insurance: string;
  health_insurance_number: string;
  notes: string;
  licence_number: string;
  color: string;
}

interface DecodedToken {
  user_id?: number;
  exp: number;
}

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const token = Cookies.get('access_token');
      if (token) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    };
    checkToken();
  }, [router]);

  const login = async (email: string, password: string) => {
    const response = await api.post(`/login/`, { username: email, password });
    const { access, refresh } = response.data;
    Cookies.set('access_token', access);
    Cookies.set('refresh_token', refresh);
    return access;
  };
  const decodeJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`
    ).join(''));
    
    return JSON.parse(jsonPayload);
  };
  const getUserId = async (token: string): Promise<number> => {
    try {
      const decodedToken = decodeJwt(token);
      if (decodedToken.user_id) {
        return decodedToken.user_id;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    const response = await  api.get(`/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.id;
  };

  const getUserData = async (token: string, userId: number): Promise<UserData> => {
    const response = await api.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const accessToken = await login(email, password);
      const userId = await getUserId(accessToken);
      const userData = await getUserData(accessToken, userId);
      localStorage.setItem('userData', JSON.stringify(userData));
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className='flex flex-row h-screen'>
      <div className='w-[30%] bg-gradient-to-t from-[#317974] to-[#8EDAD5] flex flex-col justify-center'>
        <img className='rotate-90 sm:rotate-0' src="/assets/logo.png" alt="Logo" />
      </div>
      <div className='w-full flex flex-col justify-center items-center'>
        <h2 className='text-[#8EDAD5] text-2xl md:text-3xl'>Bienvenido!</h2>
        <img src="/assets/user.png" alt="logouser" className='w-14 h-18 py-[15px] sm:w-24 sm:h-28 md:w-24 md:h-28' />
        <form className='w-[100%] pt-2 flex flex-col justify-center item-center' onSubmit={handleLogin}>
          <div className="w-[100%] mb-[15px] flex justify-center">
            <img src="/assets/mail.png" alt="email Icon" className="relative left-[30px] top-1/2 translate-y-[-50%] h-[20px] w-[20px] hidden sm:block md:block"/>
            <input
              className='pl-6 pr-0 pt-1 pb-1 bg-[#f0eeee] rounded-[4px] border border-[#ccc] sm:pl-9 md:pt-2 md:pb-2'
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="w-[100%] mb-[15px] flex justify-center">
            <img src="/assets/lock.png" alt="lock Icon" className="relative left-[30px] top-1/2 translate-y-[-50%] h-[20px] w-[20px] hidden sm:block md:block" />
            <input
              className='pl-6 pr-1 pt-1 pb-1 bg-[#f0eeee] rounded-[4px] border border-[#ccc] sm:pl-9 md:pt-2 md:pb-2'
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>
          {error && <p className="flex justify-center item-center text-red-500">{error}</p>}
          <div className='flex justify-center item-center'>
            <button type="submit" className='py-1 px-4 mt-2 bg-[#8EDAD5] rounded-[5px] text-white uppercase font-bold no-underline sm:py-2 sm:px-6 md:py-3 md:px-8'>
              Ingresar
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default LoginForm;