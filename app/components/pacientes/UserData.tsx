"use client";

import { User } from '../../types/types';
import api from "@/lib/api"; 
import { useState, useEffect } from "react";
import axios from 'axios';
import Link from 'next/link';
import Loading from '@/loading';

interface UserDataProps {
  id: string;
  token: string;
}

const UserData = ({ id, token }: UserDataProps) => {
  const genderMap: { [key: string]: string } = {
    M: "Masculino",
    F: "Femenino",
    O: "No binario",
  }; 
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
   
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (userData.roles && userData.roles.some((role: { name: string }) => role.name === "admin")) {
      setIsAdmin(true);
    }
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
     
        console.log("Fetching user data for ID:", id);

        const response = await api.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const fetchedUser = response.data;
          console.log("Fetched user:", fetchedUser); 

          setUser(fetchedUser);
          setFormData(fetchedUser); 
        } else {
          console.error("Error: No data found");
        }

        setLoading(false);
      } catch (error) {
        console.log('Error en la respuesta del servidor:', error);
        setLoading(false); 
      }
    };

    fetchUserData();
  }, [id, token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData(user); 
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
     
      const dataToSend = {
        ...formData,
        speciality: formData.speciality?.id || formData.speciality,  
        roles: formData.roles?.map(role => role.id) || formData.roles,  
      };

      const response = await api.put(`/users/${id}/`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      

      if (response.status === 200) {
        alert("Usuario actualizado");
        setIsEditing(false);
        setUser(formData); 
      } else {
        const errorData = await response.data;
        console.error("Error al guardar los cambios:", errorData);
        alert("Error al guardar los cambios: " + JSON.stringify(errorData));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Respuesta de error del servidor:", error.response?.data);
        alert("Error en la API: " + error.response?.status);
      } else {
        console.error("Error desconocido:", error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (formData) {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <div>No se encontraron datos del usuario.</div>;
  }

  return (
    <div className="w-full h-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6 justify-between">
        <div className="flex items-center">
          <img className="w-12 h-12 rounded-full mr-4" src="/assets/usuario.png" alt="Logo-usuario" />
          <h2 className="text-2xl font-semibold">
            {isEditing ? (
              <div className="flex gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleChange}
                  className="bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-teal-500 px-2 py-1"
                />
                <input
                  type="text"
                  name="lastname"
                  value={formData?.lastname || ""}
                  onChange={handleChange}
                  className="bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-teal-500 px-2 py-1"
                />
              </div>
            ) : (
              `${user.name} ${user.lastname}`
            )}
          </h2>
        </div>
        {!isAdmin && (
        <Link
          href={`/pacientes/${id}/odontograma`}
          className="text-teal-500 text-sm font-medium bg-transparent border-2 border-teal-500 hover:bg-teal-500 hover:text-white rounded-full px-4 py-2 ml-auto"
        >
          Odontograma
        </Link>
    )}
      </div>
  
      <div className="flex justify-end mb-6">
        {!isEditing && (
          <button
            className="text-white bg-teal-500 hover:bg-teal-600 rounded-full px-4 py-2"
            onClick={handleEdit}
          >
            Editar
          </button>
        )}
        {isEditing && (
          <>
            <button
              className="text-white bg-teal-500 hover:bg-teal-600 rounded-full px-4 py-2 mr-2"
              onClick={handleSave}
            >
              Guardar
            </button>
            <button
              className="text-white bg-red-500 hover:bg-red-600 rounded-full px-4 py-2"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
  
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">DNI</label>
            {isEditing ? (
              <input
                type="text"
                name="DNI"
                value={formData?.DNI || ""}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-teal-500 px-2 py-1 mt-2"
              />
            ) : (
              <span>{user.DNI}</span>
            )}
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Teléfono</label>
            {isEditing ? (
              <input
                type="text"
                name="telephone"
                value={formData?.telephone || ""}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-teal-500 px-2 py-1 mt-2"
              />
            ) : (
              <span>{user.telephone}</span>
            )}
          </div>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-teal-500 px-2 py-1 mt-2"
              />
            ) : (
              <span>{user.email}</span>
            )}
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Dirección</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData?.address || ""}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-teal-500 px-2 py-1 mt-2"
              />
            ) : (
              <span>{user.address}</span>
            )}
          </div>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Género</label>
            {isEditing ? (
              <select
                name="gender"
                value={formData?.gender || ""}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-teal-500 px-2 py-1 mt-2"
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">No binario</option>
              </select>
            ) : (
              <span>{genderMap[user.gender]}</span>
            )}
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Fecha de Nacimiento</label>
            {isEditing ? (
              <input
                type="date"
                name="birth_date"
                value={formData?.birth_date || ""}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-teal-500 px-2 py-1 mt-2"
              />
            ) : (
              <span>{user.birth_date}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
};  

export default UserData;
