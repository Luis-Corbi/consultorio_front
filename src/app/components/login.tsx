// src/app/components/login.tsx
"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { login } from '../lib/auth';
import './login.css';  

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
        const decodedToken = decodeJwt(token); // Decodifica el token para verificar su expiración
        const now = Date.now() / 1000;
        
        if (decodedToken.exp > now) {
          // Token es válido
          router.push('/dashboard');
        } else {
          // Token ha expirado
          Cookies.remove('access_token');
          setError('La sesión ha expirado');
        }
      } else {
        setLoading(false); // No hay token, permite el login
      }
    };

    checkToken();
  }, [router]);

  const decodeJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`
    ).join(''));
    
    return JSON.parse(jsonPayload);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
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
