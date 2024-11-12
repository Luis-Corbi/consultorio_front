"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToothGrid from '../components/Odontograma/ToothGrid';
import Notas from '../components/Odontograma/Notas';
import Sidebar from '../components/Odontograma/sidebar';
import Bar from '../components/Odontograma/bar';
import './odonto.css';

const App = () => {
  const [registros, setRegistros] = useState<{ lado: string; color: string; fecha: string; accion: string }[]>([]);
  const [highlightedTooth, setHighlightedTooth] = useState<{ number: number; color: string; lado: string } | null>(null);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<number>(1); // Valor por defecto 1
  const [userData, setUserData] = useState<{ user: number } | null>(null);

  // Función para obtener el token desde las cookies
  const getAuthToken = () => {
    return (
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1] || ''
    );
  };

  const handleRegister = (registro: { lado: string; color: string; fecha: string; accion: string }) => {
    setRegistros([...registros, registro]);
  };

  const onHighlightTooth = (toothNumber: number, color: string, lado: string) => {
    setHighlightedTooth({ number: toothNumber, color, lado });
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/', {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`, // Agregar el encabezado de autorización
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setUserData({ user: selectedUser }); // Actualiza userData al cambiar selectedUser
  }, [selectedUser]);

  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <div className="w-[100%] flex-grow flex flex-col bg-[#F1F1F1]">
        <Bar />
        <div className="flex flex-col sm:flex-row justify-center gap-4 p-4">
          <div className="contenedor-odonto" style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ToothGrid
              onRegister={handleRegister}
              onHighlightTooth={onHighlightTooth}
              highlightedTooth={highlightedTooth}
              userId={selectedUser} // Pasar el userId al componente ToothGrid
            />
          </div>
        </div>
        <div className="notas-container">
          <Notas
            registros={registros}
            onRegister={handleRegister}
            onHighlightTooth={onHighlightTooth}
            userId={selectedUser} // Pasar el userId al componente Notas
          />
        </div>
      </div>
    </div>
  );
};

export default App;
