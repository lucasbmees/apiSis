import React, { useState } from "react";

const RegisterDesramaPopup = ({ isOpen, onClose, imovelId }) => {
  const [desrama, setDesrama] = useState({
    altura: "",
    numero: "",
    data: "",
  });

  const handleChange = (e) => {
    setDesrama({ ...desrama, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/imoveis/${imovelId}/desramas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(desrama),
      });
      if (!response.ok) {
        throw new Error("Erro ao registrar desrama");
      }
      // Sucesso
      onClose(); // Fecha o modal após o sucesso
    } catch (error) {
      console.error("Erro ao registrar desrama:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Registrar Desrama</h2>
      <div className="form-group">
        <label>Altura:</label>
        <input
          type="text"
          name="altura"
          value={desrama.altura}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Número:</label>
        <input
          type="number"
          name="numero"
          value={desrama.numero}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Data:</label>
        <input
          type="date"
          name="data"
          value={desrama.data}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <button onClick={handleSubmit} className="btn btn-primary">
        Registrar
      </button>
      <button onClick={onClose} className="btn btn-secondary">
        Cancelar
      </button>
    </div>
  );
};

export default RegisterDesramaPopup;
