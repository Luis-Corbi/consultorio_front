import { fetchUser } from '../../lib/pacientes';
import UserPageContainer from './ProfesionalEdit';
import { User } from '../../types/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

interface Props {
  user: User | null;
}

const UserPage = async ({ params }: { params: { id: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value || '';

  if (!token) {
    return <div>Token no disponible, por favor inicie sesión.</div>;
  }

  let user: User | null = null;

  try {
    user = await fetchUser(params.id, false, token);

    if (!user) {
      notFound();
    }

  } catch (error) {
    console.error('Error fetching user:', error);
    return <div>Error al cargar los datos del usuario.</div>;
  }

  return (
    <div className="w-full flex min-h-screen bg-[#F9FAFB]">
   
      <div className="w-full flex-grow flex flex-col">
        <UserPageContainer user={user} token={token} /> {/* Contenido dinámico */}
      </div>
    </div>
  );
};



export default UserPage;
