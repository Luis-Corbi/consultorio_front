"use client"
import React from 'react';
import '../sections.css';  
import Bar from '../components/bar';
import Sidebar from '../components/sidebar'

const Panel: React.FC = () => {
  return (
    <div className='container'>
        
        <Sidebar/>
        <div className='div-principal'>

        <Bar/>
        
        </div>
        
    </div>
  
   
      

  );
};

export default Panel;