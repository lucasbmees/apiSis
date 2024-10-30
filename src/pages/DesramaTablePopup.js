import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const DesramaTablePopup = ({ isOpen, onClose, imovelId }) => {
  const [desramas, setDesramas] = useState([]);

  // Busca as desramas do imóvel ao abrir o popup
  useEffect(() => {
    if (isOpen) {
      axios.get(`http://localhost:5000/api/imoveis/${imovelId}/desramas`)
        .then(response => {
          setDesramas(response.data);
        })
        .catch(error => {
          console.error("Erro ao buscar desramas:", error);
        });
    }
  }, [isOpen, imovelId]);

  if (!isOpen) return null; // Não renderiza o popup se não estiver aberto

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Desramas do Imóvel {imovelId}</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {desramas.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Altura</th>
                    <th>Data</th>
                    <th>Número</th>
                  </tr>
                </thead>
                <tbody>
                  {desramas.map((desrama) => (
                    <tr key={desrama.id}>
                      <td>{desrama.id}</td>
                      <td>{desrama.altura}</td>
                      <td>{new Date(desrama.data).toLocaleDateString('pt-BR')}</td>
                      <td>{desrama.numero}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">Não há desramas cadastradas para este imóvel.</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesramaTablePopup;
