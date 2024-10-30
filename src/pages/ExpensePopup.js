import React, { useState } from 'react';

const ExpensePopup = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verifica se o valor não é negativo
    if (formData.amount <= 0) {
      alert('O valor da despesa deve ser positivo.');
      return;
    }

    onSave(formData);
    onClose(); // Fechar o popup após salvar
  };

  if (!isOpen) return null; // Se o popup não estiver aberto, não renderiza nada

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Cadastrar Despesa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Descrição:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Valor:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Data:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-save">Salvar</button>
          <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default ExpensePopup;
