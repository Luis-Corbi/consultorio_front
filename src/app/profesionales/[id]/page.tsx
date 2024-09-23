import { fetchUser } from '@/app/lib/pacientes';
import UserPageContainer from './ProfesionalEdit';
import Sidebar from '@/app/components/sidebar';
import Bar from '@/app/components/bar';
import { User } from '@/app/types/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import '../profesionales.css';

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

  return <UserPageContainer user={user} token={token} />; // No se pasa onUpdate
};

export default UserPage;
