import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { getSpecialities } from '../lib/pacientes'; 
import { Speciality } from '../types/types';
import "../pacientes/pacientes.css";
import api from '../lib/api';

interface CrearPacienteFormProps {
  onClose: () => void;
}

const CrearPacienteForm: React.FC<CrearPacienteFormProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [dni, setDni] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('');
  const [healthInsuranceNumber, setHealthInsuranceNumber] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');
  const [speciality, setSpeciality] = useState<string>('4');
  const [notes, setNotes] = useState('');
  const [specialities, setSpecialities] = useState<Speciality[]>([]);

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const data = await getSpecialities();
        setSpecialities(data);
      } catch (error) {
        console.error('Failed to fetch specialities:', error);
      }
    };

    fetchSpecialities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const newUser = {
        username,
        password,
        name,
        lastname,
        DNI: dni,
        telephone,
        email,
        address,
        gender,
        birth_date: birthDate,
        health_insurance: healthInsurance,
        health_insurance_number: healthInsuranceNumber,
        licence_number: licenceNumber,
        speciality: parseInt(speciality),
        notes,
        roles: [3],
      };
  
      console.log('Submitting user:', newUser);
  
      await api.post('users/',
        newUser,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          },
        }
      );
  
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to create user:', error.response ? error.response.data : error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };
  

  const getAuthToken = () => {
    return document.cookie.split('; ').find(row => row.startsWith('access_token='))
      ?.split('=')[1] || '';
  };

  return (
    <div className="relative bg-white rounded-lg p-5 z-[1001] w-[60%] max-w-4xl mx-auto justify-center items-center overflow-y-auto max-h-[60%]">
        <h2 className="mt-0 text-md text-center text-green-200 sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl">Crear Paciente</h2>
        <form onSubmit={handleSubmit} className='justify-center items-center'>
          <div className="w-[95%] grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className='flex flex-col'>
              <label className='text-sm'>Nombre de usuario:</label>
              <input className='bg-gray-100 p-1 text-sm w-[95%] mb-[1px]' type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Contraseña:</span>
              <input className='bg-gray-100 p-1 text-sm w-[95%] mb-[1px]' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Nombre:</span>
              <input className='bg-gray-100 p-1 text-sm w-[95%] mb-[1px]' type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Apellido:</span>
              <input className='bg-gray-100 p-1 text-sm w-[95%] mb-[1px]' type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>DNI:</span>
              <input className='bg-gray-100 p-1 text-sm w-[95%]' type="text" value={dni} onChange={(e) => setDni(e.target.value)} required />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Teléfono:</span>
              <input className='bg-gray-100 p-1 text-sm w-[95%]' type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Email:</span>
              <input className='bg-gray-100 p-1 text-sm w-[95%]' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Dirección:</span>
              <input className='bg-gray-100 p-1 text-sm w-[95%]' type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Género:</span>
              <select className='select-form p-1 bg-gray-100 text-sm w-[95%]' value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Selecciona un género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Fecha de Nacimiento:</span>
              <input className='bg-gray-100 p-1 text-sm w-[95%]' type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Seguro Médico:</span>
              <input className='bg-gray-100 p-1 text-sm w-[95%]' type="text" value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Número de Seguro Médico:</span>
              <input className='bg-gray-100 p-1 text-sm w-[95%]' type="text" value={healthInsuranceNumber} onChange={(e) => setHealthInsuranceNumber(e.target.value)} />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Notas:</span>
              <textarea className='bg-gray-100 p-1 text-sm w-[95%] h-[30px]' value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="flex items-center justify-around mt-2">
              <button className="bg-green-200 text-white w-auto px-3 py-1 mt-2 border border-[#8EDAD5] rounded-[5px] cursor-pointer hover:bg-[#a6dad6]" type="submit">Crear</button>
              <button className="bg-gray-300 text-white w-auto px-3 py-1 mt-2 border border-[#8EDAD5] rounded-[5px] cursor-pointer hover:bg-[#a6dad6]" type="button" onClick={onClose}>Cancelar</button>
            </div>
          </div>
        </form>
    </div>
  );
};

export default CrearPacienteForm;
