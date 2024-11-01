"use client";
import React from 'react';
import Tooth from './Tooth';
import "../../odontograma/odonto.css";

// Define el tipo de registro
interface Registro {
  lado: string;
  color: string;
  fecha: string;
  accion: string;
}

// Agrega las props a ToothGrid
interface ToothGridProps {
  onRegister: (registro: Registro) => void; // Acepta la función onRegister
  onHighlightTooth: (toothNumber: number, color: string, lado: string) => void; // Acepta la función para resaltar dientes
  highlightedTooth: { number: number; color: string; lado: string } | null; // Prop para el diente resaltado
}

const ToothGrid: React.FC<ToothGridProps> = ({ onRegister, onHighlightTooth, highlightedTooth }) => {
  const upperTeeth = [
    { id: 18 }, { id: 17 }, { id: 16 }, { id: 15 }, { id: 14 }, { id: 13 }, { id: 12 }, { id: 11 },
    { id: 21 }, { id: 22 }, { id: 23 }, { id: 24 }, { id: 25 }, { id: 26 }, { id: 27 }, { id: 28 }
  ];

  const lowerRightAndLeft = [
    { id: 48 }, { id: 47 }, { id: 46 }, { id: 45 }, { id: 44 }, { id: 43 }, { id: 42 }, { id: 41 },
    { id: 31 }, { id: 32 }, { id: 33 }, { id: 34 }, { id: 35 }, { id: 36 }, { id: 37 }, { id: 38 }
  ];

  const babyUpperTeeth = [
    { id: 55 }, { id: 54 }, { id: 53 }, { id: 52 }, { id: 51 },
    { id: 61 }, { id: 62 }, { id: 63 }, { id: 64 }, { id: 65 }
  ];

  const babyLowerTeeth = [
    { id: 85 }, { id: 84 }, { id: 83 }, { id: 82 }, { id: 81 },
    { id: 71 }, { id: 72 }, { id: 73 }, { id: 74 }, { id: 75 }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', marginLeft: '220px' }}>
      {/* Primera fila: Dientes superiores combinados (derecha + izquierda) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '5px', marginBottom: '20px' }}>
        {upperTeeth.map(tooth => (
          <Tooth 
            key={tooth.id} 
            number={tooth.id} 
            onRegister={onRegister} 
            highlightedTooth={highlightedTooth} // Prop para el diente resaltado
          />
        ))}
      </div>

      {/* Segunda fila: Dientes inferiores combinados */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '5px', marginBottom: '20px' }}>
        {lowerRightAndLeft.map(tooth => (
          <Tooth 
            key={tooth.id} 
            number={tooth.id} 
            onRegister={onRegister} 
            highlightedTooth={highlightedTooth} // Prop para el diente resaltado
          />
        ))}
      </div>

      {/* Tercera fila: Dientes de leche superiores (55-51 y 61-65) */}
      <div className='div-centrar-dientes'>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '5px', marginBottom: '20px', width: '44%' }}>
          {babyUpperTeeth.map(tooth => (
            <Tooth 
              key={tooth.id} 
              number={tooth.id} 
              onRegister={onRegister} 
              highlightedTooth={highlightedTooth} // Prop para el diente resaltado
            />
          ))}
        </div>
      </div>

      {/* Cuarta fila: Dientes de leche inferiores (85-81 y 71-75) */}
      <div className='div-centrar-dientes'>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '5px', marginBottom: '20px', width: '44%' }}>
          {babyLowerTeeth.map(tooth => (
            <Tooth 
              key={tooth.id} 
              number={tooth.id} 
              onRegister={onRegister} 
              highlightedTooth={highlightedTooth} // Prop para el diente resaltado
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToothGrid;