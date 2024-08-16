// src/lib/appointments.ts

import { Appointment, User } from '../types/types';
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://consultorio-back.onrender.com/api'
  : 'http://127.0.0.1:8000/api';

export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
  console.log('Creating appointment:', appointment); // Log para ver los datos de la cita
  const res = await fetch(`${API_BASE_URL}/appointments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointment)
  });

  if (!res.ok) {
    const errorText = await res.text(); // Obtener el texto del error
    console.error('Failed to create appointment:', res.status, errorText); // Log para ver el estado y el error
    throw new Error('Failed to create appointment');
  }

  return res.json();
};

//traer turnos


export const fetchAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    return [];
  }
};

export const fetchAppointmentsByProfessional = async (professionalId: number): Promise<Appointment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/professional/${professionalId}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching appointments for professional ${professionalId}:`, error);
    return [];
  }
};

export const fetchProfessionals = async () => {
  try {
    // Primero, obtén todos los usuarios
    const response = await fetch(`${API_BASE_URL}/users/`);
    const users = await response.json();
    
    // Filtra los usuarios para obtener solo los profesionales
    const professionals = users.filter((user: any) => 
      user.roles.some((role: any) => role.id === 2)
    );
    
    return professionals;
  } catch (error) {
    console.error('Error fetching professionals:', error);
    return [];
  }
};
export const deleteAppointment = async (appointmentId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete appointment. HTTP error! status: ${response.status}`);
    }
    
    console.log('Appointment deleted successfully');
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};