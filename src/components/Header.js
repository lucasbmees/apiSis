import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.png'; // Importando a imagem diretamente

const Header = () => {
  return (
    <nav className="navbar navbar-light navbar-custom">
      <Link className="navbar-brand" to="/">
        <img src={logo} width="200" height="100" alt="Logo" />
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarText">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cadastro-imoveis">Cadastro</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/visualizar-imoveis">Imóveis</Link>
          </li>
        </ul>
        <span className="navbar-text">Bem-vindo ao nosso sistema</span>
      </div>
    </nav>
  );
};

export default Header;
