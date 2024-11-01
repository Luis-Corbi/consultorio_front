"use client";
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import ToothGrid from '../components/Odontograma/ToothGrid';
import Navbar from '../components/Odontograma/Navbar';
import Notas from '../components/Odontograma/Notas';
import './odonto.css';

const App = () => {
  const [registros, setRegistros] = useState<{ lado: string; color: string; fecha: string; accion: string }[]>([]);
  const [highlightedTooth, setHighlightedTooth] = useState<{ number: number; color: string; lado: string } | null>(null);

  const handleRegister = (registro: { lado: string; color: string; fecha: string; accion: string }) => {
    setRegistros([...registros, registro]);
  };

  const onHighlightTooth = (toothNumber: number, color: string, lado: string) => {
    setHighlightedTooth({ number: toothNumber, color, lado });
  };

  // Estado para los inputs de Profesional y Paciente
  const [profesional, setProfesional] = useState('');
  const [paciente, setPaciente] = useState('');

  return (
    <div>
      <div className="background">
        <Navbar />
        
        {/* Sección de Profesional y Paciente */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' ,marginLeft: '220px' }}>
            <label htmlFor="profesional">Profesional</label>
            <input
              type="text"
              id="profesional"
              value={profesional}
              onChange={(e) => setProfesional(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
            <button style={{ marginLeft: '10px', padding: '5px' }}>Buscar</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label htmlFor="paciente">Paciente</label>
            <input
              type="text"
              id="paciente"
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
            <button style={{ marginLeft: '10px', padding: '5px' }}>Buscar</button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, alignItems: 'flex-start', width: '100%' }}>
          <div className="logo-y-div1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="logo-container">
              <img src="/assets/logo.png" alt="Logo" className="logo" />
            </div>
            <div className="div1">
              <div className="botones-container">
                <button className="boton">Botón</button>
                <button className="boton">Botón</button>
                <button className="boton">Botón</button>
              </div>
            </div>
          </div>

          <div className='contenedor-odonto' style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ToothGrid onRegister={handleRegister} onHighlightTooth={onHighlightTooth} highlightedTooth={highlightedTooth} />
          </div>
        </div>

        <div className='notas-container'>
          <Notas registros={registros} onRegister={handleRegister} onHighlightTooth={onHighlightTooth} />
        </div>
      </div>
    </div>
  );
};

export default App;