
"use client"
import "../../pacientes/pacientes.css"
import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
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


  const fetchLoggedInUserId = async () => {
    try {
      const response = await await api.get('/user/profile/', {
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


  const fetchTodayAppointments = async (professionalId: number) => {
    try {
      const response = await await api.get(`/today-appointments/${professionalId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      if (response.status === 200) {
        const appointmentsData = response.data;


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

  const fetchPatientsByRole = async (roleId: number) => {
    try {
      const response = await api.get(`/users/?role=${roleId}`, {
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

  useEffect(() => {
    fetchLoggedInUserId(); 
    const loadUsers = async () => {
      try {
        const fetchedPatients = await fetchPatientsByRole(3);
        setPatients(fetchedPatients);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (loggedInUserId !== null) {
      fetchTodayAppointments(loggedInUserId); 
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
  <h2 className="px-2">Turnos del Día</h2>
  {turnos.length === 0 ? (
    <p className="px-2">No hay turnos para hoy.</p>
  ) : (
    <ul className="w-full list-none mr-[5%] rounded-r-[10px] rounded-l-none ml-[2%]">
      {turnos.map((turno) => (
        <li
        key={turno.id}
        className="bg-white rounded-r-[10px] rounded-l-none w-full border-l-4 border-[#037171] mt-[5%] flex pl-5 bg-gray-100">
        <p className="flex ml-[5%]">  
          <strong>Paciente:</strong> {getPatientName(turno.patient)} - 
        </p>
        <p className="flex ml-[5%]"> 
          <strong>Hora:</strong> {turno.hour}
        </p>
        -
      </li>
      ))}
    </ul>
  )}
</div>
  );
};

export default TurnosDelDia;
