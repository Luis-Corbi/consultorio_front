
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

    <div className='h-full w-full flex'>

      <Sidebar/>
      <div className='h-screen w-full mt-16 bg-gray-100 md:mt-0 md:p-1'>
        <Bar />
        <div className='bg-gray-100 gap-64 px-1 md:flex md:ml-6'>
          <AppointmentsChart token={token} /> 
          <TurnosDelDia token={token}  />  
        </div>
        
      </div>

    </div>

  );
};

export default Panel;