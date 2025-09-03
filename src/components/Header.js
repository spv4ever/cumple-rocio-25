// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link
import './Header.css';

const Header = () => {
  return (
    // Haz que toda la cabecera sea un enlace a la página de inicio
    <Link to="/" className="header-link">
      <header className="main-header">
        <h1>Eventos Familiares</h1>
        <p>Coleccionando recuerdos</p>
      </header>
    </Link>
  );
};

export default Header;