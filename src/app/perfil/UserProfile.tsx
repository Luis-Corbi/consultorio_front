"use client"; 

import React, { useState } from 'react';
import Sidebar from '@/app/components/sidebar';
import Bar from '@/app/components/bar';
import { User, EditableUser } from '@/app/types/types';
import api from '../lib/api';

const UserPageContainer = ({ user, token }: { user: User; token: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EditableUser>({
    id: user.id.toString(),
    username: user.username,
    name: user.name,
    lastname: user.lastname,
    DNI: user.DNI,
    telephone: user.telephone,
    email: user.email,
    address: user.address,
    gender: user.gender,
    birth_date: user.birth_date,
    health_insurance: user.health_insurance,
    health_insurance_number: user.health_insurance_number,
    licence_number: user.licence_number,
    notes: user.notes,
    color: user.color || '#ffffff',
    password: '', 
    speciality: user.speciality?.id.toString() || '', 
    roles: user.roles.map((role: any) => role.id),
  });

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/users/${user.id}`);
      
      if (response.status === 200) {
        const updatedUser = response.data;
        setFormData({
          id: updatedUser.id.toString(),
          username: updatedUser.username,
          name: updatedUser.name,
          lastname: updatedUser.lastname,
          DNI: updatedUser.DNI,
          telephone: updatedUser.telephone,
          email: updatedUser.email,
          address: updatedUser.address,
          gender: updatedUser.gender,
          birth_date: updatedUser.birth_date,
          health_insurance: updatedUser.health_insurance,
          health_insurance_number: updatedUser.health_insurance_number,
          licence_number: updatedUser.licence_number,
          notes: updatedUser.notes,
          color: updatedUser.color || '#ffffff',
          password: '', 
          speciality: updatedUser.speciality?.id.toString() || '',
          roles: updatedUser.roles.map((role: any) => role.id),
        });
      } else {
        console.error('Error al obtener los datos del usuario');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const [originalData, setOriginalData] = useState<EditableUser>(formData);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, color: e.target.value });
  };

  const handleEdit = async () => {

    const updatedData = { ...formData };
  
    
    if (!updatedData.password) {
      delete updatedData.password; 
    }
  
    try {
      const response = await api.put(`/users/${user.id}/`, updatedData);

      if (response.status === 200) {
        await fetchUserData(); 
        setIsEditing(false); 
        console.log('Usuario actualizado');
        window.location.reload(); 
      } else {
        console.error('Error al actualizar los datos:', response.data);
        throw new Error('Error al actualizar los datos');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  const startEditing = () => {
    setOriginalData(formData);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const genderMap: { [key: string]: string } = {
    M: 'Masculino',
    F: 'Femenino',
    O: 'No binario'
  };

  const renderDato = (data: string | undefined | null) => {
    return data ? (
      <span className='dato'>{data}</span>
    ) : (
      <span className='dato'>Dato no disponible</span>
    );
  };

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-full flex-grow flex flex-col bg-[#F1F1F1]">
        <div className="w-full">
          <Bar />
        </div>
        <div className="flex-grow p-4">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Detalles del Profesional:</h1>
            
            {/* Grid Structure for the form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Column */}
              <div className="space-y-4">
                <p className="text-sm">
                  <strong className="text-black">Nombre:</strong> {isEditing ? (
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-dato px-2 py-1 text-sm text-gray-700 block w-full sm:text-sm md:text-md lg:text-md xl:text-lg" />
                  ) : renderDato(user.name)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">Apellido:</strong> {isEditing ? (
                    <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} className="input-dato px-2 py-1 text-sm text-gray-700 block w-full sm:text-sm md:text-md lg:text-md xl:text-lg" />
                  ) : renderDato(user.lastname)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">DNI:</strong> {isEditing ? (
                    <input type="text" name="DNI" value={formData.DNI} onChange={handleInputChange} className="input-dato px-2 py-1 text-sm text-gray-700 block w-full sm:text-sm md:text-md lg:text-md xl:text-lg" />
                  ) : renderDato(user.DNI)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">Teléfono:</strong> {isEditing ? (
                    <input type="text" name="telephone" value={formData.telephone} onChange={handleInputChange} className="input-dato px-2 py-1 text-sm text-gray-700 block w-full sm:text-sm md:text-md lg:text-md xl:text-lg" />
                  ) : renderDato(user.telephone)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">Email:</strong> {isEditing ? (
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-dato px-2 py-1 text-sm text-gray-700 block w-full sm:text-sm md:text-md lg:text-md xl:text-lg" />
                  ) : renderDato(user.email)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">Dirección:</strong> {isEditing ? (
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="input-dato px-2 py-1 text-sm text-gray-700 block w-full sm:text-sm md:text-md lg:text-md xl:text-lg" />
                  ) : renderDato(user.address)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">Género:</strong> {isEditing ? (
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="input-dato px-2 py-1 text-sm text-gray-700 block w-full sm:text-sm md:text-md lg:text-md xl:text-lg">
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">No binario</option>
                    </select>
                  ) : renderDato(genderMap[user.gender] || 'No especificado')}
                </p>
              </div>
  
              {/* Second Column */}
              <div className="space-y-4">
                <p className="text-sm">
                  <strong className="text-black">Fecha de Nacimiento:</strong> {isEditing ? (
                    <input type="date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1 text-gray-700" />
                  ) : renderDato(user.birth_date)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">Seguro de Salud:</strong> {isEditing ? (
                    <input type="text" name="health_insurance" value={formData.health_insurance} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1 text-gray-700" />
                  ) : renderDato(user.health_insurance)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">Número de Seguro de Salud:</strong> {isEditing ? (
                    <input type="text" name="health_insurance_number" value={formData.health_insurance_number} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1 text-gray-700" />
                  ) : renderDato(user.health_insurance_number)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">Número de Licencia:</strong> {isEditing ? (
                    <input type="text" name="licence_number" value={formData.licence_number} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1 text-gray-700" />
                  ) : renderDato(user.licence_number)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">Notas:</strong> {isEditing ? (
                    <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1 text-gray-700" />
                  ) : renderDato(user.notes)}
                </p>
                <p className="text-sm">
                  <strong className="text-black">Color:</strong>{isEditing ? (
                    <input type="color" name="color" value={formData.color} onChange={handleColorChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1 text-gray-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-gray-400 mt-1" style={{ backgroundColor: user.color }} />
                  )}
                </p>
                {isEditing && (
                  <p className="text-sm">
                    <strong className="text-black">Contraseña:</strong> 
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1 text-gray-700" placeholder="****" />
                  </p>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center mt-6 space-x-4">
              {!isEditing ? (
                <button className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition" onClick={startEditing}>Editar</button>
              ) : (
                <>
                  <button className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition" onClick={handleEdit}>Guardar</button>
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition" onClick={cancelEditing}>Cancelar</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};
export default UserPageContainer;