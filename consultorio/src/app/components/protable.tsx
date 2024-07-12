'use client'
import Link from 'next/link';
import { User } from '../types/types';


interface UsersTableProps {
  users: User[];
}

const ProTable: React.FC<UsersTableProps> = ({ users }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>DNI</th>
          <th>Telefono</th>
          <th>Email</th>
          <th>Direccion</th>
          <th>Genero</th>
          <th>Num. de matricula</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.lastname}</td>
            <td>{user.DNI}</td>
            <td>{user.telephone}</td>
            <td>{user.email}</td>
            <td>{user.address}</td>
            <td>{user.licence_number}</td>
            <td>{user.speciality.name}</td>
            <td>
              <Link href={`/pacientes/${user.id}`}>
                <button>Ver </button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProTable;
