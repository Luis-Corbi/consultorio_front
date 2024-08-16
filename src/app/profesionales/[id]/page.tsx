"use client"
import { useState, useEffect } from 'react';
import { fetchUser, updateUser } from '../../lib/pacientes';
import { EditableUser } from '../../types/types';
import Sidebar from '@/app/components/sidebar';
import Bar from '@/app/components/bar';
import '../../sections.css';
  
const UserPage = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<EditableUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUser = await fetchUser(params.id);
      // Excluye campos no editables
      const {  speciality, roles, ...editableData } = fetchedUser;
      setUser(editableData as EditableUser);
    };
    fetchData();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prevData => prevData ? { ...prevData, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await updateUser(params.id, user);
        setIsEditing(false);
        const updatedUser = await fetchUser(params.id);
        setUser(updatedUser as EditableUser);
      } catch (error) {
        console.error('Error updating user:', error);
        // Manejar el error de manera adecuada, como mostrar un mensaje al usuario
      }
    }
  };

  return (
    <div className='container'>
      <Sidebar />
      <div>
        <div className='div-principal'>
          <Bar />
          <h1>Detalles del Profesional:</h1>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <table>
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
                    <th>Color</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input name="name" value={user?.name || ''} onChange={handleInputChange} /></td>
                    <td><input name="lastname" value={user?.lastname || ''} onChange={handleInputChange} /></td>
                    <td><input name="DNI" value={user?.DNI || ''} onChange={handleInputChange} /></td>
                    <td><input name="telephone" value={user?.telephone || ''} onChange={handleInputChange} /></td>
                    <td><input name="email" value={user?.email || ''} onChange={handleInputChange} /></td>
                    <td><input name="address" value={user?.address || ''} onChange={handleInputChange} /></td>
                    <td><input name="gender" value={user?.gender || ''} onChange={handleInputChange} /></td>
                    <td><input name="birth_date" value={user?.birth_date || ''} onChange={handleInputChange} /></td>
                    <td><input name="color" value={user?.color || ''} onChange={handleInputChange} /></td>
                  </tr>
                </tbody>
              </table>
              <button type="submit">Guardar Cambios</button>
            </form>
          ) : (
            <div>
              <table>
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
                    <th>Color</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{user?.name}</td>
                    <td>{user?.lastname}</td>
                    <td>{user?.DNI}</td>
                    <td>{user?.telephone}</td>
                    <td>{user?.email}</td>
                    <td>{user?.address}</td>
                    <td>{user?.gender}</td>
                    <td>{user?.birth_date}</td>
                    <td>
                      {user?.color ? (
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: user.color,
                            border: '1px solid #ccc',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginLeft: '15%'
                          }}
                        ></div>
                      ) : (
                        'No color'
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button onClick={() => setIsEditing(true)}>Editar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
