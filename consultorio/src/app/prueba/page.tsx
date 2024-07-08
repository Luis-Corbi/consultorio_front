'use client';
import '../globals.css'; 
import React, { useState } from 'react';

const Page: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [registerName, setRegisterName] = useState<string>('');
  const [registerPhone, setRegisterPhone] = useState<string>('');
  const [registerAddress, setRegisterAddress] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');

  return (
    <div className="relative flex w-full h-screen overflow-hidden">
      <div
        className={`flex flex-col justify-center items-center w-1/2 transition-transform duration-500 ${
          isLogin ? 'translate-x-0' : '-translate-x-full'
        } bg-[#e91e63] text-white`}
      >
        <div className="absolute top-4 left-4 font-bold text-lg">CINEIMPAR</div>
        <h2 className="text-3xl font-bold mb-8">Iniciar sesión</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="login-email" className="block">Email</label>
            <input
              id="login-email"
              placeholder="Email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="login-password" className="block">Contraseña</label>
            <input
              id="login-password"
              type="password"
              placeholder="Contraseña"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          <button className="bg-[#00bfa5] text-white w-full">Iniciar sesión</button>
        </div>
      </div>
      <div
        className={`flex flex-col justify-center items-center w-1/2 transition-transform duration-500 ${
          isLogin ? 'translate-x-full' : 'translate-x-0'
        } bg-[#009688] text-white`}
      >
        <div className="absolute top-4 left-4 font-bold text-lg">CINEIMPAR</div>
        <h2 className="text-3xl font-bold mb-8">Registrarse</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="register-name" className="block">Nombre y Apellido</label>
            <input
              id="register-name"
              placeholder="Nombre y Apellido"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-phone" className="block">Telefono</label>
            <input
              id="register-phone"
              placeholder="Telefono"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={registerPhone}
              onChange={(e) => setRegisterPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-address" className="block">Direccion</label>
            <input
              id="register-address"
              placeholder="Direccion"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={registerAddress}
              onChange={(e) => setRegisterAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-email" className="block">Email</label>
            <input
              id="register-email"
              placeholder="Email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-password" className="block">Contraseña</label>
            <input
              id="register-password"
              type="password"
              placeholder="Contraseña"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>
          <button className="bg-[#e91e63] text-white w-full">Registrarse</button>
        </div>
      </div>
      {/* Contenedor transparente para el botón de cambio */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        {/* Botón de cambio entre inicio de sesión y registro */}
        <button onClick={() => setIsLogin(!isLogin)} className="bg-white text-black rounded-full p-4 pointer-events-auto">
          <ArrowRightLeftIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

interface Props {
  className?: string;
}

const ArrowRightLeftIcon: React.FC<Props> = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  );
}

export default Page;
