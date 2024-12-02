import api from './api';
import { Appointment, User } from '../types/types';

// Función para crear un turno
export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
  try {
    const res = await api.post('/appointments/', appointment);
    return res.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Función para obtener todos los turnos
export const fetchAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const res = await api.get('/appointments/');
    return res.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Función para obtener turnos por profesional
export const fetchAppointmentsByProfessional = async (professionalId: number): Promise<Appointment[]> => {
  try {
    const res = await api.get(`/appointments/professional/${professionalId}/`);
    return res.data;
  } catch (error) {
    console.error('Error fetching appointments by professional:', error);
    throw error;
  }
};

// Función para obtener profesionales
export const fetchProfessionals = async (): Promise<User[]> => {
  try {

    const response = await api.get('/users/');
    const users = response.data;
    
    // Filtra los usuarios para obtener solo los profesionales
    const professionals = users.filter((user: any) => 
      user.roles.some((role: any) => role.id === 1)
    );
    
    return professionals;
  } catch (error) {
    console.error('Error fetching professionals:', error);
    throw error;
  }
};

// Función para borrar un turno (borrado lógico)
export const softDeleteAppointment = async (appointmentId: number): Promise<void> => {
  try {
    await api.delete(`/appointments/${appointmentId}/`);
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};
