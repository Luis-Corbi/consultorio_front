import React, { useState, useEffect } from 'react';
import { createUser, getSpecialities } from '../lib/pacientes'; 
import { User, Speciality } from '../types/types';
import "../pacientes/pacientes.css";

interface CrearPacienteFormProps {
    onClose: () => void;
    onCreate: () => void;  // Asegúrate de que esta propiedad esté bien definida
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
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [healthInsurance, setHealthInsurance] = useState('');
    const [healthInsuranceNumber, setHealthInsuranceNumber] = useState('');
    const [licenceNumber, setLicenceNumber] = useState('');
    const [speciality, setSpeciality] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [color, setColor] = useState<string>('#ffffff'); // Default color
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
            speciality: speciality.toString(), 
            notes,
            roles: [2], 
            color
          };
      
          console.log('Submitting user:', newUser);
      
          await createUser(newUser);
          onCreate(); // Llama a la función para recargar la lista
          onClose();
        } catch (error) {
          console.error('Failed to create user:', error);
        }
    };

    return (
        <div className="modal-container">
            <div className="modal-content">
                <h2 className="modal-title">Crear Profesional</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <label>
                        Nombre de usuario:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </label>
                    <label>
                        Contraseña:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <label>
                        Nombre:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                    <label>
                        Apellido:
                        <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                    </label>
                    <label>
                        DNI:
                        <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} required />
                    </label>
                    <label>
                        Teléfono:
                        <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Dirección:
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </label>
                    <label>
                        Género:
                        <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} required />
                    </label>
                    <label>
                        Fecha de Nac.:
                        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                    </label>
                    <label>
                        Seguro Médico:
                        <input type="text" value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} />
                    </label>
                    <label>
                        Número de Seguro Médico:
                        <input type="text" value={healthInsuranceNumber} onChange={(e) => setHealthInsuranceNumber(e.target.value)} />
                    </label>
                    <label>
                        Número de Licencia:
                        <input type="text" value={licenceNumber} onChange={(e) => setLicenceNumber(e.target.value)} />
                    </label>
                    <label>
                        Especialidad:
                        <select className='select' value={speciality} onChange={(e) => setSpeciality(e.target.value)} required>
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
        </div>
    );
};

export default CrearProfesionalForm;
