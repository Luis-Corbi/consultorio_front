import React, { useState } from 'react';
import Cookies from 'js-cookie'; // Asegúrate de tener esto instalado
import "../../odontograma/navbar.css";

type UserData = {
  user: number; // Asegúrate de que esto coincide con tu modelo de usuario
};

type NavbarProps = {
  userData: UserData | null; // Asegúrate de que el tipo esté definido
};

const iconDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-2"
    style={{
      marginLeft: '15px',
      width: '20px',
      height: '20px',
    }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ userData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('userData');
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 10px', backgroundColor: '#f8f8f8', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)' }}>
      <div style={{ flex: 1, fontSize: '20px', marginLeft: '250px' }}>
        Bienvenido, {userData ? 'Nombre' : 'Invitado'}!
      </div>

      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={toggleDropdown}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img className="logo_usuario_datos" src="/assets/usuario.png" alt="Logo-usuario" style={{ width: '10px', height: '10px', marginRight: '50px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontStyle: 'arial' }}>Apellido</span>
            <span style={{ fontSize: '12px' }}>ROL</span>
          </div>
        </div>

        {iconDown()} {/* Reemplaza el símbolo de la flecha por el SVG */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '60px',
            backgroundColor: 'white',
            minWidth: '160px',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
            zIndex: 2010
          }}>
            <a href={`/perfil`} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Perfil</a>
            <a href="#" onClick={handleLogout} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Salir</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;