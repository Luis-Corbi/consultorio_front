import React, { useState } from 'react';
import Link from 'next/link';
import { User } from '../types/types';
import CrearProfesionalForm from './CrearProf';
import "../pacientes/pacientes.css";

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
    // Recarga la lista de usuarios o actualiza el estado de la lista
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

  // Calcula los usuarios actuales para mostrar
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Cambia la página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total de páginas
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  const genderMap: { [key: string]: string } = {
    M: 'Masculino',
    F: 'Femenino',
    O: 'No binario'
  };
  return (
    <>
      <div className='botones-table'>
        <div className='div-filtro'>
        <input className='input-filtro '
          type="text" 
          placeholder={`Escribir ${filterCriteria}`} 
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)} 
        />
      <select className='select-filtro ' value={filterCriteria} onChange={(e) => setFilterCriteria(e.target.value as 'nombre' | 'apellido' | 'dni')}>
          <option value="nombre">Filtrar por Nombre</option>
          <option value="apellido">Filtrar por Apellido</option>
          <option value="dni">Filtrar por DNI</option>
        </select>

        </div>
       
        <div className='crear-pac' onClick={openModal}>
          <img className='plus-icon' src="/assets/plus.png" alt="" />
          <button className='btn-pacientes'>Crear Profesional</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
            <CrearProfesionalForm onClose={closeModal} onCreate={handleCreate} />
        </div>
        
      )}

      <table className='tabla-prof'>
        <thead>
          <tr>
            <th>Color</th>
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
              <td>
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
              <td className='td-bold'>{user.name}</td>
              <td className='td-bold'>{user.lastname}</td>
              <td>{user.DNI}</td>
              <td>{user.telephone}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{genderMap[user.gender] || 'No especificado'}</td>
              <td>{user.birth_date}</td>
              <td className='ver-paciente'>
                <Link className='button-ver-p' href={`/profesionales/${user.id}`}>
                <img className='logo-paciente' src="../assets/doctor.png" alt="" />
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

export default ProTable;
