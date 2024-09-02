// src/app/components/login.tsx
"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import './login.css';
import api from '../lib/api';

interface UserData {
  id: number;
  email: string;
  name: string;
  specialty?: string;
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className='div-login'>
      <div className='div1'>
        <img src="/assets/logo.png" alt="Logo" />
      </div>
      <div className='div2'>
        <h2>Bienvenido!</h2>
        <img src="/assets/user.png" alt="logouser" className='user-logo' />
        <form onSubmit={handleLogin}>
          <div className="inputGroup">
            <img src="/assets/mail.png" alt="email Icon" className="icon" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="inputGroup">
            <img src="/assets/lock.png" alt="lock Icon" className="icon" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className='btn-ingresar'>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;