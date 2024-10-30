import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilePdf } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExpensesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  useEffect(() => {
    // Busca todas as despesas da API
    fetch('http://localhost:5000/api/despesas')
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((error) => console.error('Erro ao buscar despesas:', error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (expense) => {
    if (selectedExpenses.includes(expense)) {
      setSelectedExpenses(selectedExpenses.filter((item) => item.id !== expense.id));
    } else {
      setSelectedExpenses([...selectedExpenses, expense]);
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Despesas', 20, 10);

    // Tabela com despesas selecionadas
    const tableData = selectedExpenses.map((expense) => [
      expense.id,
      expense.descricao,
      `R$ ${expense.valor.toFixed(2)}`,
      expense.data,
    ]);

    doc.autoTable({
      head: [['ID', 'Descrição', 'Valor', 'Data']],
      body: tableData,
    });

    doc.save('relatorio-despesas.pdf');
  };

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
            <th></th>
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
                <td>
                  <input
                    type="checkbox"
                    checked={selectedExpenses.includes(expense)}
                    onChange={() => handleCheckboxChange(expense)}
                  />
                </td>
                <td>{expense.id}</td>
                <td>{expense.descricao}</td>
                <td>R$ {expense.valor.toFixed(2)}</td>
                <td>{expense.data}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Nenhuma despesa encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleGeneratePDF}>
          <FaFilePdf /> Gerar Relatório PDF
        </button>
      </div>
    </div>
  );
};

export default ExpensesPage;
