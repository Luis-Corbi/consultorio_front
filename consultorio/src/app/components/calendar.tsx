"use client"
import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Calendar, momentLocalizer, Event, View, Messages, NavigateAction  } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';


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

const Calendario: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState<Date>(new Date());

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = window.prompt('Nombre del nuevo evento');
    if (title) {
      setEvents([
        ...events,
        {
          start,
          end,
          title,
        },
      ]);
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
    <div   className='div-calendar' style={{ height: '100vh' }}>
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
    </div>
  );
};

export default Calendario;





