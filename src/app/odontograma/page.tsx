"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToothGrid from '../components/Odontograma/ToothGrid';
import Navbar from '../components/Odontograma/Navbar';
import Notas from '../components/Odontograma/Notas';
import UserForm from '../components/Odontograma/userform'; 
import './odonto.css';

const App = () => {
  const [registros, setRegistros] = useState<{ lado: string; color: string; fecha: string; accion: string }[]>([]);
  const [highlightedTooth, setHighlightedTooth] = useState<{ number: number; color: string; lado: string } | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<number>(1); // Valor por defecto 1
  const [userData, setUserData] = useState<{ user: number } | null>(null); // Cambiado a nuevo tipo

  // Función para cargar usuarios
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  };

  const handleUserRegister = async (username: string, password: string, role: 'paciente' | 'profesional') => {
    const userData = { username, password, role };

    try {
      const response = await axios.post('http://localhost:8000/api/register/', userData);
      console.log('Usuario creado:', response.data);
      setShowUserForm(false);
      fetchUsers();
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    }
  };

  const handleRegister = (registro: { lado: string; color: string; fecha: string; accion: string }) => {
    setRegistros([...registros, registro]);
  };

  const onHighlightTooth = (toothNumber: number, color: string, lado: string) => {
    setHighlightedTooth({ number: toothNumber, color, lado });
  };

  const toggleUserForm = () => {
    setShowUserForm(!showUserForm);
  };

  const handleFinalButtonClick = () => {
    setShowUserForm(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setUserData({ user: selectedUser }); // Actualiza userData al cambiar selectedUser
  }, [selectedUser]);

  return (
    <div>
      <div className="background">
        <Navbar userData={userData} /> {/* Pasando userData a Navbar */}

        {/* Desplegable de usuarios */}
        <div style={{ marginLeft: '500px' }}>
          <select 
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              setSelectedUser(selectedId ? selectedId : 1); // Si no se selecciona, por defecto será 1
              setUserData(selectedId ? { user: selectedId } : { user: 1 }); // Actualiza userData
            }} 
            value={selectedUser}
          >
            <option value="" disabled>Seleccione un usuario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>

        {/* Botón para mostrar el formulario de usuario */}
        <button onClick={toggleUserForm} style={{ margin: '20px' }}>
          Crear Usuario
        </button>

        {/* Formulario para crear usuario */}
        {showUserForm && (
          <UserForm role="paciente" onClose={toggleUserForm} onRegister={handleUserRegister} />
        )}

        {/* Div flotante sobre ToothGrid */}
        <div style={{ position: 'absolute', top: '385px', left: '370px', right: '0px', backgroundColor: 'black', height: '2px', width: '1190px' }}></div> 
        <div style={{ position: 'absolute', bottom: '300px', left: '965px', height: '480px', width: '2px', backgroundColor: 'black'}}></div>

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
            <ToothGrid 
              onRegister={handleRegister} 
              onHighlightTooth={onHighlightTooth} 
              highlightedTooth={highlightedTooth} 
              userId={selectedUser} // Pasar el userId al componente ToothGrid
            />
          </div>
        </div>

        <div className='notas-container'>
          <Notas 
            registros={registros} 
            onRegister={handleRegister} 
            onHighlightTooth={onHighlightTooth} 
            userId={selectedUser} // Pasar el userId al componente Notas
          />
        </div>

        {/* Botón al final del todo que llama al formulario de usuario */}
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <button onClick={handleFinalButtonClick} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            Crear Usuario
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;