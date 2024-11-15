"use client"
import React from 'react';
import '../sections.css';  
import Sidebar from '../components/sidebar'
import Bar from '../components/bar';



import dynamic from 'next/dynamic';


const Calendario = dynamic(() => import('../components/calendar'), { ssr: false });

const Turnos: React.FC = () => {
    return (
       
        <div className='h-full w-full flex'>
                        
            <Sidebar/>
            <div className='h-screen w-full mt-16 bg-gray-100 md:mt-0 md:p-1'>

                <Bar />
                
                <div className='flex-grow p-4'>
                    <Calendario defaultView="month" />
                </div>

            </div>

        </div>
);
}
export default Turnos;
