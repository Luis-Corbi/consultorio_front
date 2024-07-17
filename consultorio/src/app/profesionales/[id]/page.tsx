import { fetchUser, fetchUsers } from '../../lib/pacientes';
import Sidebar from '@/app/components/sidebar';
import Bar from '@/app/components/bar';
import { User, Speciality } from '../../types/types';

const UserPage = async ({ params }: { params: { id: string } }) => {
    const user = await fetchUser(params.id);
  
    return (
      <div className='container'>
      <Sidebar/>
      <div>
        <div className='div-principal'>

          <Bar/>
          <h1>Profesionales:</h1>
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
        <p>Especialidad: {user.speciality.name}</p>
        <p>Notas: {user.notes}</p>
          
        </div>
        
      </div>
    </div>

        
      
    );
  };
  
  export async function generateStaticParams() {
    const users = await fetchUsers();
  
    return users.map(user => ({
      id: user.id.toString(),
    }));
  }
  
  export default UserPage;



