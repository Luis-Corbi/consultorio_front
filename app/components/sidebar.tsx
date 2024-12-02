"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; 

const Sidebar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const pathname = usePathname(); 
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (userData.roles && userData.roles.some((role: { name: string }) => role.name === "admin")) {
      setIsAdmin(true);
    }
  }, []);

  const isActiveLink = (path: string) => 
    pathname === path 
      ? 'bg-white bg-opacity-50 rounded-xl' 
      : ' ';
  return (
    <div className={`bg-custom-gradient ${pathname === "/" ? "hidden" : ""}`}>
      {/* Vista Movil */}
      <div className=" bg-custom-gradient navbar fixed top-0 left-0 w-full h-16 flex items-center py-2 px-4 md:hidden">
        <div className="flex justify-around items-center w-full">
          {/* Logo Home o Dashboard */}
          <Link href="/dashboard" className={isActiveLink('/dashboard')}>
            <img src="/assets/dashboard.svg" alt="logohoy" className=" h-8 w-8 p-1 object-contain" />
          </Link>

          {/* Logo Pacientes */}
          <Link href="/pacientes" className={isActiveLink('/pacientes')}>
            <img src="/assets/users.svg" alt="logopacientes" className="h-8 w-8  p-1 object-contain" />
          </Link>

          {/* Logo Turnos */}
          <Link href="/turnos" className={isActiveLink('/turnos')}>
            <img src="/assets/calendar.svg" alt="logocalendar" className=" h-8 w-8  p-1 object-contain" />
          </Link>

          {/* Logo Profesionales */}
          <Link href="/profesionales" className={isActiveLink('/profesionales')}>
            <img src="/assets/profesional.svg" alt="logodoctor" className=" h-8 w-8  p-1 object-contain" />
          </Link>
        </div>
      </div>

      {/* Vistas Tablet y desktop */}
      <div className="navbar hidden md:flex flex-col justify-between h-full py-4 px-1 min-w-[14%] lg:min-w-[150px] lg:navbar xl:min-w-[170px] xl:navbar 2xl:min-w-[170px] 2xl:navbar">
        {/* Logo Denthos */}
        <div className="flex items-center justify-center w-full py-4">
          <Link href="/dashboard" >
            <img className="logo h-10 w-auto" src="/assets/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Links */}
        <div className="flex flex-col justify-around items-left h-full">
          {/* Link Dashboard */}
          <Link href="/dashboard" className={`a-navbar flex flex-col items-center lg:ml-2 lg:flex-row ${isActiveLink('/dashboard')}`}>
            <img src="/assets/dashboard.svg" alt="logohoy" className="h-9 w-9 p-1 object-contain" />
            <span className="hidden sm:block text-sm md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg text-white" >Home</span>
          </Link>

          {/* Link Pacientes */}
          <Link href="/pacientes" className={`a-navbar flex flex-col items-center lg:ml-2 lg:flex-row ${isActiveLink('/pacientes')}`}>
            <img src="/assets/users.svg" alt="logopacientes" className=" object-contain p-1  h-8 w-8" />
            <span className="md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg text-white">Pacientes</span>
          </Link>

          {/* Link Turnos */}
          <Link href="/turnos" className={`a-navbar flex flex-col items-center lg:ml-2 lg:flex-row ${isActiveLink('/turnos')}`}>
          <img src="/assets/calendar.svg" alt="logocalendar" className="object-contain p-1  h-8 w-8" />

          <span className="md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg text-white">Turnos</span>
        </Link>


          {/* Link Profesionales */}
          <Link href="/profesionales" className={`a-navbar flex flex-col items-center lg:ml-1 lg:flex-row ${isActiveLink('/profesionales')}`}>
            <img src="/assets/profesional.svg" alt="logodoctor" className="object-contain p-1  h-8 w-8" />
            <span className="md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg text-white">Profesionales</span>
          </Link>
          {isAdmin && (
            <Link href="/administracion" className={`a-navbar flex flex-col items-center lg:ml-1 lg:flex-row ${isActiveLink('/administracion')}`}>
            <img src="/assets/admin.svg" alt="logoadmin" className="object-contain h-8 w-8 p-1" />
            <span className="md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg text-white">Admin</span>
          </Link>


            
          )}
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
