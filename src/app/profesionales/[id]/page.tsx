// src/app/pacientes/[id]/page.tsx

import { fetchUser } from '@/app/lib/pacientes';
import Sidebar from '@/app/components/sidebar';
import Bar from '@/app/components/bar';
import { User } from '@/app/types/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import '../../sections.css';  

interface Props {
  user: User | null;
}

const UserPage = async ({ params }: { params: { id: string } }) => {
  // Obtener el token de las cookies
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value || '';

  if (!token) {
    return <div>Token no disponible, por favor inicie sesión.</div>;
  }

  try {
    // Llamar a la función para obtener el usuario
    const user: User | null = await fetchUser(params.id, false, token);

    if (!user) {
      notFound(); // Utiliza notFound para redirigir a una página 404
    }

    return (
        <div className='container'>
        <Sidebar />
        <div className='container'>
          <div className='div-principal'>
            <Bar />
            <h1>Detalles del Profesional:</h1>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Apellido:</strong> {user.lastname}</p>
            <p><strong>DNI:</strong> {user.DNI}</p>
            <p><strong>Teléfono:</strong> {user.telephone}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Dirección:</strong> {user.address}</p>
            <p><strong>Género:</strong> {user.gender}</p>
            <p><strong>Fecha de Nacimiento:</strong> {user.birth_date}</p>
            <p><strong>Seguro de Salud:</strong> {user.health_insurance}</p>
            <p><strong>Número de Seguro de Salud:</strong> {user.health_insurance_number}</p>
            <p><strong>Número de Licencia:</strong> {user.licence_number}</p>
            <p><strong>Notas:</strong> {user.notes}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return <div>Error al cargar los datos del usuario.</div>;
  }
};

export default UserPage;
