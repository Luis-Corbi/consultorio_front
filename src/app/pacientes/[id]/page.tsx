// src/app/pacientes/[id]/page.tsx
import { fetchUser } from '@/app/lib/pacientes';
import Sidebar from '@/app/components/sidebar';
import Bar from '@/app/components/bar';
import { User } from '@/app/types/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import UploadReport from '@/app/components/pacientes/CrearReporte';
import MedicalReports from '@/app/components/pacientes/ReportePaciente';
const UserPage = async ({ params }: { params: { id: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value || '';

  if (!token) {
    return <div>Token no disponible, por favor inicie sesión.</div>;
  }

  try {
    const user: User | null = await fetchUser(params.id, false, token);

    if (!user) {
      notFound();
    }

    return (
      <div className='container'>
        <Sidebar />
        <div className='container'>
          <div className='div-principal'>
            <Bar />
            <h1>Paciente:</h1>
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

            <UploadReport patientId={params.id} token={token} />
            <MedicalReports patientId={params.id} token={token} />
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
