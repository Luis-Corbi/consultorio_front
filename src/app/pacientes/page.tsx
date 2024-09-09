// src/app/pacientes/page.tsx
"use client"
import React from 'react';
import '../sections.css';  
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
    <div className='container'>
      <Sidebar/>
      <div className='container'>
        <div className='div-principal'>
          <Bar/>
          <h1>Pacientes</h1>
          <Fetchtable />
        </div>
      </div>
    </div>
  );
};

export default Page;