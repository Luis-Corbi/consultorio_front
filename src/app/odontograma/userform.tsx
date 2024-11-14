"use client";
import React, { useState } from 'react';
import axios from 'axios';

interface UserFormProps {
  role: 'paciente' | 'profesional';
  onClose: () => void; // Función para cerrar el formulario
  onRegister: (username: string, password: string, role: 'paciente' | 'profesional') => void; // Agregar onRegister aquí
}

const UserForm: React.FC<UserFormProps> = ({ role, onClose, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Evita el refresco de la página

    if (!username || !password) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      // Llama a la función onRegister con los datos del usuario
      await onRegister(username, password, role);
      onClose(); // Cerrar el formulario al finalizar
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      alert('Error al crear el usuario. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="modal">
      <h2>{role === 'paciente' ? 'Crear Paciente' : 'Crear Profesional'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Usuario</button>
        <button type="button" onClick={onClose}>Cerrar</button>
      </form>
    </div>
  );
};

export default UserForm;