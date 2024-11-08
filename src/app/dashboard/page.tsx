
import React from 'react';

import Bar from '../components/bar';
import Sidebar from '../components/sidebar'
import AppointmentsChart from '../components/grafico';
import { cookies } from 'next/headers'; 
import TurnosDelDia from '../components/home/Turnosdeldia';



const Panel= () => {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value || '';

  if (!token) {
    return <div>Token no disponible, por favor inicie sesión.</div>;
  }

  return (
    <div className='w-full flex min-h-screen'>
        
      <Sidebar/>
      <div className='w-[100%] flex-grow flex flex-col bg-[#F1F1F1]'>

        <div className="w-full">
          <Bar />

        <h1>Los turnos del dia</h1> 
        <div className="flex flex-col sm:flex-row justify-center gap-4 p-4">
          <AppointmentsChart token={token} />
          <TurnosDelDia token={token} />
        </div>
        </div>
        
      </div>
        
    </div>
  
  );
};

export default Panel;