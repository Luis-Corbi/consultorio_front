// app/pacientes/[id]/page.tsx
import { fetchUser } from '../../lib/pacientes';
import Sidebar from '../../components/sidebar';
import Bar from '../../components/bar';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import UserData from '../../components/pacientes/UserData'; 
import UploadReport from '../../components/pacientes/CrearReporte';
import MedicalReports from '../../components/pacientes/ReportePaciente';

const UserPage = async ({ params }: { params: { id: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value || '';

  if (!token) {
    return <div>Token no disponible, por favor inicie sesión.</div>;
  }

  try {
    const user = await fetchUser(params.id, false, token);

    if (!user) {
      notFound();
    }

    return (
      <div className='w-full flex h-screen'>
   
        <div className='w-full flex-grow flex flex-col bg-[#F1F1F1]'>
          <Bar />
          <div className='overflow-x-scroll h-full px-[3%] flex flex-col items-start lg:flex lg:flex-row lg:justify-between'>
         
            <div className='lg:w-[65%]'>
              <UserData id={params.id} token={token} />
            </div>
    
            
            <div className='lg:w-[30%] mt-4 lg:mt-0 lg:flex lg:flex-col'>
              <UploadReport patientId={params.id} token={token} />
              <MedicalReports patientId={params.id} token={token} />
            </div>
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
