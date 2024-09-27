// TurnosDelDia.tsx"
"use client"
// components/TurnosDelDia.tsx
// components/TurnosDelDia.tsx
// components/TurnosDelDia.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Appointment {
  id: number;
  professional: number;
  patient: number;
  date: string;
  hour: string;
  status: string;
  notes: string;
}

interface User {
  id: number;
  name: string;
  lastname: string;
  // Agrega otros campos de usuario si es necesario
}

interface TurnosDelDiaProps {
  token: string;
}

const TurnosDelDia: React.FC<TurnosDelDiaProps> = ({ token }) => {
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [turnos, setTurnos] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the logged-in user's ID
  const fetchLoggedInUserId = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = response.data.id;
      setLoggedInUserId(userId);
    } catch (error) {
      console.error('Error fetching logged-in user ID:', error);
      setError('Error al obtener el usuario autenticado.');
      setLoading(false);
    }
  };

  // Fetch today's appointments for the logged-in user
  const fetchTodayAppointments = async (professionalId: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/today-appointments/${professionalId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data); // Imprimir respuesta para verificar formato

      if (response.status === 200) {
        const appointmentsData = response.data;

        // Verificar si appointmentsData es un array
        if (Array.isArray(appointmentsData)) {
          setTurnos(appointmentsData);
        } else {
          throw new Error('Formato de datos no válido');
        }
      } else {
        throw new Error('Error al obtener los datos de las citas.');
      }
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      setError('Error al obtener los datos de las citas.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients by role
  const fetchPatientsByRole = async (roleId: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/users/?role=${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw new Error('Error al obtener los pacientes.');
    }
  };

  // Load professionals and patients on component mount
  useEffect(() => {
    fetchLoggedInUserId(); // Fetch user ID on component mount
    const loadUsers = async () => {
      try {
        const fetchedPatients = await fetchPatientsByRole(3); // Rol de paciente
        setPatients(fetchedPatients);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (loggedInUserId !== null) {
      fetchTodayAppointments(loggedInUserId); // Fetch appointments once user ID is available
    }
  }, [loggedInUserId]);

  const getPatientName = (id: number) => {
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.name} ${patient.lastname}` : 'Paciente no encontrado';
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Turnos del Día</h2>
      {turnos.length === 0 ? (
        <p>No hay turnos para hoy.</p>
      ) : (
        <ul>
          {turnos.map((turno) => (
            <li key={turno.id}>
              <strong>Paciente:</strong> {getPatientName(turno.patient)} - 
              
             
              <strong> Hora:</strong> {turno.hour} - 
            
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TurnosDelDia;
