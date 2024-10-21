import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

const ImovelDetails = () => {
  const { id } = useParams();
  const [imovel, setImovel] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({});
  const [images, setImages] = useState([]);
  const [imageInput, setImageInput] = useState(null);

  // Fetch property details
  const fetchImovelDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/imoveis/${id}`);
      if (!response.ok) throw new Error("Imóvel não encontrado");
      const data = await response.json();
      setImovel(data);
      // Fetch images separately
      fetchImages(data.id);
    } catch (error) {
      console.error("Erro ao buscar detalhes do imóvel:", error);
      setImovel(undefined);
    }
  };

  // Fetch images associated with the property
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

  // Handle input changes
  const handleChange = (e) => {
    setImovel({ ...imovel, [e.target.name]: e.target.value });
  };

  // Handle property update
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

  // Generate report as PDF
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

  // Handle field selection for report
  const handleFieldChange = (e) => {
    setSelectedFields({ ...selectedFields, [e.target.name]: e.target.checked });
  };

  // Handle image upload
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
      fetchImages(id); // Refresh images after upload
      setImageInput(null);
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
    }
  };

  // Handle image removal
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
      fetchImages(id); // Refresh images after deletion
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
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
            className="btn btn-warning"
          >
            Editar
          </button>
        </div>
      )}

      <div className="button-group mt-4">
        <button onClick={() => setIsReportModalOpen(true)} className="btn">
          Gerar Relatório
        </button>
        <button onClick={() => setIsImageModalOpen(true)} className="btn">
          Ver Imagens
        </button>
        <button className="btn">Despesa</button>
        <button className="btn">Desrama</button>
        <button className="btn">Desbaste</button>
        <button className="btn">Inventário</button>
      </div>

      {/* Modal para Gerar Relatório */}
      {isReportModalOpen && (
        <div className="modal">
          <h2>Selecione as Propriedades para o Relatório</h2>
          {Object.keys(imovel).map(
            (key) =>
              key !== "id" && (
                <div key={key} className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name={key}
                      checked={selectedFields[key] || false}
                      onChange={handleFieldChange}
                    />
                    {key.replace(/_/g, " ").toUpperCase()}
                  </label>
                </div>
              )
          )}
          <button onClick={handleGenerateReport} className="btn btn-primary">
            Gerar PDF
          </button>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="btn btn-secondary"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Modal para Gerenciar Imagens */}
      {isImageModalOpen && (
        <div className="modal">
          <h2>Gerenciar Imagens</h2>
          <input
            type="file"
            onChange={(e) => setImageInput(e.target.files[0])}
          />
          <button onClick={handleImageUpload} className="btn btn-primary">
            Adicionar Imagem
          </button>
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="btn btn-secondary"
          >
            Fechar
          </button>

          <div className="image-list mt-3">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <img
                  src={`http://localhost:5000/${image.file_path}`}
                  alt={`Imagem ${index}`}
                  style={{ width: "100px", height: "100px" }}
                />

                <button
                  onClick={() => handleImageRemove(image.file_path)}
                  className="btn btn-danger"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImovelDetails;
