import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ViewImoveis = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [imoveis, setImoveis] = useState([]);

  const fetchImoveis = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/imoveis');
      const data = await response.json();
      setImoveis(data);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    }
  };

  useEffect(() => {
    fetchImoveis();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredImoveis = imoveis.filter((imovel) =>
    imovel.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center">Visualização de Imóveis</h1>

      <div className="search-bar mt-4 d-flex justify-content-between align-items-center">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar imóvel..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
        <button className="btn btn-success ms-2">
          <FaFilter /> Filtrar
        </button>
      </div>

      <div className="imoveis-list mt-4">
        {filteredImoveis.length > 0 ? (
          filteredImoveis.map((imovel) => (
            <Link to={`/imovel/${imovel.id}`} key={imovel.id} className="text-decoration-none">
              <div className="imovel-card card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{imovel.descricao}</h5>
                  <p className="card-text">Área do Imóvel: {imovel.area_imovel} m²</p>
                  <p className="card-text">Espécie: {imovel.especie}</p>
                  <p className="card-text">Proprietário: {imovel.proprietario}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center">Nenhum imóvel encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ViewImoveis;
