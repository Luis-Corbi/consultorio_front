"use client"
import React from 'react';
import '../sections.css';  
import Bar from '../components/bar';
import Sidebar from '../components/sidebar'
import Calendario from '../components/calendar';
import "../components/Calendario.css"; 

const Panel: React.FC = () => {
  return (
    <div className='container'>
        
        <Sidebar/>
        <div className='div-principal'>

        <Bar/>
        <Calendario defaultView="day" />
        </div>
        
    </div>
  
   
      

  );
};

export default Panel;