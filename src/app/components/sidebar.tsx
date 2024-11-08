"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';



const Sidebar: React.FC = () => {
  return (
    <div className='navbar min-w-[14%] min-h-[100%] sm:min-w-[100px] lg:min-w-[150px] xl:min-w-[170px] 2xl:min-w-[170px]'>
      <div>
        <Link className='a-navbar flex items-center justify-center' href="/dashboard">
          <Image
            className='logo h-8 w-[100%] md:h-10 lg:h-14 xl:h-14 2xl:h-14'
            src="/assets/logo.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </Link>
      </div>
      <div className='div-links lg:items-start'>
        <Link className='a-navbar justify-center sm:flex-col md:flex-col lg:flex-row lg:ml-[10%]' href="/dashboard">
          <Image
            src="/assets/hoy.png"
            alt="logohoy"
            className='hoy-logo h-10 w-10'
            width={100 }
            height={100}
          />
          <span className='hidden sm:block text-sm md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg'>Home</span>
        </Link>

        <Link className='a-navbar justify-center sm:flex-col md:flex-col lg:flex-row lg:ml-[10%]' href="/pacientes">
          <Image
            src="/assets/people.png"
            alt="logopacientes"
            className='pacientes-logo h-10 w-10'
            width={60}
            height={60}
          />
          <span className='hidden sm:block text-sm md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg'>Pacientes</span>
        </Link>

        <Link className='a-navbar justify-center sm:flex-col md:flex-col lg:flex-row lg:ml-[10%]' href="/turnos">
          <Image
            src="/assets/calendar.png"
            alt="logocalendar"
            className='calendar-logo h-16 w-10'
            width={64}
            height={64}
          />
          <span className='hidden sm:block text-sm md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg'>Turnos</span>
        </Link>

        <Link className='a-navbar justify-center sm:flex-col md:flex-col lg:flex-row lg:ml-[10%]' href="/profesionales">
          <Image
            src="/assets/doctor.png"
            alt="logocalendar"
            className='calendar-logo h-10 w-10'
            width={60}
            height={60}
          />
          <span className='hidden sm:block text-sm md:text-sm lg:text-md lg:justify-center xl:text-lg 2xl:text-lg'>Profesionales</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
