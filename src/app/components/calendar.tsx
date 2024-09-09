"use client"
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
    setNewAppointment({
      ...newAppointment,
      date: moment(start).format('YYYY-MM-DD'),
      hour: moment(start).format('HH:mm:ss')
    });
    setIsViewingAppointment(false);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
    try {
      const savedAppointment = await createAppointment(newAppointment);

      const start = moment(`${savedAppointment.date}T${savedAppointment.hour}`).toDate();
      const end = moment(start).add(30, 'minutes').toDate();

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
      console.error('Error al guardar el turno:', error);
      alert('Error al guardar el turno');
    }
  };

  const handleSelectEvent = (event: CustomEvent) => {
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
        min={new Date(1970, 1, 1, 9, 0)}
        max={new Date(1970, 1, 1, 20, 30)}
        toolbar={true}
        messages={messages}
        eventPropGetter={eventStyleGetter}
      />

      {modalIsOpen && isViewingAppointment && selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h2>Ver Turno</h2>
            <p>Paciente: {getPatientName(selectedAppointment.patient)}</p>
            <p>Profesional: {getProfessionalName(selectedAppointment.professional)}</p>
            <p>Fecha: {selectedAppointment.date}</p>
            <p>Hora: {selectedAppointment.hour}</p>
            <p>Notas: {selectedAppointment.notes}</p>
            <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
            <button onClick={handleDeleteAppointment}>Eliminar Turno</button>
          </div>
        </div>
      )}

      {modalIsOpen && !isViewingAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h2>Nuevo Turno</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Paciente:
                <select
                  name="patient"
                  value={newAppointment.patient}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar Paciente</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} {patient.lastname}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Profesional:
                <select
                  name="professional"
                  value={newAppointment.professional}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar Profesional</option>
                  {professionals.map(professional => (
                    <option key={professional.id} value={professional.id}>
                      {professional.name} {professional.lastname}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Fecha: {moment(newAppointment.date).format('DD/MM/YYYY')}
              </label>
              <label>
                Hora: {moment(newAppointment.hour, 'HH:mm:ss').format('HH:mm')}
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
