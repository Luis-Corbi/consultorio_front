"use client"
import React from 'react';
import '../sections.css';  
import Link from 'next/link';

const Sidebar: React.FC = () => {
    return (
      
        <div className='navbar'>
          <div>
          <Link  className='a-navbar' href="/dashboard">
            <img className='logo' src="/assets/logo.png" alt="Logo" />
            </Link>
          </div>
          <div className='div-links'>
            <Link  className='a-navbar' href="/dashboard">
              
                <img src="/assets/hoy.png" alt="logohoy" className='hoy-logo'/>
                Home
          
            </Link>
            <Link className='a-navbar' href="/pacientes">
              
                <img src="/assets/people.png" alt="logopacientes" className='pacientes-logo'/>
                Pacientes
            </Link>
            <Link className='a-navbar' href="/turnos">
                <img src="/assets/calendar.png" alt="logocalendar" className='calendar-logo'/>
                Turnos
            </Link>
            <Link className='a-navbar' href="/profesionales">
                <img src="/assets/doctor.png" alt="logocalendar" className='calendar-logo'/>
                Profesionales
            </Link>
          </div>
        </div>
      
    );
  };
  
  export default Sidebar;