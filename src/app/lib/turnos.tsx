import api from './api';
import { Appointment } from '../types/types';

// Función para crear una cita
export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
  console.log('Creating appointment:', appointment); // Log para ver los datos de la cita
  const res = await api.post('/appointments/', appointment);

  if (!res.status) {
    console.error('Failed to create appointment:', res.status, res.data); // Log para ver el estado y el error
    throw new Error('Failed to create appointment');
  }

  return res.data;
};

// Función para obtener todas las citas
export const fetchAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get('/appointments/');
    if (!response.status) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    return [];
  }
};

// Función para obtener citas por profesional
export const fetchAppointmentsByProfessional = async (professionalId: number): Promise<Appointment[]> => {
  try {
    const response = await api.get(`/appointments/professional/${professionalId}/`);
    if (!response.status) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for professional ${professionalId}:`, error);
    return [];
  }
};

// Función para obtener profesionales
export const fetchProfessionals = async () => {
  try {
    const response = await api.get('/users/');
    const users = response.data;
    
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

// Función para eliminar una cita
export const deleteAppointment = async (appointmentId: number): Promise<void> => {
  try {
    const response = await api.delete(`/appointments/${appointmentId}/`);

    if (!response.status) {
      throw new Error(`Failed to delete appointment. HTTP error! status: ${response.status}`);
    }
    
    console.log('Appointment deleted successfully');
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};
