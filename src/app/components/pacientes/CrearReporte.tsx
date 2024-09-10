'use client';

import { useState } from 'react';
import axios from 'axios';

interface UploadReportProps {
  patientId: string;
  token: string;
}

const UploadReport: React.FC<UploadReportProps> = ({ patientId, token }) => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>('');
  const [professionalId, setProfessionalId] = useState<string>(''); // Estado para el ID del profesional
  const [diagnosis, setDiagnosis] = useState<string>(''); 
  const [treatment, setTreatment] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'type') setType(value);
    if (name === 'diagnosis') setDiagnosis(value);
    if (name === 'treatment') setTreatment(value);
    if (name === 'professionalId') setProfessionalId(value); // Manejar cambio del ID del profesional
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('professional', professionalId); 
    formData.append('patient', patientId); 
    formData.append('date', new Date().toISOString().split('T')[0]);
    formData.append('hour', new Date().toISOString().split('T')[1].split('.')[0]);
    formData.append('type', type); 
    formData.append('diagnosis', diagnosis); 
    formData.append('treatment', treatment); 

    setLoading(true);
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/medical_reports/', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 201) {
            alert('Reporte subido exitosamente!');
            setFile(null); 
            setType('');
            setDiagnosis(''); 
            setTreatment(''); 
        } else {
            throw new Error('Error al subir el reporte.');
        }
    } catch (error) {
        console.error('Error uploading report:', error);
        setError('Error al subir el reporte.');
    } finally {
        setLoading(false);
    }
};


  return (
    <div>
      <h2>Agregar Reporte Médico</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          disabled={loading} 
        />
        <input
          type="text"
          name="professionalId"
          value={professionalId}
          onChange={handleChange}
          placeholder="ID del Profesional"
          disabled={loading}
        />
        <input
          type="text"
          name="type"
          value={type}
          onChange={handleChange}
          placeholder="Tipo de Reporte"
          disabled={loading}
        />
        <input
          type="text"
          name="diagnosis"
          value={diagnosis}
          onChange={handleChange}
          placeholder="Diagnóstico"
          disabled={loading}
        />
        <input
          type="text"
          name="treatment"
          value={treatment}
          onChange={handleChange}
          placeholder="Tratamiento"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Subiendo...' : 'Subir Reporte'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default UploadReport;
