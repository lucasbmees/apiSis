// DesbasteTablePopup.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const DesbasteTablePopup = ({ isOpen, onClose, imovelId }) => {
  const [desbasteData, setDesbasteData] = useState([]);

  // Busca os desbastes do imóvel ao abrir o popup
  useEffect(() => {
    const fetchDesbastes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/imoveis/${imovelId}/desbastes`);
        setDesbasteData(response.data);
      } catch (error) {
        console.error("Erro ao buscar desbastes:", error);
      }
    };

    if (isOpen) {
      fetchDesbastes();
    }
  }, [isOpen, imovelId]);

  if (!isOpen) return null;

  return (
    <div className="modal fade show modalDesbaste" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content modalDesbasteContent">
          <div className="modal-body modalDesbasteBody">
            <h5 className="modal-title text-center">Desbastes do Imóvel {imovelId}</h5>
            {desbasteData.length > 0 ? (
              <table className="table table-striped modalDesbasteTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Número</th>
                    <th>Data</th>
                    <th>Árvores Cortadas</th>
                    <th>Lenha</th>
                    <th>Toretes</th>
                    <th>Toras 20-25 cm</th>
                    <th>Toras 25-33 cm</th>
                    <th>Toras Acima de 33 cm</th>
                    <th>Preço Lenha</th>
                    <th>Preço Toretes</th>
                    <th>Preço Toras 20-25 cm</th>
                    <th>Preço Toras 25-33 cm</th>
                    <th>Preço Toras Acima de 33 cm</th>
                    <th>Valor Extração</th>
                  </tr>
                </thead>
                <tbody>
                  {desbasteData.map((desbaste) => (
                    <tr key={desbaste.id}>
                      <td>{desbaste.id}</td>
                      <td>{desbaste.numero}</td>
                      <td>{new Date(desbaste.data).toLocaleDateString('pt-BR')}</td>
                      <td>{desbaste.arvores_cortadas}</td>
                      <td>{desbaste.lenha}</td>
                      <td>{desbaste.toretes}</td>
                      <td>{desbaste.toras_20_25cm}</td>
                      <td>{desbaste.toras_25_33cm}</td>
                      <td>{desbaste.toras_acima_33cm}</td>
                      <td>{desbaste.preco_lenha}</td>
                      <td>{desbaste.preco_toretes}</td>
                      <td>{desbaste.preco_toras_20_25cm}</td>
                      <td>{desbaste.preco_toras_25_33cm}</td>
                      <td>{desbaste.preco_toras_acima_33cm}</td>
                      <td>{desbaste.valor_extracao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">Nenhum desbaste registrado para este imóvel.</p>
            )}
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesbasteTablePopup;
