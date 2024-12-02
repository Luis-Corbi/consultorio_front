"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Para manejar rutas dinámicas
import ToothGrid from '../../../odontograma/ToothGrid';
import Notas from '../../../odontograma/Notas';
import Sidebar from '../../../components/sidebar';
import Bar from '../../../components/bar';
import Link from 'next/link'; // Import para el botón
import '../../../odontograma/odonto.css';

const App = () => {
  const [registros, setRegistros] = useState<{ lado: string; color: string; fecha: string; accion: string }[]>([]);
  const [highlightedTooth, setHighlightedTooth] = useState<{ number: number; color: string; lado: string } | null>(null);
  const [userData, setUserData] = useState<any | null>(null); // Estado para los datos del usuario
  const params = useParams(); // Hook para manejar rutas dinámicas
  const id = typeof params?.id === 'string' ? parseInt(params.id) : null; // Verificación y conversión del parámetro id

  // Hook para cargar los datos del usuario almacenados en localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      window.location.href = '/'; // Redirige a la página de inicio si no hay datos
    }
  }, []);

  const handleRegister = (registro: { lado: string; color: string; fecha: string; accion: string }) => {
    setRegistros([...registros, registro]);
  };

  const onHighlightTooth = (toothNumber: number, color: string, lado: string) => {
    setHighlightedTooth({ number: toothNumber, color, lado });
  };

  if (!userData || id === null) {
    // Muestra un indicador de carga si los datos del usuario no están disponibles o el ID no es válido
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex min-h-screen z" style={{ position: 'relative', zIndex: 1000 }}>
  
      <div className="flex-grow flex flex-col" style={{ position: 'relative', zIndex: -1 }}>
        <Bar />
        <div className="flex flex-col sm:flex-row justify-center gap-4 p-4">
          <div className="contenedor-odonto" style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ToothGrid
              onRegister={handleRegister}
              onHighlightTooth={onHighlightTooth}
              highlightedTooth={highlightedTooth}
              userId={id} // Pasa el ID dinámico del usuario al componente
            />
          </div>
        </div>
        <div className="notas-container">
          <Notas
            registros={registros}
            onRegister={handleRegister}
            onHighlightTooth={onHighlightTooth}
            userId={id} // Pasa el ID dinámico del usuario al componente
          />
        </div>
        {/* Botón para volver al paciente */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link
            href={`/pacientes/${id}`}
            className="text-white bg-teal-500 hover:bg-teal-600 text-sm font-medium px-4 py-2 rounded-lg"
            style={{
              textDecoration: 'none',
              padding: '10px 20px',
              backgroundColor: '#38b2ac',
              color: '#ffffff',
              borderRadius: '8px',
            }}
          >
            Volver al Paciente
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;
