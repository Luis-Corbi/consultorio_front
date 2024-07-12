// src/lib/appointments.ts

import { Appointment, User } from '../types/types';

export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
  console.log('Creating appointment:', appointment); // Log para ver los datos de la cita
  const res = await fetch('http://127.0.0.1:8000/api/appointments/', {
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

export const findOrCreatePatient = async (name: string, lastname: string): Promise<User> => {
  let res = await fetch(`http://127.0.0.1:8000/api/users/?name=${name}&lastname=${lastname}`);

  if (res.ok) {
    const patients: User[] = await res.json();
    if (patients.length > 0) {
      return patients[0];
    }
  }

  // Si no se encuentra el paciente, crear uno nuevo
  console.log('Creating new patient:', { name, lastname }); // Log para ver los datos del nuevo paciente
  res = await fetch('http://127.0.0.1:8000/api/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      lastname,
      roles: [{ id: 3, name: 'patient' }],
      // Agregar otros campos necesarios para crear un usuario
    })
  });

  if (!res.ok) {
    const errorText = await res.text(); // Obtener el texto del error
    console.error('Failed to create patient:', res.status, errorText); // Log para ver el estado y el error
    throw new Error('Failed to create patient');
  }

  return res.json();
};
