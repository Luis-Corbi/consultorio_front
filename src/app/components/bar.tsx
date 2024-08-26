"use client";
import React, { useState } from 'react';
import Cookies from 'js-cookie'; // Importa js-cookie para manejar cookies

import styles from '../components/dropdown.module.css';
import Icondown from '../icons/down.jsx';
import NotificationIcon from '../icons/notification';

const buttonClasses = 'inline-flex items-center bg-secondary text-secondary-foreground p-2 rounded-lg hover:bg-secondary/80';
const dropdownClasses = 'absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg';

const Bar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Cookies.remove('access_token'); // Borra el token de las cookies
    window.location.href = '/'; // Redirige al login
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <span>Bienvenido, <span className={styles.username}>Daniel!</span></span>
      </div>
      <div className={styles.icons}>
        <div className={styles.notification}>
          <NotificationIcon />
        </div>
        <div className={styles.user} onClick={toggleDropdown}>
          <div className={styles.userDetails}>
            <div className={styles.avatar}></div>
            <div className={styles.info}>
              <span className={styles.name}>DR. Daniel</span>
              <span className={styles.role}>Dentista</span>
            </div>
          </div>
          <div className={styles.dropdownArrow}><Icondown /> </div>
          {isOpen && (
            <div className={styles.dropdownContent}>
              <a href="#">Perfil</a>
              <a href="#">Configuración</a>
              <a href="#" onClick={handleLogout}>Salir</a> {/* Usa handleLogout para el clic */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bar;
