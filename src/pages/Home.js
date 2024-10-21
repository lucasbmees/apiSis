import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      <h1>Gerencie seus Imóveis com Facilidade</h1>
      <p>Bem-vindo ao sistema de gerenciamento de imóveis. Escolha uma das opções abaixo para continuar:</p>

      <div className="d-flex justify-content-center mt-4">
        <div className="btn-group" role="group">
          <Link to="/cadastro-imoveis" className="btn btn-custom">Cadastro de Imóveis</Link>
          <Link to="/view-imoveis" className="btn btn-custom">Visualizar Imóveis</Link>
          <Link to="/despesas-gerais" className="btn btn-custom">Despesas Gerais</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
