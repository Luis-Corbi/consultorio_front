// src/app/pacientes/page.tsx
"use client"
import React, { useEffect, useState,  Suspense  } from 'react';
import '../sections.css';  
import Sidebar from '../components/sidebar';
import UsersTable from '../components/table';
import { fetchUsers } from '../lib/pacientes';
import { User, Speciality, Role } from '../types/types';


const Fetchtable: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
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
      <div>
        <h1>Pacientes</h1>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Fetchtable />
        </React.Suspense>
      </div>
    </div>
  );
};

export default Page;