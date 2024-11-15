'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import { fetchUsersByRole } from '@/app/lib/pacientes';

interface MedicalReport {
  id: number;
  professional: number; 
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
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null); 
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

  useEffect(() => {
    fetchReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, token]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const users = await fetchUsersByRole(1); 
        setProfessionals(users);
      } catch (error) {
        console.error('Error fetching professionals:', error);
        setError('Error al obtener la lista de profesionales.');
      }
    };

    fetchProfessionals();
  }, [token]);

  const handleProfessionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProfessional(value ? Number(value) : null);
  };

  const filteredReports = selectedProfessional !== null
    ? reports.filter(report => report.professional === selectedProfessional)
    : reports;

  if (loading) return <p>Cargando reportes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
      <div className="max-w-lg p-2 lg:max-h-[70vh] lg:overflow-y-scroll">

      <h2 className="text-xl font-semibold mb-4 text-center">Reportes Médicos</h2>
      <div className="mb-6">
        <label htmlFor="professional-select" className="block mb-2 font-medium">Filtrar por Profesional:</label>
        <select
          id="professional-select"
          value={selectedProfessional || ''}
          onChange={handleProfessionalChange}
          className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring focus:ring-[#0177a9] transition"
        >
          <option value="">Selecciona un profesional</option>
          {professionals.map((professional) => (
            <option key={professional.id} value={professional.id} className="p-2">
              {professional.name}
            </option>
          ))}
        </select>
      </div>
      {filteredReports.length > 0 ? (
        <table className="w-full border-collapse">
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={report.id} className="relative">
                <td className="w-12 align-top relative">
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#037171] rounded-full z-10"></div>
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 bg-gray-300 w-[2px] ${
                      index === 0 ? 'top-1/2' : 'top-0'
                    } ${index === filteredReports.length - 1 ? 'h-1/2' : 'bottom-0'}`}
                  ></div>
                </td>
                <td className="pl-5">
                  <p className="mb-1"><strong>Fecha:</strong> {report.date}</p>
                  <p className="mb-1"><strong>Hora:</strong> {report.hour}</p>
                  <p className="mb-1"><strong>Tipo:</strong> {report.type}</p>
                  <p className="mb-1"><strong>Diagnóstico:</strong> {report.diagnosis}</p>
                  <p className="mb-1"><strong>Tratamiento:</strong> {report.treatment}</p>
                  {report.file && (
                    <a
                      href={`http://127.0.0.1:8000${report.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#037171] hover:underline"
                    >
                      {report.file.split('/').pop()}
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">No hay reportes médicos disponibles para este paciente.</p>
      )}
    </div>
  );
};

export default MedicalReports;