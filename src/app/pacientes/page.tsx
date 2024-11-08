// src/app/pacientes/page.tsx
"use client"
import React from 'react';

import Sidebar from '../components/sidebar';
import Bar from '../components/bar';
import UsersTable from '../components/userstable';

import { User, Speciality, Role } from '../types/types';
import { fetchUsersByRole } from '../lib/pacientes';

const Fetchtable: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsersByRole(3);
        setUsers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <UsersTable users={users} />;
};

const Page: React.FC = () => {
  return (
    <div className='w-full flex min-h-screen'>
      
      <Sidebar/>
      <div className='w-full flex-grow flex flex-col bg-[#F1F1F1]'>
        
        <div className="w-full">
          <Bar />
        </div>
        
        <div className='flex-grow p-4'>
          <Fetchtable />
        </div>
      </div>
    </div>
  );
};

export default Page;