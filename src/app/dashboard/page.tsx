
import React from 'react';
import '../sections.css';  
import Bar from '../components/bar';
import Sidebar from '../components/sidebar'
import "../components/Calendario.css"; 
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
    <div className='container'>
        
        <Sidebar/>
        <div className='div-principal'>

        <Bar/>
        <h1>Los turnos del dia</h1>
        <div className='div-grapic'>
        <AppointmentsChart token={token} /> 
        <TurnosDelDia token={token}  />
        </div>
        </div>
        
    </div>
  
   
      

  );
};

export default Panel;