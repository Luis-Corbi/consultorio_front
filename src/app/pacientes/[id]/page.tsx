// src/app/pacientes/[id]/page.tsx
import { fetchUser } from '@/app/lib/pacientes';
import Sidebar from '@/app/components/sidebar';
import Bar from '@/app/components/bar';
import { User } from '@/app/types/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

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
            <h1>Usuarios:</h1>
            <h1>{user.name} {user.lastname}</h1>
            <p>DNI: {user.DNI}</p>
            <p>Teléfono: {user.telephone}</p>
            <p>Email: {user.email}</p>
            <p>Dirección: {user.address}</p>
            <p>Género: {user.gender}</p>
            <p>Fecha de Nacimiento: {user.birth_date}</p>
            <p>Seguro de Salud: {user.health_insurance}</p>
            <p>Número de Seguro de Salud: {user.health_insurance_number}</p>
            <p>Número de Licencia: {user.licence_number}</p>
            <p>Notas: {user.notes}</p>
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
