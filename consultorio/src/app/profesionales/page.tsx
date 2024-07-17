
"use client"
import React, { useEffect, useState,  Suspense  } from 'react';
import '../sections.css';  
import Sidebar from '../components/sidebar';
import Bar from '../components/bar';
import ProTable from '../components/protable';
import { fetchUsers } from '../lib/pacientes';
import { User, Speciality, Role } from '../types/types';
import { fetchUsersByRole } from '../lib/pacientes';

const Fetchtable: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsersByRole(2); 
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

  return <ProTable users={users} />;
};

const tableprofesionales: React.FC = () => {
  return (
    <div className='container'>
      <Sidebar/>
      <div className='container'>
        <div className='div-principal'>

          <Bar/>
          <h1>Profesionales</h1>

          <Fetchtable />
        </div>
        
      </div>
    </div>
  );
};

export default tableprofesionales;