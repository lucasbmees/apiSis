import React, { useState, useEffect } from "react";

const DesramaTable = ({ imovelId }) => {
  const [desramas, setDesramas] = useState([]);

  useEffect(() => {
    fetchDesramas();
  }, [imovelId]);

  const fetchDesramas = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/imoveis/${imovelId}/desramas`);
      const data = await response.json();
      setDesramas(data);
    } catch (error) {
      console.error("Erro ao buscar desramas:", error);
    }
  };

  return (
    <div className="table-container">
      <h2>Desramas Registradas</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Altura</th>
            <th>Número</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {desramas.map((desrama) => (
            <tr key={desrama.id}>
              <td>{desrama.altura}</td>
              <td>{desrama.numero}</td>
              <td>{desrama.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesramaTable;
