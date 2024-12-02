'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User } from '../types/types';
import CrearPacienteForm from './CrearPacienteForm'; 


interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCriteria, setFilterCriteria] = useState<'nombre' | 'apellido' | 'dni'>('nombre');
  const [filterValue, setFilterValue] = useState('');
  
  const usersPerPage = 10;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Filter users based on the selected criteria
  const filteredUsers = users.filter(user => {
    switch (filterCriteria) {
      case 'nombre':
        return user.name.toLowerCase().includes(filterValue.toLowerCase());
      case 'apellido':
        return user.lastname.toLowerCase().includes(filterValue.toLowerCase());
      case 'dni':
        return user.DNI.includes(filterValue);
      default:
        return true;
    }
  });

  // Calculate the current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const genderMap: { [key: string]: string } = {
    M: 'Masculino',
    F: 'Femenino',
    O: 'No binario'
  };

  return (
    <div className='block'>
      <h1>Pacientes</h1>
      <div className='h-[6%] w-full gap-[10%]'>
        <div>
          <div className='flex justify-between gap-[5%]'>
            <input  className='min-w-[100px] p-1 h-8 text-sm border-2 border-[rgb(179,179,179)] rounded-[5px]'
              type="text" 
              placeholder={`Escribir ${filterCriteria}`} 
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)} 
            />

            <select className='min-w[80px] p-1 h-8 text-sm border-2 border-[#5BB5B0] rounded-[5px]' value={filterCriteria} onChange={(e) => setFilterCriteria(e.target.value as 'nombre' | 'apellido' | 'dni')}>
              <option value="nombre">Filtrar por Nombre</option>
              <option value="apellido">Filtrar por Apellido</option>
              <option value="dni">Filtrar por DNI</option>
            </select>

            <div className='flex bg-[#269c95] text-white text-sm px-1.5 py-1.5 border-none rounded-full cursor-pointer w-1/10 gap-0.5 justify-around items-center sm:rounded md:rounded lg:rounded xl:rounded 2xl:rounded' onClick={openModal}>
              <img className='h-6 items-center' src="/assets/plus.png" alt="" />
              <button className='hidden bg-none text-white cursor-pointer sm:block md:block lg:block xl:block 2xl:block'>Crear Paciente</button>
            </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <CrearPacienteForm onClose={closeModal} />
        </div>
      )}

      <table className='bg-white w-[100%] border-collapse'>
        <thead>
          <tr>
            <th className='text-sm sm:text-sm md:text-md lg:text-lg xl:text-lg 2xl:text-lg'>Nombre</th>
            <th className='text-sm sm:text-sm md:text-md lg:text-lg xl:text-lg 2xl:text-lg'>Apellido</th>
            <th className='text-sm sm:text-sm md:text-md lg:text-lg xl:text-lg 2xl:text-lg'>DNI</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:text-md md:table-cell lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Teléfono</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:hidden lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Email</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:hidden lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Dirección</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:text-md md:table-cell lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Género</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:hidden lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Fecha de Nac.</th>
            <th className='text-sm sm:text-sm md:text-md lg:text-lg xl:text-lg 2xl:text-lg'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className='font-bold'>{user.name}</td>
              <td className='font-bold'>{user.lastname}</td>
              <td>{user.DNI}</td>
              <td className='hidden sm:hidden md:table-cell lg:table-cell xl:table-cell 2xl:table-cell'>{user.telephone}</td>
              <td className='hidden sm:hidden md:hidden lg:table-cell xl:table-cell 2xl:table-cell'>{user.email}</td>
              <td className='hidden sm:hidden md:hidden lg:table-cell xl:table-cell 2xl:table-cell'>{user.address}</td>
              <td className='hidden sm:hidden md:table-cell lg:table-cell xl:table-cell 2xl:table-cell'>{user.gender}</td>
              <td className='hidden sm:hidden md:hidden lg:table-cell xl:table-cell 2xl:table-cell'>{user.birth_date}</td>
              <td className='cursor-pointer flex justify-center items-center'>
                <Link  className='button-ver-p w-[40px] p-1 flex sm:w-[70px]' href={`/pacientes/${user.id}`} >
                  <img className='h-6' src="../assets/ver-paciente.png" alt="" />
                  <span className='white hidden sm:block md:block lg:block xl:block 2xl:block'>Ver</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={index + 1 === currentPage ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  </div>
)};
export default UsersTable;
