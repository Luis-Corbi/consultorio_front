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
    <div  className="w-full flex min-h-screen">
      <Sidebar />
      <div className="w-full flex-grow flex flex-col bg-[#F1F1F1]">
        <div className="w-full" >
          <Bar />
        </div>
        <div className="flex justify-center ">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-3xl">
            <h1 className="text-[#269c95] text-2xl font-semibold mb-4">Detalles del Profesional:</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <p className="text-lg"><strong className="text-gray-500">Nombre:</strong> {isEditing ? <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.name)}</p>
              <p className="text-lg"><strong className="text-gray-500">Apellido:</strong> {isEditing ? <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.lastname)}</p>
              <p className="text-lg"><strong className="text-gray-500">DNI:</strong> {isEditing ? <input type="text" name="DNI" value={formData.DNI} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.DNI)}</p>
              <p className="text-lg"><strong className="text-gray-500">Teléfono:</strong> {isEditing ? <input type="text" name="telephone" value={formData.telephone} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.telephone)}</p>
              <p className="text-lg"><strong className="text-gray-500">Email:</strong> {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.email)}</p>
              <p className="text-lg"><strong className="text-gray-500">Dirección:</strong> {isEditing ? <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.address)}</p>
              <p className="text-lg"><strong className="text-gray-500">Género:</strong> {isEditing ? (
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1">
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">No binario</option>
                </select>
              ) : renderDato(genderMap[user.gender] || 'No especificado')}</p>
              
              <p className="text-lg"><strong className="text-gray-500">Fecha de Nacimiento:</strong> {isEditing ? <input type="date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.birth_date)}</p>
              <p className="text-lg"><strong className="text-gray-500">Seguro de Salud:</strong> {isEditing ? <input type="text" name="health_insurance" value={formData.health_insurance} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.health_insurance)}</p>
              <p className="text-lg"><strong className="text-gray-500">Número de Seguro de Salud:</strong> {isEditing ? <input type="text" name="health_insurance_number" value={formData.health_insurance_number} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.health_insurance_number)}</p>
              <p className="text-lg"><strong className="text-gray-500">Número de Licencia:</strong> {isEditing ? <input type="text" name="licence_number" value={formData.licence_number} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.licence_number)}</p>
              <p className="text-lg"><strong className="text-gray-500">Notas:</strong> {isEditing ? <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" /> : renderDato(user.notes)}</p>
              <p className="text-lg"><strong className="text-gray-500">Color:</strong>{isEditing ? (
                <input type="color" name="color" value={formData.color} onChange={handleColorChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" />
              ) : (
                <div className="color-indicator w-8 h-8 rounded-full border border-gray-400 mt-1" style={{ backgroundColor: user.color }} />
              )}</p>
              
              {isEditing && (
                <p className="text-lg"><strong className="text-gray-500">Contraseña:</strong> <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="input-dato w-full border border-gray-300 rounded px-2 py-1 mt-1" placeholder="****" /></p>
              )}
              
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              {!isEditing && (
                <button className="btn-edit-pro px-4 py-2 rounded bg-[#269c95] text-white font-semibold hover:bg-[#1d7e78]" onClick={() => setIsEditing(true)}>Editar</button>
              )}
              {isEditing && (
                <div className="flex space-x-4">
                  <button className="btn-edit-pro px-4 py-2 rounded bg-[#269c95] text-white font-semibold hover:bg-[#1d7e78]" onClick={handleEdit}>Guardar</button>
                  <button className="btn-edit-pro px-4 py-2 rounded bg-gray-400 text-white font-semibold hover:bg-gray-500" onClick={() => setIsEditing(false)}>Cancelar</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserPageContainer;