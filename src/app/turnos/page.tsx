"use client"
import React from 'react';
import '../sections.css';  
import Sidebar from '../components/sidebar'
import Bar from '../components/bar';



import dynamic from 'next/dynamic';

// Importa dinámicamente el componente del calendario para evitar problemas con SSR
const Calendario = dynamic(() => import('../components/calendar'), { ssr: false });

const Turnos: React.FC = () => {
    return (
       
                <div className='container'>
                        
                <Sidebar/>
                <div className='div-principal'>

                <Bar/>
                <Calendario defaultView="month" />
                </div>

                </div>
);
}
export default Turnos;
