
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
    <div className="p-4 bg-gray-50 rounded-lg shadow-md w-full lg:w-[30%]">
      <h2 className="text-xl font-semibold text-teal-600 mb-4">Turnos del Día</h2>
      {turnos.length === 0 ? (
        <p className="text-gray-500">No hay turnos para hoy.</p>
      ) : (
        <ul className="w-full list-none">
          {turnos.map((turno) => (
            <li
              key={turno.id}
              className="bg-white rounded-lg shadow-sm mb-4 flex items-center p-4 border-l-4 border-teal-500 hover:bg-teal-50 transition duration-300 ease-in-out"
            >
              <div className="flex flex-col ml-4">
                <p className="text-sm text-gray-700">
                  <strong className="text-teal-600">Paciente:</strong> {getPatientName(turno.patient)}
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-teal-600">Hora:</strong> {turno.hour}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  

};

export default TurnosDelDia;
