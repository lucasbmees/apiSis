// ReportModal.js
import React from 'react';
import jsPDF from 'jspdf';

const ReportModal = ({ isOpen, onClose, imovel, selectedFields, setSelectedFields }) => {
  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.text("Relatório do Imóvel", 10, 10);

    const reportData = Object.keys(selectedFields)
      .filter((key) => selectedFields[key])
      .map((key) => `${key.replace(/_/g, " ").toUpperCase()}: ${imovel[key] || "N/A"}`)
      .join("\n");

    doc.text(reportData, 10, 20);
    doc.save("relatorio_imovel.pdf");
    onClose(); // Fechar o modal após gerar o relatório
  };

  const handleFieldChange = (e) => {
    setSelectedFields({ ...selectedFields, [e.target.name]: e.target.checked });
  };

  if (!isOpen) return null; // Não renderizar nada se o modal não estiver aberto

  return (
    <div className="modal">
      <h2>Selecione as Propriedades para o Relatório</h2>
      {Object.keys(imovel).map(
        (key) =>
          key !== "id" && (
            <div key={key} className="form-group">
              <input
                type="checkbox"
                name={key}
                checked={!!selectedFields[key]}
                onChange={handleFieldChange}
              />
              <label>{key.replace(/_/g, " ").toUpperCase()}</label>
            </div>
          )
      )}
      <button onClick={handleGenerateReport} className="btn btn-primary">
        Gerar
      </button>
      <button onClick={onClose} className="btn btn-secondary">
        Cancelar
      </button>
    </div>
  );
};

export default ReportModal;
