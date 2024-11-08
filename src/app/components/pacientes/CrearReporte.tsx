'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface UploadReportProps {
  patientId: string;
  token: string;
}

const UploadReport: React.FC<UploadReportProps> = ({ patientId, token }) => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>('');
  const [professionalId, setProfessionalId] = useState<string>(''); 
  const [diagnosis, setDiagnosis] = useState<string>(''); 
  const [treatment, setTreatment] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfessionalId(response.data.id);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, [token]);

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

            window.location.reload();
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
      <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
        <input  
          className='p-[10px] border border-gray-500 rounded-[4px] transition-all duration-300 ease-in-out w-[100%]'
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          disabled={loading} 
        />
        
        <input
          className='p-[10px] border border-gray-500 rounded-[4px] transition-all duration-300 ease-in-out w-[100%]'
          type="text"
          name="type"
          value={type}
          onChange={handleChange}
          placeholder="Tipo de Reporte"
          disabled={loading}
        />
        <input
          className='p-[10px] border border-gray-500 rounded-[4px] transition-all duration-300 ease-in-out w-[100%]'
          type="text"
          name="diagnosis"
          value={diagnosis}
          onChange={handleChange}
          placeholder="Diagnóstico"
          disabled={loading}
        />
        <input
          className='p-[10px] border border-gray-500 rounded-[4px] transition-all duration-300 ease-in-out w-[100%]'
          type="text"
          name="treatment"
          value={treatment}
          onChange={handleChange}
          placeholder="Tratamiento"
          disabled={loading}
        />
        <button className='w-full no-underline text-white flex justify-center items-center bg-[#8EDAD5] border border-[#8EDAD5] rounded-[5px] cursor-pointer h-[38px]' type="submit" disabled={loading}>
          {loading ? 'Subiendo...' : 'Subir Reporte'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default UploadReport;
