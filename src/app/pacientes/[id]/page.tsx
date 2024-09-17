// src/app/pacientes/[id]/page.tsx
import { fetchUser } from '@/app/lib/pacientes';
import Sidebar from '@/app/components/sidebar';
import Bar from '@/app/components/bar';
import { User } from '@/app/types/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import UploadReport from '@/app/components/pacientes/CrearReporte';
import MedicalReports from '@/app/components/pacientes/ReportePaciente';
import "../pacientes.css";
import '../../components/pacientes/medicalreport.css';

import Link from 'next/link';

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
            <div className='div-datos-paciente'>
              <div className='datos' >
                <div className='div-identificacion'>
                  <div className='div-contenedor'>
                    <img className='logo-usuario-datos' src="/assets/usuario.png" alt="Logo-usuario" />
                    <h2>{user.name} {user.lastname}</h2>
                  </div>
                  <Link  className='link-odontograma' href="#">
                  <div className='div-odonto'>

                  <img className='logo-odonto' src="/assets/odontograma.png" alt="Logo-odonto" />
                  <p>Odontograma</p>
                  </div>
             
                </Link>
              
                </div>
                <div className='linea'></div>
              <div className='contenedor-datos'>
              <div  className='div-datos'>
              <p className='p-datos'><strong>DNI:</strong> {user.DNI}</p>
              <p className='p-datos'><strong>Teléfono:</strong> {user.telephone}</p>
              </div>
              <div  className='div-datos'>
              <p className='p-datos'><strong>Email:</strong> {user.email}</p>
              <p className='p-datos'><strong>Dirección:</strong> {user.address}</p>
              </div>
              <div  className='div-datos'>
              <p className='p-datos'><strong>Género:</strong> {user.gender}</p>
              <p className='p-datos'><strong>Fecha de Nacimiento:</strong> {user.birth_date}</p>
              </div>
              
              <div  className='div-datos'>
              <p className='p-datos'><strong>Seguro de Salud:</strong> {user.health_insurance}</p>
              <p className='p-datos'><strong>Número de Seguro de Salud:</strong> {user.health_insurance_number}</p>
              </div>
              <div  className='div-datos'>
              <p className='p-datos'><strong>Número de Licencia:</strong> {user.licence_number}</p>
              <p className='p-datos'><strong>Notas:</strong> {user.notes}</p>
              </div>
             
              </div>

              </div>
              <div className='reportes'>
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
