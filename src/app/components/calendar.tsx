"use client"
import axios from 'axios';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event, View, Messages, NavigateAction } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { createAppointment, fetchAllAppointments, fetchAppointmentsByProfessional, fetchProfessionals, softDeleteAppointment } from '../lib/turnos';
import { fetchUsersByRole } from '../lib/pacientes';
import { Appointment, User } from '../types/types';
import './Calendario.css'; 
import ModalAlert from './modalAlert';

moment.locale('es');
const localizer = momentLocalizer(moment);

const messages: Messages = {
  allDay: 'Todo el día',
  previous: 'Atrás',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango',
  showMore: total => `+ Ver más (${total})`
};

interface CustomEvent extends Event {
  appointment: Appointment;
  color?: string; 
}

interface CalendarioProps {
  defaultView: View;
}

const Calendario: React.FC<{ defaultView: View }> = ({ defaultView }) => {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [view, setView] = useState<View>(defaultView);
  const [date, setDate] = useState<Date>(new Date());
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [isViewingAppointment, setIsViewingAppointment] = useState<boolean>(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    professional: 1,
    patient: 2,
    date: '',
    hour: '',
    status: 'scheduled',
    notes: ''
  });

  // Cargar profesionales
  const loadProfessionals = async () => {
    try {
      const fetchedProfessionals = await fetchProfessionals();
      console.log('Fetched professionals:', fetchedProfessionals); // Log para verificar los datos
      setProfessionals(fetchedProfessionals);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    }
  };
  

  // Cargar turnos
  const loadAppointments = async () => {
    try {
      let appointments: Appointment[] = [];
      if (selectedProfessional) {
        appointments = await fetchAppointmentsByProfessional(selectedProfessional);
      } else {
        appointments = await fetchAllAppointments();
      }
      const events = appointments.map(appointment => {
        const professional = professionals.find(p => p.id === appointment.professional);
        const color = professional ? professional.color : '#000000';
        return {
          start: new Date(`${appointment.date}T${appointment.hour}`),
          end: new Date(new Date(`${appointment.date}T${appointment.hour}`).getTime() + 30 * 60000),
          title: appointment.notes,
          appointment,
          color
        };
      });
      setEvents(events);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    loadProfessionals();
    const loadUsers = async () => {
      try {
        const fetchedPatients = await fetchUsersByRole(3); // Rol de paciente
        setPatients(fetchedPatients);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [selectedProfessional, professionals]);

  const handleSelectSlot = ({ start }: { start: Date }) => {

    const now = new Date();
    const selectedDate = new Date(start);
    
    // Verificar si la fecha seleccionada ya pasó
    if (selectedDate < now) {
      // Si la fecha ya pasó, permitir ver los detalles de los turnos
      setSelectedAppointment(null); // Asegúrate de que no haya un turno seleccionado
      setIsViewingAppointment(true); // Indica que se está visualizando un turno pasado
      setModalIsOpen(true); // Abre el modal para ver detalles
    } else {
      // Si la fecha es válida y no ha pasado, permitir la creación del turno
      setNewAppointment({
        ...newAppointment,
        date: moment(start).format('YYYY-MM-DD'),
        hour: moment(start).format('HH:mm:ss')
      });
      setIsViewingAppointment(false); // Asegúrate de que no se está viendo un turno pasado
      setModalIsOpen(true); // Abre el modal para crear un nuevo turno
    }

  };
  
  

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name}, New value: ${value}`);
    setNewAppointment({
      ...newAppointment,
      [name]: value
    });
};
  const handleProfessionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    setSelectedProfessional(selectedId || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentDateTime = new Date(`${newAppointment.date}T${newAppointment.hour}`);
    const now = new Date();
  
    if (appointmentDateTime < now) {
      alert("No puedes crear un turno en una fecha y hora pasada.");
      return;
    }
  
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 90);
    if (appointmentDateTime > maxDate) {
      alert('No puedes crear una fecha más allá de los próximos 90 días.');
      return; 
    }
  
    const appointmentHour = appointmentDateTime.getHours();
    const appointmentMinutes = appointmentDateTime.getMinutes();
  
    const isInFirstInterval = (appointmentHour > 9 || (appointmentHour === 9 && appointmentMinutes >= 0)) &&
                              (appointmentHour < 13 || (appointmentHour === 13 && appointmentMinutes === 0));
  
    const isInSecondInterval = (appointmentHour > 16 || (appointmentHour === 16 && appointmentMinutes >= 30)) &&
                               (appointmentHour < 20 || (appointmentHour === 20 && appointmentMinutes <= 30));
  
    if (!isInFirstInterval && !isInSecondInterval) {
      alert("Solo puedes crear turnos entre 09:00-13:00 y 16:30-20:30.");
      return;
    }
  
    try {

      console.log('Submitting new appointment:', newAppointment);
      const savedAppointment = await createAppointment(newAppointment);
      console.log('Saved appointment:', savedAppointment);
  
      const start = moment(`${savedAppointment.date}T${savedAppointment.hour}`).toDate();
      const end = moment(start).add(15, 'minutes').toDate();
  
      const newEvent: CustomEvent = {
        start,
        end,
        title: savedAppointment.notes,
        appointment: savedAppointment,
        color: professionals.find(p => p.id === savedAppointment.professional)?.color || '#3174ad',
      };
  
      setEvents([...events, newEvent]);
      setModalIsOpen(false);
  
      await loadAppointments();
      await loadProfessionals();
  
      alert('Turno guardado correctamente');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al guardar el turno:', error.response?.data);
        alert(`Error al guardar el turno: ${error.response?.data?.detail || 'Error desconocido'}`);
      } else {
        console.error('Error inesperado:', error);
        alert('Error inesperado al guardar el turno');
      }
    }
  };
  

  const handleSelectEvent = (event: CustomEvent) => {
    const currentDate = new Date();
    const appointmentDate = new Date(event.appointment.date);
  
    // Establece el turno seleccionado y abre el modal para verlo
    setSelectedAppointment(event.appointment);
    setIsViewingAppointment(true);
    setModalIsOpen(true);
  };

  const handleNavigate = (newDate: Date, view: View, action: NavigateAction) => {
    setDate(newDate);
  };

  const getProfessionalName = (id: number) => {
    const professional = professionals.find(p => p.id === id);
    return professional ? `${professional.name} ${professional.lastname}` : 'Profesional no encontrado';
  };

  const getPatientName = (id: number) => {
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.name} ${patient.lastname}` : 'Paciente no encontrado';
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment || selectedAppointment.id === undefined) return;
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteAppointment = async () => {
    if (!selectedAppointment || selectedAppointment.id === undefined) return;
    try {
      await softDeleteAppointment(selectedAppointment.id);
      setEvents(events.filter(event => event.appointment.id !== selectedAppointment.id));
      setModalIsOpen(false);
      setIsConfirmDeleteOpen(false);
      alert('Turno eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el turno:', error);
      alert('Error al eliminar el turno');
    }
  };

  const closeConfirmDeleteModal = () => {
    setIsConfirmDeleteOpen(false);
  };

  const eventStyleGetter = (event: CustomEvent) => {
    const style = {
      backgroundColor: event.color || '#3174ad',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: 'none'
    };
    return {
      style
    };
  };

  return (
    <div className='div-calendar' style={{ height: '80vh' }}>
      <ModalAlert isOpen={isConfirmDeleteOpen} onClose={closeConfirmDeleteModal} onConfirm={confirmDeleteAppointment} />

      <label className='filtro-prof'>
        Filtrar por profesional:
        <select value={selectedProfessional ?? ''} onChange={handleProfessionalChange}>
          <option value="">Todos</option>
          {professionals.map(professional => (
            <option key={professional.id} value={professional.id}>
              {professional.name} {professional.lastname}
            </option>
          ))}
        </select>
      </label>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={['month', 'week', 'day']}
        view={view}
        onView={(view) => setView(view)}
        step={15}
        timeslots={4}
        showMultiDayTimes
        defaultDate={new Date()}
        date={date}
        onNavigate={handleNavigate}
        min={new Date(1970, 1, 1, 8, 0)}
        max={new Date(1970, 1, 1, 20, 30)}
        toolbar={true}
        messages={messages}
        eventPropGetter={eventStyleGetter}
      />

      {modalIsOpen && isViewingAppointment && selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Detalles del Turno</h2>
            <div className='div-modal'>
              <p><strong>Profesional:</strong> {getProfessionalName(selectedAppointment.professional)}</p>
              <p><strong>Paciente:</strong> {getPatientName(selectedAppointment.patient)}</p>
              <p><strong>Fecha:</strong> {selectedAppointment.date}</p>
              <p><strong>Hora:</strong> {selectedAppointment.hour}</p>
              <p><strong>Notas:</strong> {selectedAppointment.notes}</p>
            </div>
            <div className='botones-modal'>
              <button type="button" onClick={handleCloseModal}>Cerrar</button>
              {/* Mostrar el botón de eliminar solo si la fecha del turno no ha pasado */}
              {new Date(selectedAppointment.date) >= new Date() && (
                <button type="button" onClick={handleDeleteAppointment} className="delete-button">Eliminar Turno</button>
              )}
            </div>
          </div>
        </div>
      )}

      {modalIsOpen && !isViewingAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h2>Nuevo Turno</h2>
            <form onSubmit={handleSubmit}>

            <label>
                Profesional:
                <select name="professional" value={newAppointment.professional} onChange={handleInputChange}>
                  {professionals.map(professional => (
                    <option key={professional.id} value={professional.id}>
                      {professional.name} {professional.lastname}

                    </option>
                  ))}
                </select>
              </label>

               <label>
                Paciente:
                <select name="patient" value={newAppointment.patient} onChange={handleInputChange}>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} {patient.lastname}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Fecha:
                <input className='input-calendar' type="date" name="date" value={newAppointment.date} onChange={handleInputChange} />
              </label>
              <label>
                Hora:
                <input className='input-calendar' type="time" name="hour" value={newAppointment.hour} onChange={handleInputChange} />
              </label>
              <label>
                Notas:
                <textarea
                  name="notes"
                  value={newAppointment.notes}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">Guardar Turno</button>
              <button type="button" onClick={handleCloseModal}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
