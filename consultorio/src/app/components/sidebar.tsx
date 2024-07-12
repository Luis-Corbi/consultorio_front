"use client"
import React from 'react';
import '../sections.css';  
import Link from 'next/link';

const Sidebar: React.FC = () => {
    return (
      
        <div className='navbar'>
          <div>
            <img className='logo' src="/assets/logo.png" alt="Logo" />
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
          </div>
          <div>logout</div>
        </div>
      
    );
  };
  
  export default Sidebar;