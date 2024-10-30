import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExpenseTablePopup = ({ isOpen, imovelId, onClose }) => {
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Busca as despesas quando o popup estiver aberto
      fetch(`http://localhost:5000/api/imoveis/${imovelId}/despesas`)
        .then((res) => res.json())
        .then((data) => setDespesas(data))
        .catch((err) => console.error('Erro ao buscar despesas:', err));
    }
  }, [isOpen, imovelId]);

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Despesas do Imóvel {imovelId}</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {despesas.length > 0 ? (
                  despesas.map((despesa) => (
                    <tr key={despesa.id}>
                      <td>{despesa.descricao}</td>
                      <td>{despesa.valor}</td>
                      <td>{new Date(despesa.data).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">Nenhuma despesa encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
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

export default ExpenseTablePopup;
