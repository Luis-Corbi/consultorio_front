'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User } from '../types/types';
import CrearPacienteForm from './CrearPacienteForm'; 
import  "../pacientes/pacientes.css"

interface UsersTableProps {
  users: User[];
}



const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Calculate the current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <>
      <div className='botones-table'>
        <input type="text" />
        <div className='crear-pac'>
          <img className='plus-icon' src="/assets/plus.png" alt="" />
          <button className='btn-pacientes' onClick={openModal}>Crear Paciente</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          
            <button className="close-button" onClick={closeModal}>&times;</button>
            <CrearPacienteForm onClose={closeModal} />
          
        </div>
      )}

      <table className='tabla-usuarios'>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Género</th>
            <th>Fecha de Nac.</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className='td-bold'>{user.name}</td>
              <td className='td-bold'>{user.lastname}</td>
              <td>{user.DNI}</td>
              <td>{user.telephone}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.gender}</td>
              <td>{user.birth_date}</td>
              <td className='ver-paciente'>
                <Link  className='button-ver-p' href={`/pacientes/${user.id}`} >
                  <img className='logo-paciente' src="../assets/ver-paciente.png" alt="" />
                  Ver 
                  
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

      
    </>
  );
};

export default UsersTable;