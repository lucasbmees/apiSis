import React, { useState } from 'react';
import { FaSearch, FaFilePdf } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExpensesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState([
    { id: 1, descricao: 'Compra de material de escritório', valor: 150.00, data: '2023-10-01' },
    { id: 2, descricao: 'Serviço de limpeza', valor: 250.00, data: '2023-10-02' },
    { id: 3, descricao: 'Despesa de viagem', valor: 500.00, data: '2023-10-03' },
    // Adicione mais despesas como preferir
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary">Despesas Gerais</h1>
      <div className="search-bar mt-4 d-flex justify-content-between align-items-center">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar despesa..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="input-group-text bg-dark text-white">
            <FaSearch />
          </span>
        </div>
      </div>
      <table className="table table-striped table-dark mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.id}</td>
                <td>{expense.descricao}</td>
                <td>R$ {expense.valor.toFixed(2)}</td>
                <td>{expense.data}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Nenhuma despesa encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="text-center mt-4">
        <button className="btn btn-primary">
          <FaFilePdf /> Gerar Relatório
        </button>
      </div>
    </div>
  );
};

export default ExpensesPage;
