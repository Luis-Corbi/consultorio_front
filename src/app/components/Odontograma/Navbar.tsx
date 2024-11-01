import React from 'react';
import "../../odontograma/navbar.css";

const Navbar = () => {
    return (
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">Inicio</li>
          <li className="navbar-item">Servicios</li>
          <li className="navbar-item">Contacto</li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;