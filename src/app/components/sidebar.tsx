"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';



const Sidebar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    
    if (userData.roles && userData.roles.some((role: { name: string }) => role.name === "admin")) {
      setIsAdmin(true);
    }
  }, []);
  return (
  
    <div>
      
      {/* Vista Movil */}
      <div className="navbar fixed top-0 left-0 w-full h-16 flex items-center py-2 px-4 md:hidden">
        
        <div className="flex justify-around items-center w-full">
          {/* Logo Home o Dashboard */}
          <Link href="/dashboard">
            <img src="/assets/hoy.png" alt="logohoy" className="hoy-logo h-8 w-8" />
          </Link>

          {/* Logo Pacientes */}
          <Link href="/pacientes">
            <img src="/assets/people.png" alt="logopacientes" className="pacientes-logo h-8 w-8" />
          </Link>

          {/* Logo Turnos */}
          <Link href="/turnos">
            <img src="/assets/calendar.png" alt="logocalendar" className="calendar-logo h-14 w-10 object-contain" />
          </Link>

          {/* Logo Profesionales */}
          <Link href="/profesionales">
            <img src="/assets/doctor.png" alt="logodoctor" className="calendar-logo h-8 w-8" />
          </Link>
        </div>
      </div>

      {/* Vistas Tablet y desktop */}
      <div className="navbar hidden md:flex flex-col justify-between h-full py-4 px-1 min-w-[14%] lg:min-w-[150px] lg:navbar xl:min-w-[170px] xl:navbar 2xl:min-w-[170px] 2xl:navbar">
        {/* Logo Denthos */}
        <div className="flex items-center justify-center w-full py-4">
          <Link href="/dashboard">
            <img className="logo h-10 w-auto" src="/assets/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Links */}
        <div className="flex flex-col justify-around items-left h-full">

          {/* Link Dashboard */}
          <Link href="/dashboard" className="a-navbar flex flex-col items-center lg:ml-2 lg:flex-row">
            <img src="/assets/hoy.png" alt="logohoy" className="h-10 w-10" />
            <span className="hidden sm:block text-sm md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg">Home</span>
          </Link>

          {/* Link Pacientes */}
          <Link href="/pacientes" className="a-navbar flex flex-col items-center lg:ml-2 lg:flex-row">
            <img src="/assets/people.png" alt="logopacientes" className="pacientes-logo h-10 w-10" />
            <span className="md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg">Pacientes</span>
          </Link>

          {/* Link Turnos */}
          <Link href="/turnos" className="a-navbar flex flex-col items-center lg:ml-2 lg:flex-row">
            <img src="/assets/calendar.png" alt="logocalendar" className="calendar-logo h-16 w-10" />
            <span className="md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg">Turnos</span>
          </Link>

          {/* Link Profesionales */}
          <Link href="/profesionales" className="a-navbar flex flex-col items-center lg:ml-1 lg:flex-row">
            <img src="/assets/doctor.png" alt="logodoctor" className="calendar-logo h-10 w-10" />
            <span className="md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg">Profesionales</span>
          </Link>
        </div>
        {isAdmin && (
        <Link className='a-navbar justify-center sm:flex-col md:flex-col lg:flex-row lg:ml-[10%]' href="/administracion">
          <Image
            src="/assets/registro.png"
            alt="registro"
            className='calendar-logo h-10 w-10'
            width={60}
            height={60}
          />
          <span className='hidden sm:block text-sm md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg'>Administracion</span>
        </Link>
         )}
      </div>
    </div>
  );
};

export default Sidebar;

