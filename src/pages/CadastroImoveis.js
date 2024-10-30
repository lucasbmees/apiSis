import React, { useState } from 'react';

const CadastroImoveis = () => {
  const [formData, setFormData] = useState({
    descricao: '',
    area_imovel: '',
    area_plantio: '',
    especie: '',
    origem: '',
    num_arvores_plantadas: '',
    num_arvores_cortadas: '',
    num_arvores_remanescentes: '',
    num_arvores_por_hectare: '',
    matricula: '',
    data_plantio: '',
    data_contrato: '',
    vencimento_contrato: '',
    numero_ccir: '',
    numero_itr: '',
    proprietario: '',
    arrendatario: '',
    municipio: '',
    localidade: '',
    altura_desrama: '',
  });

  const [isArrendado, setIsArrendado] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/imoveis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      alert('Imóvel cadastrado com sucesso!');
      setFormData({
        descricao: '',
        area_imovel: '',
        area_plantio: '',
        especie: '',
        origem: '',
        num_arvores_plantadas: '',
        num_arvores_cortadas: '',
        num_arvores_remanescentes: '',
        num_arvores_por_hectare: '',
        matricula: '',
        data_plantio: '',
        data_contrato: '',
        vencimento_contrato: '',
        numero_ccir: '',
        numero_itr: '',
        proprietario: '',
        arrendatario: '',
        municipio: '',
        localidade: '',
        altura_desrama: '',
      });
    } else {
      alert('Erro ao cadastrar o imóvel.');
    }
  };

  const toggleTipoImovel = (tipo) => {
    setIsArrendado(tipo === 'arrendado');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Cadastro de Imóveis</h1>
      
      <div className="text-center mb-4">
        <button type="button" className={`btn btn-secondary mx-2 ${!isArrendado ? 'active' : ''}`} onClick={() => toggleTipoImovel('proprio')}>Próprio</button>
        <button type="button" className={`btn btn-secondary mx-2 ${isArrendado ? 'active' : ''}`} onClick={() => toggleTipoImovel('arrendado')}>Arrendado</button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <input type="text" className="form-control" id="descricao" value={formData.descricao} onChange={handleChange} placeholder="Digite a descrição do imóvel" required />
        </div>
        <div className="form-group">
          <label htmlFor="area_imovel">Área do Imóvel</label>
          <input type="number" className="form-control" id="area_imovel" value={formData.area_imovel} onChange={handleChange} placeholder="Digite a área do imóvel" required />
        </div>
        <div className="form-group">
          <label htmlFor="area_plantio">Área de Plantio</label>
          <input type="number" className="form-control" id="area_plantio" value={formData.area_plantio} onChange={handleChange} placeholder="Digite a área de plantio" required />
        </div>
        <div className="form-group">
          <label htmlFor="especie">Espécie</label>
          <input type="text" className="form-control" id="especie" value={formData.especie} onChange={handleChange} placeholder="Digite a espécie" required />
        </div>
        <div className="form-group">
          <label htmlFor="origem">Origem</label>
          <input type="text" className="form-control" id="origem" value={formData.origem} onChange={handleChange} placeholder="Digite a origem" required />
        </div>
        <div className="form-group">
          <label htmlFor="num_arvores_plantadas">Número de Árvores Plantadas</label>
          <input type="number" className="form-control" id="num_arvores_plantadas" value={formData.num_arvores_plantadas} onChange={handleChange} placeholder="Digite o número de árvores plantadas" required />
        </div>
        <div className="form-group">
          <label htmlFor="num_arvores_cortadas">Número de Árvores Cortadas</label>
          <input type="number" className="form-control" id="num_arvores_cortadas" value={formData.num_arvores_cortadas} onChange={handleChange} placeholder="Digite o número de árvores cortadas" required />
        </div>
        <div className="form-group">
          <label htmlFor="num_arvores_remanescentes">Número de Árvores Remanescentes</label>
          <input type="number" className="form-control" id="num_arvores_remanescentes" value={formData.num_arvores_remanescentes} onChange={handleChange} placeholder="Digite o número de árvores remanescentes" required />
        </div>
        <div className="form-group">
          <label htmlFor="num_arvores_por_hectare">Número de Árvores por Hectare</label>
          <input type="number" className="form-control" id="num_arvores_por_hectare" value={formData.num_arvores_por_hectare} onChange={handleChange} placeholder="Digite o número de árvores por hectare" required />
        </div>
        <div className="form-group">
          <label htmlFor="matricula">Matrícula</label>
          <input type="text" className="form-control" id="matricula" value={formData.matricula} onChange={handleChange} placeholder="Digite a matrícula" required />
        </div>
        <div className="form-group">
          <label htmlFor="data_plantio">Data de Plantio</label>
          <input type="date" className="form-control" id="data_plantio" value={formData.data_plantio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="data_contrato">Data do Contrato</label>
          <input type="date" className="form-control" id="data_contrato" value={formData.data_contrato} onChange={handleChange} required />
        </div>

        {isArrendado && (
          <>
            <div className="form-group">
              <label htmlFor="vencimento_contrato">Vencimento do Contrato</label>
              <input type="date" className="form-control" id="vencimento_contrato" value={formData.vencimento_contrato} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="arrendatario">Arrendatário</label>
              <input type="text" className="form-control" id="arrendatario" value={formData.arrendatario} onChange={handleChange} placeholder="Digite o nome do arrendatário" required />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="numero_ccir">Número do CCIR</label>
          <input type="text" className="form-control" id="numero_ccir" value={formData.numero_ccir} onChange={handleChange} placeholder="Digite o número do CCIR" required />
        </div>
        <div className="form-group">
          <label htmlFor="numero_itr">Número do ITR</label>
          <input type="text" className="form-control" id="numero_itr" value={formData.numero_itr} onChange={handleChange} placeholder="Digite o número do ITR" required />
        </div>
        <div className="form-group">
          <label htmlFor="proprietario">Proprietário</label>
          <input type="text" className="form-control" id="proprietario" value={formData.proprietario} onChange={handleChange} placeholder="Digite o nome do proprietário" required />
        </div>
        <div className="form-group">
          <label htmlFor="municipio">Município</label>
          <input type="text" className="form-control" id="municipio" value={formData.municipio} onChange={handleChange} placeholder="Digite o nome do município" required />
        </div>
        <div className="form-group">
          <label htmlFor="localidade">Localidade</label>
          <input type="text" className="form-control" id="localidade" value={formData.localidade} onChange={handleChange} placeholder="Digite a localidade" required />
        </div>
        <div className="form-group">
          <label htmlFor="altura_desrama">Altura da Desrama</label>
          <input type="number" className="form-control" id="altura_desrama" value={formData.altura_desrama} onChange={handleChange} placeholder="Digite a altura da desrama" required />
        </div>

        <button type="submit" className="btn btn-primary btn-block">Cadastrar Imóvel</button>
      </form>
    </div>
  );
};

export default CadastroImoveis;
