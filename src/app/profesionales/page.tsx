"use client";
import React, { useEffect, useState } from 'react';
import '../sections.css';  
import Sidebar from '../components/sidebar';
import Bar from '../components/bar';
import ProTable from '../components/protable'; 
import CrearProfesionalForm from '../components/CrearProf'; 
import { User } from '../types/types';
import { fetchUsersByRole } from '../lib/pacientes';

const TableProfesionales: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      const data = await fetchUsersByRole(1);
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    fetchUsers(); 
    setShowCreateForm(false); 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='w-full flex min-h-screen'>
      <Sidebar />
      
      <div className='w-[100%] flex-grow flex flex-col bg-[#F1F1F1]'>
        
      <div className="w-full">
        <Bar />
      </div>
         
        {showCreateForm && (
          <CrearProfesionalForm 
            onClose={() => setShowCreateForm(false)} 
            onCreate={handleCreate} 
          />
        )}

        <div className='flex-grow p-4'>
          <ProTable users={users} />
        </div>

      </div>
      
    </div>
  );
};

export default TableProfesionales;
