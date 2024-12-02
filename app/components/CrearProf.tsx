import React, { useState, useEffect } from 'react';
import { createUser, getSpecialities } from '../lib/pacientes'; 
import { User, Speciality } from '../types/types';
import "../pacientes/pacientes.css";
import api from '../lib/api';

interface CrearPacienteFormProps {
    onClose: () => void;
    onCreate: () => void;
}

const CrearProfesionalForm: React.FC<CrearPacienteFormProps> = ({ onClose, onCreate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [dni, setDni] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState<string>('');
    const [birthDate, setBirthDate] = useState('');
    const [healthInsurance, setHealthInsurance] = useState('');
    const [healthInsuranceNumber, setHealthInsuranceNumber] = useState('');
    const [licenceNumber, setLicenceNumber] = useState('');
    const [speciality, setSpeciality] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [color, setColor] = useState<string>('#ffffff');
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
  
    useEffect(() => {
      const fetchSpecialities = async () => {
        try {
          const data = await getSpecialities();
          setSpecialities(data);
        } catch (error) {
            console.error('Error fetching specialities:', error);
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
            roles: [1], 
            color
          };
      
          console.log('Submitting user:', newUser);

          await api.post('users/', newUser, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`, 
            },
          });
          onCreate(); 
          onClose();
        } catch (error) {
          console.error('Error creating user:', error);
        }
      };
    
      const getAuthToken = () => {
        return document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1] || '';
      };

    return (
        <div className="relative bg-white rounded-lg p-5 z-[1001] w-[60%] max-w-4xl mx-auto justify-center items-center overflow-y-auto max-h-[60%]">
                <h2 className="mt-0 text-md text-center text-green-200 sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl">Crear Profesional</h2>
                <form onSubmit={handleSubmit} className='justify-center items-center'>
                    <div className="w-[100%] justify-center items-center grid grid-cols-1 md:grid-cols-2 md:gap-4">
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Nombre de usuario:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Contraseña:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Nombre:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Apellido:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>DNI:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="text" value={dni} onChange={(e) => setDni(e.target.value)} required />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Teléfono:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Email:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Dirección:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div> 
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Género:</label>
                            <select className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' value={gender} onChange={(e) => setGender(e.target.value)} required >
                                <option value="">Selecciona un género</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Fecha de Nacimiento:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Seguro Médico:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="text" value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Número de Seguro Médico:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="text" value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Número de Licencia:</label>
                            <input className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]' type="text" value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} />
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Especialidad:
                            <select className="select-form w-[100%] m-0"  value={speciality} onChange={(e) => setSpeciality(e.target.value)} required>
                              <option value="">Selecciona una especialidad</option>
                              {specialities.map((speciality) => (
                                  <option key={speciality.id} value={speciality.id}>
                                    {speciality.name}
                                </option>
                                ))}
                            </select>
                            </label>
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Color:</label>
                            <input 
                            className='bg-gray-100 p-1 text-sm w-[100%] mb-[1px]'
                            type="color" 
                            value={color} 
                            onChange={(e) => setColor(e.target.value)}/>
                        </div>
                        <div className='flex flex-col'>
                            <label className='w-[100%] text-sm'>Notas:</label>
                            <textarea className='bg-gray-100 p-1 m-0 text-sm w-[100%] h-[30px]' value={notes} onChange={(e) => setNotes(e.target.value)} />
                        </div>
                        
                    </div>
                    <div className="flex items-center justify-center space-x-4 mt-1 md:mt-4">
                            <button className="bg-green-200 text-white w-[50%] px-3 py-1 mt-2 border border-[#8EDAD5] rounded-[5px] cursor-pointer hover:bg-[#a6dad6]" type="submit">Crear</button>
                            <button className="bg-gray-300 text-white w-[50%] px-3 py-1 mt-2 border border-[#8EDAD5] rounded-[5px] cursor-pointer hover:bg-[#a6dad6]" type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            
        </div>
    );
};
export default CrearProfesionalForm;
