'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import './medicalreport.css';
import { fetchUsersByRole } from '@/app/lib/pacientes';

interface MedicalReport {
  id: number;
  professional: number; // Asegúrate de que sea un número
  patient: string;
  date: string;
  hour: string;
  type: string;
  diagnosis: string;
  treatment: string;
  file: string;
}

interface Professional {
  id: number;
  name: string;
}

interface MedicalReportsProps {
  patientId: string;
  token: string;
}

const MedicalReports: React.FC<MedicalReportsProps> = ({ patientId, token }) => {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null); // Cambia el tipo a número
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/medical_reports/by_patient/?patient=${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setReports(response.data); // Almacena todos los reportes para este paciente
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

  useEffect(() => {
    fetchReports(); // Llama a la función para obtener los reportes del paciente
  }, [patientId, token]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const users = await fetchUsersByRole(1); // Filtra por rol de profesional
        setProfessionals(users); // Asigna los profesionales obtenidos
      } catch (error) {
        console.error('Error fetching professionals:', error);
        setError('Error al obtener la lista de profesionales.');
      }
    };

    fetchProfessionals(); // Ejecuta la función de forma asíncrona
  }, [token]);

  const handleProfessionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProfessional(value ? Number(value) : null); // Convierte a número o establece a null
  };

  const filteredReports = selectedProfessional !== null
    ? reports.filter(report => report.professional === selectedProfessional)
    : reports;

  if (loading) return <p>Cargando reportes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="reports-container">
      <h2>Reportes Médicos</h2>
      <div>
        <label htmlFor="professional-select">Filtrar por Profesional:</label>
        <select id="professional-select" value={selectedProfessional || ''} onChange={handleProfessionalChange}>
          <option value="">Selecciona un profesional</option>
          {professionals.map((professional) => (
            <option key={professional.id} value={professional.id}>
              {professional.name}
            </option>
          ))}
        </select>
      </div>
      {filteredReports.length > 0 ? (
        <table className="timeline-table">
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="timeline-row">
                <td className="timeline-icon"></td>
                <td className="timeline-content">
                  <p><strong>Fecha:</strong> {report.date}</p>
                  <p><strong>Hora:</strong> {report.hour}</p>
                  <p><strong>Tipo:</strong> {report.type}</p>
                  <p><strong>Diagnóstico:</strong> {report.diagnosis}</p>
                  <p><strong>Tratamiento:</strong> {report.treatment}</p>
                  {report.file && (
                    <a href={`http://127.0.0.1:8000${report.file}`} target="_blank" rel="noopener noreferrer">
                      {report.file.split('/').pop()}
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay reportes médicos disponibles para este paciente.</p>
      )}
    </div>
  );
};

export default MedicalReports;
