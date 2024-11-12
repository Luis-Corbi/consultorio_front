// src/app/pacientes/[id]/page.tsx
import { fetchUser } from '@/app/lib/pacientes';
import Sidebar from '@/app/components/sidebar';
import Bar from '@/app/components/bar';
import { User } from '@/app/types/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import UploadReport from '@/app/components/pacientes/CrearReporte';
import MedicalReports from '@/app/components/pacientes/ReportePaciente';
import Link from 'next/link';

interface Props {
  user: User | null;
}

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
    const genderMap: { [key: string]: string } = {
      M: 'Masculino',
      F: 'Femenino',
      O: 'No binario'
    };
   

    return (
      <div>
        <div className='w-full flex min-h-screen'>
          <Sidebar/>
          <div className='w-[100%] flex-grow flex flex-col bg-[#F1F1F1]'>
            <Bar />
            <div className='overflow-x-scroll h-[100%] px-[3%] flex flex-col items-start lg:flex lg:flex-row lg:justify-between'>
              <div className='w-[100%] h-auto bg-white p-[3%] rounded-[5%]' >
                <div className='div-identificacion'>
                  <div className='div-contenedor'>
                    <img className='logo-usuario-datos' src="/assets/usuario.png" alt="Logo-usuario" />
                    <h2>{user.name} {user.lastname}</h2>
                  </div>

                  <Link  className='link-odontograma w-auto hidden sm:hidden md:hidden lg:block xl:block 2xl:block' href="#">
                    <div className='flex text-white items-center bg-[#5BB5B0] rounded-[6%] px-2 py-1'>
                    <img className='p-1' src="/assets/odontograma.png" alt="Logo-odonto" />
                    <p className='p-1'>Odontograma</p>
                    </div>
                  </Link>

                </div>
                <div className='linea'></div>
                <div className='mt-[3%] flex flex-col justify-between h-[60%]s'>
                  <div  className='flex flex-col sm:flex sm:flex-row sm:justify-start'>
                  <p className='w-[100%]'><strong>DNI:</strong> {user.DNI}</p>
                  <p className='w-[100%]'><strong>Teléfono:</strong> {user.telephone}</p>
                </div>
                <div  className='flex flex-col sm:flex sm:flex-row sm:justify-start'>
                  <p className='w-[100%]'><strong>Email:</strong> {user.email}</p>
                  <p className='w-[100%]'><strong>Dirección:</strong> {user.address}</p>
                </div>
                <div  className='flex flex-col sm:flex sm:flex-row sm:justify-start'>
                  <p className='w-[100%]'><strong>Género:</strong> {genderMap[user.gender] || 'No especificado'}</p>
                  <p className='w-[100%]'><strong>Fecha de Nacimiento:</strong> {user.birth_date}</p>
                </div>

                <div  className='flex flex-col sm:flex sm:flex-row sm:justify-start'>
                  <p className='w-[100%]'><strong>Seguro de Salud:</strong> {user.health_insurance}</p>
                  <p className='w-[100%]'><strong>Número de Seguro de Salud:</strong> {user.health_insurance_number}</p>
                </div>
                <div  className='flex flex-col sm:flex sm:flex-row sm:justify-start'>
                  <p className='w-[100%]'><strong>Número de Licencia:</strong> {user.licence_number}</p>
                  <p className='w-[100%]'><strong>Notas:</strong> {user.notes}</p>
                </div>

              </div>

            </div>
            <div className='w-[100%] mt-[2%] px-[2%] sm:mt-[2%] md:mt-[2%] lg:mt-0 xl:mt-0 2xl:mt-0'>
              <UploadReport patientId={params.id} token={token} />
              <MedicalReports patientId={params.id} token={token} />
            </div>
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
