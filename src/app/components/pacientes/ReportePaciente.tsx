'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface MedicalReport {
  id: number;
  professional: string;
  patient: string;
  date: string;
  hour: string;
  type: string;
  diagnosis: string;
  treatment: string;
  file: string;
}

interface MedicalReportsProps {
  patientId: string;
  token: string;
}

const MedicalReports: React.FC<MedicalReportsProps> = ({ patientId, token }) => {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/medical_reports/by_patient/?patient=${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response.data); // Log the data to inspect
        if (response.status === 200) {
          setReports(response.data);
        } else {
          throw new Error('Error al obtener los reportes médicos.');
        }
      } catch (error) {
        console.error('Error fetching medical reports:', error);
        setError('Error al obtener los reportes médicos.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchReports();
  }, [patientId, token]);

  if (loading) return <p>Cargando reportes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Reportes Médicos</h2>
      {reports.length > 0 ? (
        <ul>
          {reports.map((report) => (
            <li key={report.id}>
              <p>Fecha: {report.date}</p>
              <p>Hora: {report.hour}</p>
              <p>Tipo: {report.type}</p>
              <p>Diagnóstico: {report.diagnosis}</p>
              <p>Tratamiento: {report.treatment}</p>
              {report.file && (
                <a href={`http://127.0.0.1:8000${report.file}`} target="_blank" rel="noopener noreferrer">
                  {report.file.split('/').pop()}
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reportes médicos disponibles para este paciente.</p>
      )}
    </div>
  );
};

export default MedicalReports;
