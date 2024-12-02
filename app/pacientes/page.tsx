// app/pacientes/page.tsx
"use client"
import React from 'react';

import Sidebar from '../components/sidebar';
import Bar from '../components/bar';
import UsersTable from '../components/userstable';

import { User, Speciality, Role } from '../types/types';
import { fetchUsersByRole } from '../lib/pacientes';
import Loading from '@/loading';

const Fetchtable: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsersByRole(7);
        setUsers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return <UsersTable users={users} />;
};

const Page: React.FC = () => {
  return (
    
    <div className='h-full w-full flex'>

   
      <div className='w-full h-screen mt-16 bg-gray-100 md:mt-0'>
        <Bar />
        <div className='w-full bg-gray-100 px-1'>
          <div className='flex-grow px-2 py-1'>
            <Fetchtable />
          </div>
        </div>
        
      </div>

    </div>
        
     
  );
};

export default Page;