// src/app/components/bar.tsx
"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import styles from '../components/dropdown.module.css';
import Icondown from '../icons/down.jsx';

interface Speciality {
  id: number;
  name: string;
}
interface UserData {
  id: number;
  name: string;
  lastname: string;
  speciality?: Speciality;
  email: string;
}

const Bar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      window.location.href = '/';
    }
  }, [router]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('userData');
    window.location.href = '/';
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <span>Bienvenido, <span className={styles.username}>{userData.name}!</span></span>
      </div>
      <div className={styles.icons}>
        <div className={styles.user} onClick={toggleDropdown}>
          <div className={styles.userDetails}>
          <img className={styles.logo_usuario_datos} src="/assets/usuario.png" alt="Logo-usuario" />
            <div className={styles.info}>
              <span className={styles.name}>{userData.name} {userData.lastname}</span>
              <span className={styles.role}>{userData.speciality?.name || 'Especialidad no especificada'}</span>
            </div>
          </div>
          <div className={styles.dropdownArrow}><Icondown /> </div>
          {isOpen && (
            <div className={styles.dropdownContent}>
              <a href={`/perfil`}>Perfil</a>
              <a href="#" onClick={handleLogout}>Salir</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bar;
