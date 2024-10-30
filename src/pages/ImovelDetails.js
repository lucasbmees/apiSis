import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import ExpenseTablePopup from "./ExpenseTablePopup";
import RegisterDesramaPopup from "./RegisterDesramaPopup";
import DesramaTablePopup from "./DesramaTablePopup";
import RegisterDesbastePopup from "./RegisterDesbastePopup";
import DesbasteTablePopup from "./DesbasteTablePopup";

const ImovelDetails = () => {
  const { id } = useParams();
  const [isDesbasteTableOpen, setIsDesbasteTableOpen] = useState(false);
  const [isDesramaTableOpen, setIsDesramaTableOpen] = useState(false);
  const [desramaData, setDesramaData] = useState([]);
  const [despesa, setDespesa] = useState({
    descricao: "",
    valor: "",
    data: "",
  });
  const [isExpensePopupOpen, setIsExpensePopupOpen] = useState(false);
  const [isDesramaPopupOpen, setIsDesramaPopupOpen] = useState(false);
  const [isDesbastePopupOpen, setIsDesbastePopupOpen] = useState(false);
  const [imovel, setImovel] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({});
  const [images, setImages] = useState([]);
  const [imageInput, setImageInput] = useState(null);
  const [isDespesaModalOpen, setIsDespesaModalOpen] = useState(false);

  // Fetch property details
  const fetchImovelDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/imoveis/${id}`);
      if (!response.ok) throw new Error("Imóvel não encontrado");
      const data = await response.json();
      setImovel(data);
      fetchImages(data.id);
    } catch (error) {
      console.error("Erro ao buscar detalhes do imóvel:", error);
      setImovel(undefined);
    }
  };

  const fetchImages = async (imovelId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/imoveis/${imovelId}/imagens`
      );
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Erro ao buscar imagens do imóvel:", error);
    }
  };

  useEffect(() => {
    fetchImovelDetails();
  }, [id]);

  useEffect(() => {
    const fetchDesramas = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/imoveis/${id}/desramas`
        );
        const data = await response.json();
        setDesramaData(data); // Aqui, salve as desramas no estado
      } catch (error) {
        console.error("Erro ao buscar desramas:", error);
      }
    };

    fetchDesramas();
  }, [id]);

  const handleOpenExpensePopup = () => {
    setIsExpensePopupOpen(true);
  };

  const handleCloseExpensePopup = () => {
    setIsExpensePopupOpen(false);
  };
  const handleOpenDesbastePopup = () => {
    setIsDesbastePopupOpen(true);
  };

  const handleCloseDesbastePopup = () => {
    setIsDesbastePopupOpen(false);
  };

  const handleOpenDesbasteTable = () => {
    setIsDesbasteTableOpen(true);
  };

  const handleCloseDesbasteTable = () => {
    setIsDesbasteTableOpen(false);
  };

  const handleDesramaTableOpen = () => {
    setIsDesramaTableOpen(true);
  };

  const handleDesramaTableClose = () => {
    setIsDesramaTableOpen(false);
  };

  const handleChange = (e) => {
    setImovel({ ...imovel, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/imoveis/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imovel),
      });
      if (!response.ok) throw new Error("Erro ao atualizar imóvel");
      setIsEditing(false);
      fetchImovelDetails();
    } catch (error) {
      console.error("Erro ao atualizar imóvel:", error);
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.text("Relatório do Imóvel", 10, 10);

    const reportData = Object.keys(selectedFields)
      .filter((key) => selectedFields[key])
      .map(
        (key) =>
          `${key.replace(/_/g, " ").toUpperCase()}: ${imovel[key] || "N/A"}`
      )
      .join("\n");

    doc.text(reportData, 10, 20);
    doc.save("relatorio_imovel.pdf");
    setIsReportModalOpen(false);
  };

  const handleFieldChange = (e) => {
    setSelectedFields({ ...selectedFields, [e.target.name]: e.target.checked });
  };

  const handleImageUpload = async () => {
    if (!imageInput) return;

    const formData = new FormData();
    formData.append("image", imageInput);

    try {
      const response = await fetch(
        `http://localhost:5000/api/imoveis/${id}/imagens`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Erro ao enviar imagem");
      fetchImages(id);
      setImageInput(null);
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
    }
  };

  const handleImageRemove = async (imageUrl) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/imoveis/${id}/imagens`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_path: imageUrl }),
        }
      );
      if (!response.ok) throw new Error("Erro ao remover imagem");
      fetchImages(id);
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
    }
  };

  const handleDespesaChange = (e) => {
    setDespesa({ ...despesa, [e.target.name]: e.target.value });
  };

  const handleDespesaSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/despesas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...despesa, imovel_id: id }),
      });
      if (!response.ok) throw new Error("Erro ao adicionar despesa");
      setIsDespesaModalOpen(false);
      fetchImovelDetails();
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
    }
  };

  if (imovel === null) return <p>Carregando...</p>;
  if (imovel === undefined) return <p>Imóvel não encontrado.</p>;

  return (
    <div className="container mt-4">
      <h1>{imovel.descricao}</h1>

      {isEditing ? (
        <div className="edit-form">
          {Object.keys(imovel).map(
            (key) =>
              key !== "id" && (
                <div key={key} className="form-group">
                  <label>{key.replace(/_/g, " ").toUpperCase()}:</label>
                  <input
                    type={typeof imovel[key] === "number" ? "number" : "text"}
                    name={key}
                    value={imovel[key]}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )
          )}
          <button onClick={handleUpdate} className="btn btn-primary">
            Salvar
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div>
          {Object.keys(imovel).map(
            (key) =>
              key !== "id" && (
                <p key={key}>
                  <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                  {imovel[key] || "N/A"}
                </p>
              )
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-success"
          >
            Editar
          </button>
        </div>
      )}

      <div className="button-group mt-4">
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="btn btn-success"
        >
          Gerar Relatório
        </button>
        <button
          onClick={() => setIsImageModalOpen(true)}
          className="btn btn-success"
        >
          Ver Imagens
        </button>
        <button
          onClick={() => setIsDespesaModalOpen(true)}
          className="btn btn-success"
        >
          Adicionar Despesa
        </button>
        <button onClick={handleOpenExpensePopup} className="btn btn-success">
          Ver Despesas
        </button>
        <button
          onClick={() => setIsDesramaPopupOpen(true)}
          className="btn btn-success"
        >
          Registrar Desrama
        </button>
        <button onClick={handleDesramaTableOpen} className="btn btn-success">
          Ver Desramas
        </button>
        <button className="btn btn-success" onClick={handleOpenDesbastePopup}>
          Registrar Desbaste
        </button>
        <button className="btn btn-success" onClick={handleOpenDesbasteTable}>
          Ver Desbastes
        </button>
        <button className="btn btn-success">Inventário</button>
      </div>

      <ExpenseTablePopup
        isOpen={isExpensePopupOpen}
        imovelId={id}
        onClose={handleCloseExpensePopup}
      />

      <DesbasteTablePopup
        isOpen={isDesbasteTableOpen}
        imovelId={id}
        onClose={handleCloseDesbasteTable}
      />

      {/* Componente de Registrar Desrama */}
      <RegisterDesramaPopup
        isOpen={isDesramaPopupOpen}
        onClose={() => setIsDesramaPopupOpen(false)}
        imovelId={id}
      />

      <DesramaTablePopup
        isOpen={isDesramaTableOpen}
        imovelId={id}
        onClose={handleDesramaTableClose}
      />

      <RegisterDesbastePopup
        isOpen={isDesbastePopupOpen}
        onClose={handleCloseDesbastePopup}
        imovelId={id}
      />

      {isReportModalOpen && (
        <div className="custom-modal">
          <h2 className="modal-title">
            Selecione as Propriedades para o Relatório
          </h2>
          <div className="custom-form-group">
            {Object.keys(imovel).map(
              (key) =>
                key !== "id" && (
                  <div key={key} className="custom-checkbox">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name={key}
                        checked={!!selectedFields[key]}
                        onChange={handleFieldChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">
                        {key.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </label>
                  </div>
                )
            )}
          </div>
          <div className="custom-button-group">
            <button
              onClick={handleGenerateReport}
              className="custom-btn custom-btn-primary"
            >
              Gerar
            </button>
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="custom-btn custom-btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal para Gerenciar Imagens */}
      {isImageModalOpen && (
        <div className="modal">
          <h2>Imagens</h2>
          {images.length > 0 ? (
            <div>
              {images.map((img, idx) => (
                <div key={idx} className="image-container">
                  <img src={img} alt={`Imagem ${idx + 1}`} />
                  <button
                    onClick={() => handleImageRemove(img)}
                    className="btn btn-danger"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhuma imagem disponível</p>
          )}
          <input
            type="file"
            onChange={(e) => setImageInput(e.target.files[0])}
          />
          <button onClick={handleImageUpload} className="btn btn-primary">
            Enviar Imagem
          </button>
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="btn btn-secondary"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Modal para adicionar despesas */}
      {isDespesaModalOpen && (
        <div className="modal">
          <h2>Adicionar Despesa</h2>
          <form>
            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                name="descricao"
                value={despesa.descricao}
                onChange={handleDespesaChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Valor</label>
              <input
                type="number"
                name="valor"
                value={despesa.valor}
                onChange={handleDespesaChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                name="data"
                value={despesa.data}
                onChange={handleDespesaChange}
                className="form-control"
              />
            </div>
            <button onClick={handleDespesaSubmit} className="btn btn-primary">
              Adicionar
            </button>
            <button
              onClick={() => setIsDespesaModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ImovelDetails;
