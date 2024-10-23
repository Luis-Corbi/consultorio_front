"use client";
// grafico.tsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import moment from 'moment';
import "../sections.css"
import api from '../lib/api';

Chart.register(...registerables, ChartDataLabels);

const AppointmentsChart: React.FC<{ token: string }> = ({ token }) => {
  const [dataCount, setDataCount] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the logged-in user's ID
  const fetchLoggedInUserId = async () => {
    try {
      const response = await api.get('/user/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = response.data.id;
      setLoggedInUserId(userId); // Set the logged-in user's ID
    } catch (error) {
      console.error('Error fetching logged-in user ID:', error);
      setError('Error al obtener el usuario autenticado.');
    }
  };

  // Fetch appointments by day for the logged-in user
  const fetchAppointmentsData = async (userId: number) => {
    try {
      const response = await api.get(`/appointments-by-day/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const appointmentsData = response.data;

        // Verificar si appointmentsData es un array
        const dayData = Object.values(appointmentsData)[0];
        if (Array.isArray(dayData)) {
          setDataCount(dayData as number[]); // Asegurar que dayData es de tipo number[]
        } else {
          throw new Error('Formato de datos no válido');
        }
      } else {
        throw new Error('Error al obtener los datos de las citas.');
      }
    } catch (error) {
      console.error('Error fetching appointments data:', error);
      setError('Error al obtener los datos de las citas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoggedInUserId(); // Fetch user ID on component mount
  }, []);

  useEffect(() => {
    if (loggedInUserId !== null) {
      fetchAppointmentsData(loggedInUserId); // Fetch appointments once user ID is available
    }
  }, [loggedInUserId]);

  const data = {
    labels: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    datasets: [
      {
        label: 'Pacientes por Día',
        data: dataCount,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const todayIndex = moment().day();

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Mostrar de 1 en 1
        },
      },
      x: {
        ticks: {
          callback: (tickValue: string | number, index: number) => data.labels[index],
          color: (ctx: any) => (ctx.index === todayIndex ? 'black' : 'gray'),
          font: {
            weight: 'normal' as 'normal',
          },
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
      datalabels: {
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: (value: number) => value.toString(),
        color: (ctx: any) => (ctx.dataIndex === todayIndex ? 'black' : 'gray'),
        font: {
          weight: 'normal' as 'normal',
        },
        display: (ctx: any) => ctx.dataset.data[ctx.dataIndex] !== null,
      },
    },
  };

  return (
    <div className='grafico'>
      {loading && <p>Cargando datos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && <Line data={data} options={options} />}
    </div>
  );
};

export default AppointmentsChart;
