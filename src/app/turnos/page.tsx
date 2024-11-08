"use client"
import React from 'react';
import '../sections.css';  
import Sidebar from '../components/sidebar'
import Bar from '../components/bar';



import dynamic from 'next/dynamic';


const Calendario = dynamic(() => import('../components/calendar'), { ssr: false });

const Turnos: React.FC = () => {
    return (
       
        <div className='w-full flex min-h-screen'>
                        
            <Sidebar/>
            <div className='W-[100%] flex-grow flex flex-col bg-[#F1F1F1]'>

                <div className="w-full">
                    <Bar />
                </div>

                <div className='flex-grow p-4'>
                    <Calendario defaultView="month" />
                </div>

            </div>

        </div>
);
}
export default Turnos;
