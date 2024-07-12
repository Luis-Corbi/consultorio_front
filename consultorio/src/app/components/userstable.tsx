'use client'
import Link from 'next/link';
import { User } from '../types/types';


interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
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
          <th>Fecha de Nac.</th>
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
            <td>{user.gender}</td>
            <td>{user.birth_date}</td>
            <td>
              <Link href={`/pacientes/${user.id}`}>
                <button>Ver Usuario</button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
