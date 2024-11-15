import React, { useState } from 'react';
import Link from 'next/link';
import { User } from '../types/types';
import CrearProfesionalForm from './CrearProf';
import Image from 'next/image';

interface UsersTableProps {
  users: User[];
}

const ProTable: React.FC<UsersTableProps> = ({ users }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCriteria, setFilterCriteria] = useState<'nombre' | 'apellido' | 'dni'>('nombre');
  const [filterValue, setFilterValue] = useState('');
  const usersPerPage = 10;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreate = () => {

    closeModal();
  };

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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total de páginas
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  const genderMap: { [key: string]: string } = {
    M: 'Masculino',
    F: 'Femenino',
    O: 'No binario'
  };

  return (
    <div className='block'>
      <h1>Profesionales</h1>
      <div className='h-[6%] w-[100%] flex items-center justify-between w-full gap-[10%] mr-[2%]'>
      
        <input className='h-[30px] p-1 border border-gray-300 rounded transition duration-300 ease-in-out' type="text" />
        <div className='flex bg-[#269c95] text-white px-2 py-2 border-none rounded-full cursor-pointer w-1/10 gap-0.5 justify-around items-center sm:rounded md:rounded lg:rounded xl:rounded 2xl:rounded' onClick={openModal}>
          
          <Image src="/assets/plus.png" alt="email Icon" width={20} height={20} className='h-6 items-center' />
          <button className='hidden bg-none text-white cursor-pointer sm:block md:block lg:block xl:block 2xl:block'>Crear Profesional</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
            <CrearProfesionalForm onClose={closeModal} onCreate={handleCreate} />
        </div>
        
      )}

      <table className='bg-white w-[100%] border-collapse'>
        <thead>
          <tr>
            <th className='text-sm hidden sm:text-sm sm:hidden md:text-md md:table-cell lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Color</th>
            <th className='text-sm sm:text-sm md:text-md lg:text-lg xl:text-lg 2xl:text-lg'>Nombre</th>
            <th className='text-sm sm:text-sm md:text-md lg:text-lg xl:text-lg 2xl:text-lg'>Apellido</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:text-md md:table-cell lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>DNI</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:text-md md:table-cell lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Teléfono</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:hidden lg:hidden xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Email</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:hidden lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Dirección</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:text-md md:table-cell lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Género</th>
            <th className='text-sm hidden sm:text-sm sm:hidden md:text-md md:table-cell lg:text-lg lg:table-cell xl:text-lg xl:table-cell 2xl:text-lg 2xl:table-cell'>Fecha de Nac.</th>
            <th className='text-sm sm:text-sm md:text-md lg:text-lg xl:text-lg 2xl:text-lg'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className='hidden sm:hidden md:table-cell lg:table-cell xl:table-cell 2xl:table-cell'>
                {user.color ? (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: user.color,
                      border: '1px solid #ccc',
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginLeft:'15%'
                    }}
                  ></div>
                ) : (
                  'No color'
                )}
              </td>
              <td className='font-bold'>{user.name}</td>
              <td className='font-bold'>{user.lastname}</td>
              <td className='hidden sm:hidden md:table-cell lg:table-cell xl:table-cell 2xl:table-cell'>{user.DNI}</td>
              <td className='hidden sm:hidden md:table-cell lg:table-cell xl:table-cell 2xl:table-cell'>{user.telephone}</td>
              <td className='hidden sm:hidden md:hidden lg:hidden xl:table-cell 2xl:table-cell'>{user.email}</td>
              <td className='hidden sm:hidden md:hidden lg:table-cell xl:table-cell 2xl:table-cell'>{user.address}</td>
              <td className='hidden sm:hidden md:table-cell lg:table-cell xl:table-cell 2xl:table-cell'>{user.gender}</td>
              <td className='hidden sm:hidden md:table-cell lg:table-cell xl:table-cell 2xl:table-cell'>{user.birth_date}</td>
              <td className='cursor-pointer flex justify-center items-center'>
                <Link className='button-ver-p w-[40px] p-1 flex sm:w-[70px]' href={`/profesionales/${user.id}`}>
                  <Image className='h-6' src="/assets/doctor.png" alt="doctoaar" width={25} height={20} />
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
  );
};

export default ProTable;
