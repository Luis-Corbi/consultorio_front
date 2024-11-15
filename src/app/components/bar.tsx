// src/app/components/bar.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import styles from '../components/dropdown.module.css';
import { FaBars, FaChevronDown } from 'react-icons/fa';


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
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

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
    <div className="w-full flex items-center justify-between bg-gray-100 p-3 mb-2">
      <div>
        <span className="text-md sm:text-md md:text-lg lg:text-xl xl:text-xl 2xl:text-xl">Bienvenido,</span> <span className="font-bold text-teal-500 text-md sm:text-md md:text-lg lg:text-xl xl:text-xl 2xl:text-xl">{userData.name}!</span>
      </div>
      
      {/* Mobile Menu */}
      <div className="flex md:hidden items-center">
        <button onClick={toggleMobileMenu} className="text-gray-500 p-2">
          <FaBars />
        </button>
        {isMobileMenuOpen && (
          <div className="absolute top-28 right-0 w-auto bg-white shadow-lg p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <img className={styles.logo_usuario_datos} src="/assets/usuario.png" alt="Logo-usuario" />
              <div>
                <p className="font-semibold">{userData.name} {userData.lastname}</p>
                <p className="text-sm text-gray-500">{userData.speciality?.name || 'Especialidad no especificada'}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/perfil" className="text-gray-700">Perfil</a>
              </li>
              <li>
                <button onClick={handleLogout} className="text-gray-700">Salir</button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center cursor-pointer relative" onClick={toggleDropdown}>
        <div className="flex items-center">
          <img className={styles.logo_usuario_datos} src="/assets/usuario.png" alt="Logo-usuario" />
          <div className="flex flex-col">
            <span className="font-bold">{userData.name} {userData.lastname}</span>
            <span className="text-md sm:text-md md:text-lg lg:text-xl xl:text-xl 2xl:text-xl">{userData.speciality?.name || 'Especialidad no especificada'}</span>
          </div>
        </div>
        <div className="ml-3 w-5 h-5">
          <FaChevronDown />
        </div>
        {isOpen && (
          <div className={`${styles.dropdownContent} absolute top-12 right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4`}>
            <a href={`/perfil`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Perfil</a>
            <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Salir</button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Bar;
