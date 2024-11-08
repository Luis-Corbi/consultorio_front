"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Sidebar from '../components/sidebar';
import Bar from '../components/bar';
import Image from 'next/image';


export interface Speciality {
  id: number;
  name: string;
  status: boolean;
}

const SpecialityPage = () => {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [newSpeciality, setNewSpeciality] = useState<string>('');
  const [editingSpeciality, setEditingSpeciality] = useState<Speciality | null>(null);
  const [editSpecialityName, setEditSpecialityName] = useState<string>('');

  useEffect(() => {

    const fetchSpecialities = async () => {
      try {
        const token = Cookies.get('access_token');  
        if (!token) {
          console.error('No token found in cookies');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/specialities/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setSpecialities(response.data);
      } catch (error) {
        console.error('Error fetching specialities:', error);
      }
    };

    fetchSpecialities();
  }, []);


  const handleCreateSpeciality = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        console.error('No token found in cookies');
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/specialities/',
        { name: newSpeciality },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setSpecialities([...specialities, response.data]); 
      setNewSpeciality(''); 
    } catch (error) {
      console.error('Error creating speciality:', error);
    }
  };

  
  const handleDeleteSpeciality = async (specialityId: number) => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        console.error('No token found in cookies');
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/specialities/${specialityId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setSpecialities(specialities.filter(speciality => speciality.id !== specialityId)); 
    } catch (error) {
      console.error('Error deleting speciality:', error);
    }
  };


  const handleEditSpeciality = async () => {
    if (editingSpeciality && editSpecialityName) {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          console.error('No token found in cookies');
          return;
        }

        const response = await axios.put(
          `http://127.0.0.1:8000/api/specialities/${editingSpeciality.id}/`,
          { name: editSpecialityName },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        setSpecialities(specialities.map(speciality => (speciality.id === editingSpeciality.id ? response.data : speciality)));
        setEditingSpeciality(null); // Limpiar el estado de edición
        setEditSpecialityName(''); // Limpiar el campo de entrada
      } catch (error) {
        console.error('Error editing speciality:', error);
      }
    }
  };

  return (
    <div className='w-full flex min-h-screen'>
        <Sidebar />
    
    <div className='w-[100%] flex-grow flex flex-col bg-[#F1F1F1]'>
      
    <div className="w-full">
      <Bar />
    </div>
    <div className="h-[6%] w-full gap-[10%]">
        <div>
          <div className="flex gap-[2%]">
            <input
              className="min-w-[100px] p-1 h-8 text-sm border-2 border-[rgb(179,179,179)] rounded-[5px] ml-[20px]"
              type="text"
              placeholder="Nombre de especialidad"
              value={newSpeciality}
              onChange={(e) => setNewSpeciality(e.target.value)}
            />

            <div
              className=" flex bg-[#269c95] text-white text-sm px-1.5 py-1.5 border-none rounded-full cursor-pointer"
              onClick={handleCreateSpeciality} 
            >
  
                <Image 
                className="h-6 items-center" 
                src="/assets/plus.png" 
                alt="Icono de añadir" 
                width={24} 
                height={24} 
                />

              <button className="hidden bg-none text-white cursor-pointer sm:block md:block lg:block xl:block 2xl:block " >
                Crear Especialidad
              </button>
            </div>
          </div>
        </div>
      </div>

    
      <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {specialities.map((speciality) => (
              <tr key={speciality.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{speciality.name}</td>
                <td className="px-6 py-4">{speciality.status ? 'Activo' : 'Inactivo'}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => {
                      setEditingSpeciality(speciality);
                      setEditSpecialityName(speciality.name);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteSpeciality(speciality.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
        {editingSpeciality && (
        <div className="flex mt-4">
            <input
            className="flex ml-[20px] p-2 border-2 border-[#5BB5B0] rounded-[5px] text-sm"
            type="text"
            value={editSpecialityName}
            onChange={(e) => setEditSpecialityName(e.target.value)}
            placeholder="Editar nombre de la especialidad"
            />
            <button
            className="ml-[20px] bg-[#269c95] text-white text-sm px-1.5 py-1.5 border-none rounded-full cursor-pointer sm:block md:block lg:block xl:block 2xl:block"
            onClick={handleEditSpeciality}
            >
            Guardar cambios
            </button>
        </div>
        )}





    </div>
    </div>

  );
};

export default SpecialityPage;
