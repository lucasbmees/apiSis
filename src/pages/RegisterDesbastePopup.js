import React, { useState } from "react";

const RegisterDesbastePopup = ({ isOpen, onClose, imovelId }) => {
  const [desbaste, setDesbaste] = useState({
    numero: "",
    data: "",
    arvores_cortadas: "",
    lenha: "",
    toretes: "",
    toras_20_25cm: "",
    toras_25_33cm: "",
    toras_acima_33cm: "",
    preco_lenha: "",
    preco_toretes: "",
    preco_toras_20_25cm: "",
    preco_toras_25_33cm: "",
    preco_toras_acima_33cm: "",
    valor_extracao: "",
  });

  const handleChange = (e) => {
    setDesbaste({ ...desbaste, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/imoveis/${imovelId}/desbastes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(desbaste), // Não é necessário incluir imovel_id, pois está no URL
      });
      if (!response.ok) throw new Error("Erro ao adicionar desbaste");
      onClose(); // Fecha o popup após o sucesso
    } catch (error) {
      console.error("Erro ao registrar desbaste:", error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Registrar Desbaste</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Restante do formulário permanece igual */}
          <div className="form-group">
            <label>Número</label>
            <input
              type="number"
              name="numero"
              value={desbaste.numero}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              name="data"
              value={desbaste.data}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Árvores Cortadas</label>
            <input
              type="number"
              name="arvores_cortadas"
              value={desbaste.arvores_cortadas}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Lenha (m³)</label>
            <input
              type="number"
              name="lenha"
              value={desbaste.lenha}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Toretes (m³)</label>
            <input
              type="number"
              name="toretes"
              value={desbaste.toretes}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Toras 20-25cm (m³)</label>
            <input
              type="number"
              name="toras_20_25cm"
              value={desbaste.toras_20_25cm}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Toras 25-33cm (m³)</label>
            <input
              type="number"
              name="toras_25_33cm"
              value={desbaste.toras_25_33cm}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Toras acima de 33cm (m³)</label>
            <input
              type="number"
              name="toras_acima_33cm"
              value={desbaste.toras_acima_33cm}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Preço da Lenha</label>
            <input
              type="number"
              name="preco_lenha"
              value={desbaste.preco_lenha}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Preço dos Toretes</label>
            <input
              type="number"
              name="preco_toretes"
              value={desbaste.preco_toretes}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Preço das Toras 20-25cm</label>
            <input
              type="number"
              name="preco_toras_20_25cm"
              value={desbaste.preco_toras_20_25cm}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Preço das Toras 25-33cm</label>
            <input
              type="number"
              name="preco_toras_25_33cm"
              value={desbaste.preco_toras_25_33cm}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Preço das Toras acima de 33cm</label>
            <input
              type="number"
              name="preco_toras_acima_33cm"
              value={desbaste.preco_toras_acima_33cm}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Valor da Extração</label>
            <input
              type="number"
              name="valor_extracao"
              value={desbaste.valor_extracao}
              onChange={handleChange}
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-save">Registrar</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDesbastePopup;
