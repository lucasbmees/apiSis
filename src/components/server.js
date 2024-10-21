const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

// Verifica se a pasta "uploads" existe, se não, cria
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Rota para servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(uploadsDir));

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./imoveis.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar as tabelas se não existirem
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS imoveis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT,
    area_imovel REAL,
    area_plantio REAL,
    especie TEXT,
    origem TEXT,
    num_arvores_plantadas INTEGER,
    num_arvores_cortadas INTEGER,
    num_arvores_remanescentes INTEGER,
    num_arvores_por_hectare INTEGER,
    matricula TEXT,
    data_plantio TEXT,
    data_contrato TEXT,
    vencimento_contrato TEXT,
    numero_ccir TEXT,
    numero_itr TEXT,
    proprietario TEXT,
    arrendatario TEXT,
    municipio TEXT,
    localidade TEXT,
    altura_desrama TEXT
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS imagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imovel_id INTEGER,
    file_path TEXT,
    FOREIGN KEY (imovel_id) REFERENCES imoveis(id)
  );`);
});

// Rota para cadastrar um imóvel
app.post('/api/imoveis', (req, res) => {
  const { descricao, area_imovel, area_plantio, especie, origem, num_arvores_plantadas, num_arvores_cortadas, num_arvores_remanescentes, num_arvores_por_hectare, matricula, data_plantio, data_contrato, vencimento_contrato, numero_ccir, numero_itr, proprietario, arrendatario, municipio, localidade, altura_desrama } = req.body;

  const sql = `INSERT INTO imoveis (descricao, area_imovel, area_plantio, especie, origem, num_arvores_plantadas, num_arvores_cortadas, num_arvores_remanescentes, num_arvores_por_hectare, matricula, data_plantio, data_contrato, vencimento_contrato, numero_ccir, numero_itr, proprietario, arrendatario, municipio, localidade, altura_desrama) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [descricao, area_imovel, area_plantio, especie, origem, num_arvores_plantadas, num_arvores_cortadas, num_arvores_remanescentes, num_arvores_por_hectare, matricula, data_plantio, data_contrato, vencimento_contrato, numero_ccir, numero_itr, proprietario, arrendatario, municipio, localidade, altura_desrama], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Rota para buscar todos os imóveis
app.get('/api/imoveis', (req, res) => {
  db.all('SELECT * FROM imoveis', [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Rota para buscar um imóvel específico
app.get('/api/imoveis/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM imoveis WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Imóvel não encontrado' });
    }
    res.json(row);
  });
});

// Rota para atualizar um imóvel específico
app.put('/api/imoveis/:id', (req, res) => {
  const id = req.params.id;
  const { descricao, area_imovel, area_plantio, especie, origem, num_arvores_plantadas, num_arvores_cortadas, num_arvores_remanescentes, num_arvores_por_hectare, matricula, data_plantio, data_contrato, vencimento_contrato, numero_ccir, numero_itr, proprietario, arrendatario, municipio, localidade, altura_desrama } = req.body;

  const sql = `UPDATE imoveis SET descricao = ?, area_imovel = ?, area_plantio = ?, especie = ?, origem = ?, num_arvores_plantadas = ?, num_arvores_cortadas = ?, num_arvores_remanescentes = ?, num_arvores_por_hectare = ?, matricula = ?, data_plantio = ?, data_contrato = ?, vencimento_contrato = ?, numero_ccir = ?, numero_itr = ?, proprietario = ?, arrendatario = ?, municipio = ?, localidade = ?, altura_desrama = ? WHERE id = ?`;

  db.run(sql, [descricao, area_imovel, area_plantio, especie, origem, num_arvores_plantadas, num_arvores_cortadas, num_arvores_remanescentes, num_arvores_por_hectare, matricula, data_plantio, data_contrato, vencimento_contrato, numero_ccir, numero_itr, proprietario, arrendatario, municipio, localidade, altura_desrama, id], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(200).json({ message: 'Imóvel atualizado com sucesso' });
  });
});

// Rota para adicionar uma imagem a um imóvel
app.post('/api/imoveis/:id/imagens', upload.single('image'), (req, res) => {
  const imovelId = req.params.id;
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const filePath = req.file.path.replace(/\\/g, '/'); // Normaliza o caminho
  db.run(`INSERT INTO imagens (imovel_id, file_path) VALUES (?, ?)`, [imovelId, filePath], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, path: filePath });
  });
});

// Rota para buscar todas as imagens de um imóvel
app.get('/api/imoveis/:id/imagens', (req, res) => {
  const imovelId = req.params.id;
  db.all(`SELECT file_path FROM imagens WHERE imovel_id = ?`, [imovelId], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Rota para remover uma imagem de um imóvel
app.delete('/api/imoveis/:id/imagens', (req, res) => {
  const imovelId = req.params.id;
  const { file_path } = req.body;

  db.run(`DELETE FROM imagens WHERE imovel_id = ? AND file_path = ?`, [imovelId, file_path], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Imagem removida com sucesso' });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
