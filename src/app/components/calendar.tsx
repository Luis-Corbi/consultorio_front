"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event, View, Messages, NavigateAction } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { createAppointment, fetchAppointments } from '../lib/turnos';
import { Appointment } from '../types/types';
import './Calendario.css'; // Importa el archivo CSS con los estilos del modal

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

interface CalendarioProps {
  defaultView: View;
}

const Calendario: React.FC<CalendarioProps> = ({ defaultView }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<View>(defaultView);
  const [date, setDate] = useState<Date>(new Date());
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    professional: 1,
    patient: 2,
    date: '',
    hour: '',
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const appointments = await fetchAppointments();
        const events = appointments.map(appointment => ({
          start: new Date(appointment.date + 'T' + appointment.hour),
          end: new Date(new Date(appointment.date + 'T' + appointment.hour).getTime() + 30 * 60000), // Duración de 30 minutos
          title: appointment.notes
        }));
        setEvents(events);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    loadAppointments();
  }, []);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setNewAppointment({
      ...newAppointment,
      date: moment(start).format('YYYY-MM-DD'),
      hour: moment(start).format('HH:mm:ss')
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting new appointment:', newAppointment);
      const savedAppointment = await createAppointment(newAppointment);
      console.log('Saved appointment:', savedAppointment);
      setEvents([
        ...events,
        {
          start: new Date(savedAppointment.date + 'T' + savedAppointment.hour),
          end: new Date(new Date(savedAppointment.date + 'T' + savedAppointment.hour).getTime() + 30 * 60000), // Duración de 30 minutos
          title: savedAppointment.notes
        }
      ]);
      setModalIsOpen(false);
      alert('Turno guardado correctamente');
    } catch (error) {
      console.error('Error al guardar el turno:', error);
      alert('Error al guardar el turno');
    }
  };

  const handleSelectEvent = (event: Event) => {
    if (window.confirm(`Eliminar evento '${event.title}'`)) {
      setEvents(events.filter((e) => e !== event));
    }
  };

  const handleNavigate = (newDate: Date, view: View, action: NavigateAction) => {
    setDate(newDate);
  };

  return (
    <div className='div-calendar' style={{ height: '90vh' }}>
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
      />
      {modalIsOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Nuevo Turno</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Profesional:
                <input type="number" name="professional" value={newAppointment.professional} onChange={handleInputChange} />
              </label>
              <label>
                Paciente:
                <input type="number" name="patient" value={newAppointment.patient} onChange={handleInputChange} />
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
              <button type="submit">Guardar Turno</button>
              <button type="button" onClick={handleCloseModal}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
