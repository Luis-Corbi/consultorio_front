"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event, View, Messages, NavigateAction } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { createAppointment, fetchAllAppointments, fetchAppointmentsByProfessional,fetchProfessionals,deleteAppointment} from '../lib/turnos';
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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null); // Estado para el turno seleccionado
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    professional: 1,
    patient: 2,
    date: '',
    hour: '',
    status: 'scheduled',
    notes: ''
  });

  // Función para cargar los profesionales
  const loadProfessionals = async () => {
    try {
      const fetchedProfessionals = await fetchProfessionals();
      setProfessionals(fetchedProfessionals);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    }
  };

  // Función para cargar los turnos
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
        const color = professional ? professional.color : '#000000'; // Color por defecto si no se encuentra el profesional

        return {
          start: new Date(`${appointment.date}T${appointment.hour}`),
          end: new Date(new Date(`${appointment.date}T${appointment.hour}`).getTime() + 30 * 60000),
          title: appointment.notes,
          appointment,
          color // Añade el color al evento
        };
      });
      setEvents(events);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Cargar profesionales y pacientes al montar el componente
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

  // Cargar turnos cuando se selecciona un profesional o cambian los profesionales
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
    setSelectedProfessional(selectedId || null); // Asegúrate de que se maneja correctamente el valor null
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        console.log('Submitting new appointment:', newAppointment);
        const savedAppointment = await createAppointment(newAppointment);
        console.log('Saved appointment:', savedAppointment);
        
        // Crear las fechas de inicio y fin usando moment para asegurar la consistencia
        const start = moment(`${savedAppointment.date}T${savedAppointment.hour}`).toDate();
        const end = moment(start).add(15, 'minutes').toDate(); // Duración de 30 minutos

        const newEvent: CustomEvent = {
            start,
            end,
            title: savedAppointment.notes,
            appointment: savedAppointment,
            color: professionals.find(p => p.id === savedAppointment.professional)?.color || '#3174ad', // Asignar color
        };

        setEvents([...events, newEvent]);
        setModalIsOpen(false);
        
        // Recargar turnos y profesionales
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
    setIsViewingAppointment(true); // Indica que se está visualizando un turno
    setModalIsOpen(true);
  };

  const handleNavigate = (newDate: Date, view: View, action: NavigateAction) => {
    setDate(newDate);
  };

  const getProfessionalName = (id: number) => {
    const professional = professionals.find(p => p.id === id);
    return professional ? `${professional.name} ${professional.lastname}` : 'Profesional no encontrado';
  };
  
  // Función para obtener el nombre completo del paciente a partir de su ID
  const getPatientName = (id: number) => {
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.name} ${patient.lastname}` : 'Paciente no encontrado';
  };
  
 
  // Funcion delete 
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment || selectedAppointment.id === undefined) return;
    
    setIsConfirmDeleteOpen(true); 
  };

  const confirmDeleteAppointment = async () => {
    if (!selectedAppointment || selectedAppointment.id === undefined) return;

    try {
      await deleteAppointment(selectedAppointment.id);

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
      backgroundColor: event.color || '#3174ad', // Usa el color del evento o un color por defecto
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
      {/* Modal de Confirmación de Eliminación */}
      <ModalAlert
        isOpen={isConfirmDeleteOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={confirmDeleteAppointment}
      />
  
      {/* Filtro por Profesional */}
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
  
      {/* Calendario */}
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
        step={15} // Cada celda del calendario representa 15 minutos
        timeslots={4} // Cada hora se divide en 4 timeslots de 15 minutos
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
  
      {/* Modal de Detalles del Turno */}
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
              <button type="button" onClick={handleDeleteAppointment} className="delete-button">Eliminar Turno</button>
            </div>
          </div>
        </div>
      )}
  
      {/* Modal para Nuevo Turno */}
      {modalIsOpen && !isViewingAppointment && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
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
                <input type="date" name="date" value={newAppointment.date} onChange={handleInputChange} />
              </label>
              <label>
                Hora:
                <input type="time" name="hour" value={newAppointment.hour} onChange={handleInputChange} />
              </label>
              <label>
                Notas:
                <textarea name="notes" value={newAppointment.notes} onChange={handleInputChange}></textarea>
              </label>
              <div className='botones-modal'>
                <button type="submit">Guardar Turno</button>
                <button type="button" onClick={handleCloseModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Calendario;