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
        <div className="modal-container">
            
                <h2 className="modal-title">Crear Profesional</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <label>
                        Nombre de usuario:
                        <input className='input-table-paciente' type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </label>
                    <label>
                        Contraseña:
                        <input className='input-table-paciente' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <label>
                        Nombre:
                        <input className='input-table-paciente' type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                    <label>
                        Apellido:
                        <input className='input-table-paciente' type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                    </label>
                    <label>
                        DNI:
                        <input className='input-table-paciente' type="text" value={dni} onChange={(e) => setDni(e.target.value)} required />
                    </label>
                    <label>
                        Teléfono:
                        <input className='input-table-paciente' type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
                    </label>
                    <label>
                        Email:
                        <input className='input-table-paciente' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Dirección:
                        <input className='input-table-paciente' type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </label>
                    <label>
                        Género:
                        <select className='select-form' value={gender} onChange={(e) => setGender(e.target.value)} required>
                        <option value="">Selecciona un género</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">No binario</option>
                        </select>
                    </label>
                    <label>
                        Fecha de Nac.:
                        <input className='input-table-paciente' type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                    </label>
                    <label>
                        Seguro Médico:
                        <input className='input-table-paciente' type="text" value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} />
                    </label>
                    <label>
                        Número de Seguro Médico:
                        <input className='input-table-paciente' type="text" value={healthInsuranceNumber} onChange={(e) => setHealthInsuranceNumber(e.target.value)} />
                    </label>
                    <label>
                        Número de Licencia:
                        <input className='input-table-paciente' type="text" value={licenceNumber} onChange={(e) => setLicenceNumber(e.target.value)} />
                    </label>
                    <label>
                        Especialidad:
                        <select className='select-form' value={speciality} onChange={(e) => setSpeciality(e.target.value)} required>
                            <option value="">Selecciona una especialidad</option>
                            {specialities.map((speciality) => (
                                <option key={speciality.id} value={speciality.id}>
                                    {speciality.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Color:
                        <input 
                            type="color" 
                            value={color} 
                            onChange={(e) => setColor(e.target.value)} 
                        />
                    </label>
                    <label>
                        Notas:
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit">Crear</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            
        </div>
    );
};
export default CrearProfesionalForm;
