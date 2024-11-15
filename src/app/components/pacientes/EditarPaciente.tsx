// src/app/components/EditPatientForm.tsx
"use client";
import React, { useState } from "react";
import { User } from "@/app/types/types";
import api from "../../lib/api";

interface EditPatientFormProps {
  user: User;
  token: string;
}

const EditPatientForm: React.FC<EditPatientFormProps> = ({ user, token }) => {
  const [formData, setFormData] = useState<User>(user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const updateUser = async (userId: string, userData: User, token: string) => {
    try {
      const response = await api.put(`/user/${userId}/`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw new Error("Error al actualizar el usuario");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(user.id.toString(), formData, token);
      alert("Datos actualizados con éxito");
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      alert("Hubo un error al actualizar los datos");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl mb-4">Editar Paciente</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Apellido</label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          type="text"
          name="telephone"
          value={formData.telephone}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Dirección</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default EditPatientForm;
