const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const path = require("path"); // Aqui deve ser importado antes do uso

// Criação da pasta "uploads"
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Pasta "uploads" criada com sucesso.`);
}

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Verifica a conexão com o banco
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados MySQL");
  }
});

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || authorization !== "Basic my-simple-token") {
    return res.status(401).json({ error: "Não autorizado" });
  }

  next();
}

// Exemplo de rota protegida
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Você acessou uma rota protegida!" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Usuário e senha são obrigatórios" });
  }

  const sql = "SELECT * FROM usuarios WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    const user = results[0];

    // Verifica a senha
    if (password === user.password) {
      // Idealmente, utilize bcrypt para armazenar senhas
      return res.status(200).json({ message: "Login bem-sucedido" });
    } else {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }
  });
});

// Configuração do Multer para o upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para a imagem
  },
});

const upload = multer({ storage: storage });

  // Configuração do Multer para upload de mapas
  const storageMapas = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = "./mapas";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });

  const uploadMapas = multer({ storage: storageMapas });

  // Configuração do Multer para upload de arquivos
const storageArquivos = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./arquivos";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadArquivos = multer({ storage: storageArquivos });


// Rota para obter todos os imóveis
app.get("/api/imoveis", (req, res) => {
  const sql = "SELECT * FROM imoveis";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Rota para obter os detalhes de um imóvel pelo ID
app.get("/api/imoveis/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM imoveis WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Imóvel não encontrado" });
    }
    res.json(result[0]);
  });
});

// Rota para cadastrar um imóvel
app.post("/api/imoveis", (req, res) => {
  const sql = `INSERT INTO imoveis (
    codigo_cc, descricao, area_imovel, area_plantio, especie, origem,
    num_arvores_plantadas, num_arvores_cortadas, num_arvores_remanescentes,
    num_arvores_por_hectare, matricula, data_plantio, data_contrato, 
    vencimento_contrato, numero_ccir, numero_itr, proprietario, 
    arrendatario, municipio, localidade, altura_desrama, numero_car
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; // Adicionado numero_car

  const values = [
    req.body.codigo_cc,
    req.body.descricao,
    req.body.area_imovel,
    req.body.area_plantio,
    req.body.especie,
    req.body.origem,
    req.body.num_arvores_plantadas,
    req.body.num_arvores_cortadas,
    req.body.num_arvores_remanescentes,
    req.body.num_arvores_por_hectare,
    req.body.matricula,
    req.body.data_plantio,
    req.body.data_contrato,
    req.body.vencimento_contrato,
    req.body.numero_ccir,
    req.body.numero_itr,
    req.body.proprietario,
    req.body.arrendatario,
    req.body.municipio,
    req.body.localidade,
    req.body.altura_desrama,
    req.body.numero_car, // Adicionado no array de valores
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Imóvel cadastrado com sucesso!" });
  });
});

// Rota para editar as informações de um imóvel
app.put("/api/imoveis/:id", (req, res) => {
  const { id } = req.params; // Captura o ID do imóvel
  const {
    descricao,
    area_imovel,
    area_plantio,
    especie,
    origem,
    num_arvores_plantadas,
    num_arvores_cortadas,
    num_arvores_remanescentes,
    num_arvores_por_hectare,
    matricula,
    numero_ccir,
    numero_itr,
    proprietario,
    arrendatario,
    municipio,
    localidade,
    altura_desrama,
    numero_car,
    codigo_cc,
    data_plantio,
    data_contrato,
    vencimento_contrato
  } = req.body; // Captura os dados do imóvel do corpo da requisição

  // SQL para atualizar as informações do imóvel
  const sql = `
    UPDATE imoveis
    SET
      descricao = ?,
      area_imovel = ?,
      area_plantio = ?,
      especie = ?,
      origem = ?,
      num_arvores_plantadas = ?,
      num_arvores_cortadas = ?,
      num_arvores_remanescentes = ?,
      num_arvores_por_hectare = ?,
      matricula = ?,
      numero_ccir = ?,
      numero_itr = ?,
      proprietario = ?,
      arrendatario = ?,
      municipio = ?,
      localidade = ?,
      altura_desrama = ?,
      numero_car = ?,
      codigo_cc = ?,
      data_plantio = ?,
      data_contrato = ?,
      vencimento_contrato = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      descricao,
      area_imovel,
      area_plantio,
      especie,
      origem,
      num_arvores_plantadas,
      num_arvores_cortadas,
      num_arvores_remanescentes,
      num_arvores_por_hectare,
      matricula,
      numero_ccir,
      numero_itr,
      proprietario,
      arrendatario,
      municipio,
      localidade,
      altura_desrama,
      numero_car,
      codigo_cc,
      data_plantio,
      data_contrato,
      vencimento_contrato,
      id
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Imóvel não encontrado." });
      }
      res.status(200).json({ message: "Imóvel atualizado com sucesso." });
    }
  );
});

// Rota para excluir um imóvel pelo ID
app.delete("/api/imoveis/:id", (req, res) => {
  const { id } = req.params;

  // Verificar se o imóvel existe
  const checkSql = "SELECT * FROM imoveis WHERE id = ?";
  db.query(checkSql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Imóvel não encontrado." });
    }

    // Excluir registros associados ao imóvel, como imagens, despesas, etc.
    const deleteImagesSql = "DELETE FROM imagens WHERE imovel_id = ?";
    const deleteDespesasSql = "DELETE FROM despesas WHERE imovel_id = ?";
    const deleteDesramasSql = "DELETE FROM desramas WHERE imovel_id = ?";
    const deleteDesbastesSql = "DELETE FROM desbaste WHERE imovel_id = ?";
    const deleteInventarioSql = "DELETE FROM inventario WHERE imovel_id = ?";
    const deleteImovelSql = "DELETE FROM imoveis WHERE id = ?";

    // Iniciar transação
    db.beginTransaction((transactionErr) => {
      if (transactionErr) {
        return res.status(500).json({ error: "Erro ao iniciar transação." });
      }

      // Excluir imagens associadas
      db.query(deleteImagesSql, [id], (imageErr) => {
        if (imageErr) {
          return db.rollback(() =>
            res.status(500).json({ error: imageErr.message })
          );
        }

        // Excluir despesas associadas
        db.query(deleteDespesasSql, [id], (despesaErr) => {
          if (despesaErr) {
            return db.rollback(() =>
              res.status(500).json({ error: despesaErr.message })
            );
          }

          // Excluir desramas associadas
          db.query(deleteDesramasSql, [id], (desramaErr) => {
            if (desramaErr) {
              return db.rollback(() =>
                res.status(500).json({ error: desramaErr.message })
              );
            }

            // Excluir desbastes associados
            db.query(deleteDesbastesSql, [id], (desbasteErr) => {
              if (desbasteErr) {
                return db.rollback(() =>
                  res.status(500).json({ error: desbasteErr.message })
                );
              }

              // Excluir inventário associado
              db.query(deleteInventarioSql, [id], (inventarioErr) => {
                if (inventarioErr) {
                  return db.rollback(() =>
                    res.status(500).json({ error: inventarioErr.message })
                  );
                }

                // Excluir o imóvel
                db.query(deleteImovelSql, [id], (imovelErr) => {
                  if (imovelErr) {
                    return db.rollback(() =>
                      res.status(500).json({ error: imovelErr.message })
                    );
                  }

                  // Confirmar transação
                  db.commit((commitErr) => {
                    if (commitErr) {
                      return db.rollback(() =>
                        res
                          .status(500)
                          .json({ error: "Erro ao confirmar transação." })
                      );
                    }

                    res.status(200).json({
                      message: "Imóvel e registros associados excluídos com sucesso.",
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

// Rota para verificar se o código CC já existe
app.get("/api/verificarCodigoCC", (req, res) => {
  const { codigo_cc } = req.query; // Obtém o código CC via query string

  if (!codigo_cc) {
    return res.status(400).json({ error: "Código CC é obrigatório." });
  }

  const sql = "SELECT * FROM imoveis WHERE codigo_cc = ?";

  db.query(sql, [codigo_cc], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res.json({ exists: true }); // Se o código CC já existe
    } else {
      return res.json({ exists: false }); // Se o código CC não existe
    }
  });
});

// Rota para registrar uma despesa específica associada a um imóvel
app.post("/api/imoveis/:id/despesas", (req, res) => {
  const { id } = req.params; // ID do imóvel
  const {
    data,
    descricao,
    numero_nota_fiscal,
    fornecedor,
    produto,
    unidade,
    quantidade,
    valor_unitario,
    total,
    tipo_de_despesa,
    validade,
  } = req.body;

  // Validação dos campos obrigatórios
  if (
    !data ||
    !descricao ||
    !numero_nota_fiscal ||
    !fornecedor ||
    !produto ||
    !unidade ||
    quantidade === undefined ||
    valor_unitario === undefined ||
    total === undefined ||
    !tipo_de_despesa ||
    !validade
  ) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  // Inserção da despesa no banco de dados
  const sql = `
    INSERT INTO despesas (
      imovel_id, data, descricao, numero_nota_fiscal, fornecedor, produto,
      unidade, quantidade, valor_unitario, total, tipo_de_despesa, validade
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id, data, descricao, numero_nota_fiscal, fornecedor, produto, unidade,
    quantidade, valor_unitario, total, tipo_de_despesa, validade
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Despesa registrada com sucesso!" });
  });
});

app.get("/api/imoveis/:id/despesas", (req, res) => {
  const { id } = req.params; // Captura o ID do imóvel

  // SQL para buscar as despesas associadas ao imóvel e o código CC do imóvel
  const sql = `
    SELECT despesas.*, imoveis.codigo_cc
    FROM despesas
    INNER JOIN imoveis ON despesas.imovel_id = imoveis.id
    WHERE imoveis.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Nenhuma despesa encontrada para este imóvel." });
    }
    res.json(results);  // Envia os resultados da consulta para o frontend, agora com o código cc
  });
});

app.get("/api/despesas", (req, res) => {
  // Modificando a consulta para incluir todos os campos das despesas e a descrição do imóvel
  const sql = `
    SELECT despesas.*, imoveis.descricao AS descricao_imovel
    FROM despesas
    JOIN imoveis ON despesas.imovel_id = imoveis.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post("/api/imoveis/:id/desramas/previsao", (req, res) => {
  const { id } = req.params;
  const { previsao } = req.body;

  if (!previsao) {
    return res.status(400).json({ error: "O campo 'previsao' é obrigatório." });
  }

  const insertPrevisaoSql = `
    INSERT INTO desramas (imovel_id, previsao, altura, data, numero)
    VALUES (?, ?, NULL, NULL, NULL)
  `;

  db.query(insertPrevisaoSql, [id, previsao], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: "Previsão de desrama cadastrada com sucesso!" });
  });
});

app.get("/api/imoveis/:id/desramas/previsoes", (req, res) => {
  const { id } = req.params; // Captura o ID do imóvel

  const selectPrevisoesSql = `
    SELECT * 
    FROM desramas 
    WHERE imovel_id = ? 
      AND altura IS NULL 
      AND data IS NULL 
      AND numero IS NULL 
      AND previsao IS NOT NULL
  `;

  db.query(selectPrevisoesSql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Nenhuma previsão encontrada para este imóvel." });
    }

    res.status(200).json(results);
  });
});


app.put("/api/desramas/:id", (req, res) => {
  const { id } = req.params; // ID da desrama
  const { altura, data, numero } = req.body;

  if (!altura || !data || !numero) {
    return res.status(400).json({ error: "Todos os campos (altura, data, numero) são obrigatórios." });
  }

  const updateDesramaSql = `
    UPDATE desramas
    SET altura = ?, data = ?, numero = ?
    WHERE id = ?
  `;

  db.query(updateDesramaSql, [altura, data, numero, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Primeiro, obtemos o `imovel_id` relacionado à desrama
    const getImovelIdSql = `
      SELECT imovel_id FROM desramas WHERE id = ?
    `;

    db.query(getImovelIdSql, [id], (getErr, rows) => {
      if (getErr) {
        return res.status(500).json({ error: getErr.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "Desrama não encontrada." });
      }

      const imovelId = rows[0].imovel_id;

      // Atualizamos a altura acumulada no imóvel
      const updateImovelSql = `
        UPDATE imoveis
        SET altura_desrama = altura_desrama + ?
        WHERE id = ?
      `;

      db.query(updateImovelSql, [altura, imovelId], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: updateErr.message });
        }

        res.status(200).json({ message: "Desrama atualizada com sucesso!" });
      });
    });
  });
});




// Rota para cadastrar uma desrama associada a um imóvel
app.post("/api/imoveis/:id/desramas", (req, res) => {
  const { id } = req.params; // ID do imóvel
  const { altura, data, numero } = req.body;

  if (!altura || !data || !numero) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  // Primeiro, insere a nova desrama na tabela de desramas
  const insertDesramaSql = `
    INSERT INTO desramas (imovel_id, altura, data, numero)
    VALUES (?, ?, ?, ?)
  `;

  const desramaValues = [id, altura, data, numero];

  db.query(insertDesramaSql, desramaValues, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Em seguida, atualiza a altura acumulada no imóvel
    const updateImovelSql = `
      UPDATE imoveis
      SET altura_desrama = altura_desrama + ?
      WHERE id = ?
    `;

    db.query(updateImovelSql, [altura, id], (updateErr, updateResult) => {
      if (updateErr) {
        return res.status(500).json({ error: updateErr.message });
      }

      res.status(201).json({
        message: "Desrama cadastrada e altura do imóvel atualizada com sucesso!",
      });
    });
  });
});

// Rota para excluir uma despesa
app.delete("/api/despesas/:id", (req, res) => {
  const { id } = req.params; // ID da despesa a ser excluída

  // SQL para excluir a despesa
  const deleteDespesaSql = `DELETE FROM despesas WHERE id = ?`;

  db.query(deleteDespesaSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Despesa não encontrada." });
    }

    res.status(200).json({ message: "Despesa excluída com sucesso!" });
  });
});

// Rota para listar todas as desramas de um imóvel específico
app.get("/api/imoveis/:id/desramas", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM desramas WHERE imovel_id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Rota para excluir uma desrama específica
app.delete("/api/imoveis/:id/desramas/:desramaId", (req, res) => {
  const { id, desramaId } = req.params; // ID do imóvel e ID da desrama a ser excluída

  // Primeiro, buscar a altura da desrama que será excluída
  const selectDesramaSql = "SELECT altura FROM desramas WHERE id = ? AND imovel_id = ?";

  db.query(selectDesramaSql, [desramaId, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Desrama não encontrada." });
    }

    const alturaDesrama = results[0].altura;

    // Agora, excluir a desrama
    const deleteDesramaSql = "DELETE FROM desramas WHERE id = ? AND imovel_id = ?";

    db.query(deleteDesramaSql, [desramaId, id], (deleteErr, deleteResult) => {
      if (deleteErr) {
        return res.status(500).json({ error: deleteErr.message });
      }

      // Atualizar a altura acumulada do imóvel
      const updateImovelSql = `
        UPDATE imoveis
        SET altura_desrama = altura_desrama - ?
        WHERE id = ?
      `;

      db.query(updateImovelSql, [alturaDesrama, id], (updateErr, updateResult) => {
        if (updateErr) {
          return res.status(500).json({ error: updateErr.message });
        }

        res.status(200).json({
          message: "Desrama excluída e altura do imóvel atualizada com sucesso!",
        });
      });
    });
  });
});

app.get("/api/despesas", (req, res) => {
  // Modificando a consulta para incluir todos os campos das despesas e a descrição do imóvel
  const sql = `
    SELECT despesas.*, imoveis.descricao AS descricao_imovel
    FROM despesas
    JOIN imoveis ON despesas.imovel_id = imoveis.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post("/api/imoveis/:id/desbastes/previsao", (req, res) => {
  const { id } = req.params;
  const { previsao, numero, data, arvores_cortadas, lenha, toretes, toras_20_25cm, toras_25_33cm, toras_acima_33cm, preco_lenha, preco_toretes, preco_toras_20_25cm, preco_toras_25_33cm, preco_toras_acima_33cm, valor_extracao } = req.body;

  if (!previsao) {
    return res.status(400).json({ error: "O campo 'previsao' é obrigatório." });
  }

  const insertDesbasteSql = `
    INSERT INTO desbaste (
      imovel_id, numero, data, arvores_cortadas, lenha, toretes, toras_20_25cm, toras_25_33cm, toras_acima_33cm, 
      preco_lenha, preco_toretes, preco_toras_20_25cm, preco_toras_25_33cm, preco_toras_acima_33cm, valor_extracao, previsao
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Valores que podem ser nulos são passados como 'NULL' ou como valores padrão se não fornecidos
  db.query(insertDesbasteSql, [
    id, 
    numero || null, 
    data || null, 
    arvores_cortadas || null, 
    lenha || null, 
    toretes || null, 
    toras_20_25cm || null, 
    toras_25_33cm || null, 
    toras_acima_33cm || null, 
    preco_lenha || null, 
    preco_toretes || null, 
    preco_toras_20_25cm || null, 
    preco_toras_25_33cm || null, 
    preco_toras_acima_33cm || null, 
    valor_extracao || null, 
    previsao
  ], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: "Previsão de desbaste cadastrada com sucesso!" });
  });
});


app.get("/api/imoveis/:id/desbastes/previsoes", (req, res) => {
  const { id } = req.params; // Captura o ID do imóvel

  const selectPrevisoesSql = `
    SELECT * 
    FROM desbaste 
    WHERE imovel_id = ? 
      AND arvores_cortadas IS NULL 
      AND lenha IS NULL 
      AND toretes IS NULL 
      AND toras_20_25cm IS NULL 
      AND toras_25_33cm IS NULL 
      AND toras_acima_33cm IS NULL 
      AND previsao IS NOT NULL
  `;

  db.query(selectPrevisoesSql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Nenhuma previsão encontrada para este imóvel." });
    }

    res.status(200).json(results);
  });
});

app.put("/api/desbastes/:id", (req, res) => {
  const { id } = req.params; // ID do desbaste
  const { numero, data, arvores_cortadas, lenha, toretes, toras_20_25cm, toras_25_33cm, toras_acima_33cm, preco_lenha, preco_toretes, preco_toras_20_25cm, preco_toras_25_33cm, preco_toras_acima_33cm, valor_extracao } = req.body;

  // Verifica se todos os campos obrigatórios foram fornecidos
  if (!numero || !data || !arvores_cortadas || !lenha || !toretes || !toras_20_25cm || !toras_25_33cm || !toras_acima_33cm || !preco_lenha || !preco_toretes || !preco_toras_20_25cm || !preco_toras_25_33cm || !preco_toras_acima_33cm || !valor_extracao) {
    return res.status(400).json({ error: "Todos os campos (número, data, árvores cortadas, lenha, toretes, toras, preços, valor de extração) são obrigatórios." });
  }

  // Atualiza a previsão de desbaste no banco de dados
  const updateDesbasteSql = `
    UPDATE desbaste
    SET numero = ?, data = ?, arvores_cortadas = ?, lenha = ?, toretes = ?, toras_20_25cm = ?, toras_25_33cm = ?, toras_acima_33cm = ?, preco_lenha = ?, preco_toretes = ?, preco_toras_20_25cm = ?, preco_toras_25_33cm = ?, preco_toras_acima_33cm = ?, valor_extracao = ?
    WHERE id = ?
  `;

  db.query(updateDesbasteSql, [
    numero, 
    data, 
    arvores_cortadas, 
    lenha, 
    toretes, 
    toras_20_25cm, 
    toras_25_33cm, 
    toras_acima_33cm, 
    preco_lenha, 
    preco_toretes, 
    preco_toras_20_25cm, 
    preco_toras_25_33cm, 
    preco_toras_acima_33cm, 
    valor_extracao, 
    id
  ], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ message: "Previsão de desbaste atualizada com sucesso!" });
  });
});






app.get("/api/imoveis/:id/desbastes", (req, res) => {
  const { id } = req.params;

  // Consulta para selecionar apenas registros com todos os campos (exceto 'previsao') preenchidos
  const sql = `
    SELECT * 
    FROM desbaste 
    WHERE imovel_id = ? 
      AND numero IS NOT NULL 
      AND data IS NOT NULL 
      AND arvores_cortadas IS NOT NULL 
      AND lenha IS NOT NULL 
      AND toretes IS NOT NULL 
      AND toras_20_25cm IS NOT NULL 
      AND toras_25_33cm IS NOT NULL 
      AND toras_acima_33cm IS NOT NULL 
      AND preco_lenha IS NOT NULL 
      AND preco_toretes IS NOT NULL 
      AND preco_toras_20_25cm IS NOT NULL 
      AND preco_toras_25_33cm IS NOT NULL 
      AND preco_toras_acima_33cm IS NOT NULL 
      AND valor_extracao IS NOT NULL;
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Verifica se há registros para retornar
    if (results.length === 0) {
      return res.status(404).json({ message: "Nenhum registro completo encontrado para este imóvel." });
    }

    res.json(results);
  });
});

// Rota para excluir um desbaste e atualizar o número de árvores cortadas no imóvel
app.delete("/api/imoveis/:imovelId/desbastes/:desbasteId", (req, res) => {
  const { imovelId, desbasteId } = req.params;

  // Primeiro, buscamos o número de árvores cortadas no desbaste
  const selectDesbasteSql = "SELECT arvores_cortadas FROM desbaste WHERE id = ?";
  
  db.query(selectDesbasteSql, [desbasteId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Desbaste não encontrado." });
    }

    const arvoresCortadas = results[0].arvores_cortadas;

    // Atualizar o número de árvores cortadas no imóvel
    const updateArvoresCortadasSql = `
      UPDATE imoveis
      SET num_arvores_cortadas = num_arvores_cortadas - ?
      WHERE id = ?
    `;
    
    // Deletar o desbaste
    const deleteDesbasteSql = "DELETE FROM desbaste WHERE id = ?";

    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao iniciar transação." });
      }

      // Atualiza o número de árvores cortadas no imóvel
      db.query(updateArvoresCortadasSql, [arvoresCortadas, imovelId], (err) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ error: err.message }));
        }

        // Exclui o desbaste
        db.query(deleteDesbasteSql, [desbasteId], (err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ error: err.message }));
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => res.status(500).json({ error: err.message }));
            }

            res.status(200).json({ message: "Desbaste excluído com sucesso e número de árvores cortadas atualizado." });
          });
        });
      });
    });
  });
});

// Rota para exibir o inventário de um imóvel específico
app.get("/api/imoveis/:id/inventario", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM inventario WHERE imovel_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "Inventário não encontrado para este imóvel." });
    }
    res.json(result[0]);
  });
});

// Rota para registrar o inventário de um imóvel específico
app.post("/api/imoveis/:id/inventario", (req, res) => {
  const { id } = req.params;
  const { cap_medio, altura_media, dap_medio } = req.body;

  if (!cap_medio || !altura_media || !dap_medio) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `
    INSERT INTO inventario (imovel_id, cap_medio, altura_media, dap_medio)
    VALUES (?, ?, ?, ?)
  `;

  const values = [id, cap_medio, altura_media, dap_medio];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Inventário registrado com sucesso!" });
  });
});

// Rota para postar a imagem de um imóvel
app.post("/api/imoveis/:id/imagens", upload.single("imagem"), (req, res) => {
  const { id } = req.params;
  const caminhoImagem = req.file ? req.file.path : null;
  const { titulo } = req.body; // Obtendo o título

  if (!caminhoImagem) {
    return res.status(400).json({ error: "Imagem é obrigatória" });
  }

  const sql = "INSERT INTO imagens (imovel_id, caminho, titulo) VALUES (?, ?, ?)";
  const values = [id, caminhoImagem, titulo];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Imagem cadastrada com sucesso!" });
  });
});

// Middleware para servir imagens estáticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota para listar as imagens de um imóvel
app.get("/api/imoveis/:id/imagens", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM imagens WHERE imovel_id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Nenhuma imagem encontrada para este imóvel." });
    }

    // Log do caminho das imagens para depuração
    console.log('Imagens encontradas:', results);

    res.json(results);
  });
});

// Rota para excluir uma imagem de um imóvel
app.delete("/api/imoveis/:id/imagens/:imageId", (req, res) => {
  const { id, imageId } = req.params;

  // Primeiro, busque o caminho da imagem na base de dados
  const selectSql = "SELECT caminho FROM imagens WHERE id = ? AND imovel_id = ?";
  db.query(selectSql, [imageId, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Imagem não encontrada." });
    }

    const imagePath = results[0].caminho;

    // Exclua o arquivo do sistema de arquivos (se necessário)
    const fs = require('fs');
    const path = require('path');
    const imageFullPath = path.join(__dirname, imagePath);

    fs.unlink(imageFullPath, (unlinkErr) => {
      if (unlinkErr) {
        return res.status(500).json({ error: "Erro ao excluir o arquivo de imagem." });
      }

      // Após excluir o arquivo, remova o registro do banco de dados
      const deleteSql = "DELETE FROM imagens WHERE id = ?";
      db.query(deleteSql, [imageId], (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({ error: deleteErr.message });
        }

        res.status(200).json({ message: "Imagem excluída com sucesso!" });
      });
    });
  });
});

// Rota para salvar a localização de um imóvel específico
app.post("/api/imoveis/:id/localizacao", (req, res) => {
  const { id } = req.params;  // Captura o ID do imóvel da URL
  const { latitude, longitude } = req.body; // Captura a latitude e longitude do corpo da requisição

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude e longitude são obrigatórios" });
  }

  const sql = "INSERT INTO localizacoes (imovel_id, latitude, longitude) VALUES (?, ?, ?)";
  const values = [id, latitude, longitude];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Localização salva com sucesso!" });
  });
});

// Rota para listar as localizações de um imóvel
app.get("/api/imoveis/:id/localizacao", (req, res) => {
  const { id } = req.params;  // Captura o ID do imóvel da URL

  const sql = "SELECT * FROM localizacoes WHERE imovel_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Rota para registrar uma nota para um imóvel específico
app.post("/api/imoveis/:id/notas", (req, res) => {
  const { id } = req.params; // ID do imóvel
  const { titulo, descricao } = req.body; // Título e descrição da nota

  if (!titulo || !descricao) {
    return res.status(400).json({ error: "Título e descrição são obrigatórios." });
  }

  const sql = `
    INSERT INTO notas (imovel_id, titulo, descricao)
    VALUES (?, ?, ?)
  `;

  const values = [id, titulo, descricao];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Nota registrada com sucesso!" });
  });
});
// Rota para listar todas as notas de um imóvel específico
app.get("/api/imoveis/:id/notas", (req, res) => {
  const { id } = req.params; // Captura o ID do imóvel

  const sql = "SELECT * FROM notas WHERE imovel_id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);  // Envia as notas encontradas para o frontend
  });
});
// Rota para deletar uma nota de um imóvel específico
app.delete("/api/imoveis/:id/notas/:notaId", (req, res) => {
  const { id, notaId } = req.params; // ID do imóvel e ID da nota a ser deletada

  // Verificação se a nota pertence ao imóvel
  const checkSql = "SELECT * FROM notas WHERE id = ? AND imovel_id = ?";
  db.query(checkSql, [notaId, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Nota não encontrada para este imóvel." });
    }

    // Deletando a nota
    const deleteSql = "DELETE FROM notas WHERE id = ?";
    db.query(deleteSql, [notaId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: "Nota deletada com sucesso!" });
    });
  });
});

// Rota para atualizar uma nota de um imóvel específico
app.put("/api/imoveis/:id/notas/:notaId", (req, res) => {
  const { id, notaId } = req.params; // ID do imóvel e da nota
  const { titulo, descricao } = req.body; // Novo título e descrição

  if (!titulo || !descricao) {
    return res.status(400).json({ error: "Título e descrição são obrigatórios." });
  }

  const sql = `
    UPDATE notas
    SET titulo = ?, descricao = ?
    WHERE id = ? AND imovel_id = ?
  `;

  const values = [titulo, descricao, notaId, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Nota não encontrada para este imóvel." });
    }
    res.status(200).json({ message: "Nota atualizada com sucesso!" });
  });
});

// Rota para fazer upload de um mapa
app.post("/api/imoveis/:id/mapas", uploadMapas.single("mapa"), (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;  // Capturando o título enviado

  console.log(`Uploading map for imovelId: ${id}`);

  const caminhoMapa = req.file ? req.file.path : null;
  const nomeArquivo = req.file ? req.file.originalname : null;

  if (!caminhoMapa) {
    return res.status(400).json({ error: "O arquivo do mapa é obrigatório." });
  }

  if (!titulo) {
    return res.status(400).json({ error: "O título do mapa é obrigatório." });
  }

  // Inserindo o título e o caminho do mapa no banco de dados
  const sql = "INSERT INTO mapas (imovel_id, nome_arquivo, caminho, titulo) VALUES (?, ?, ?, ?)";
  db.query(sql, [id, nomeArquivo, caminhoMapa, titulo], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Mapa cadastrado com sucesso!" });
  });
});



// Rota para listar os mapas de um imóvel
app.get("/api/imoveis/:id/mapas", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT id, nome_arquivo, caminho, titulo, data_upload FROM mapas WHERE imovel_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // Retorna os resultados com o título
  });
});

// Rota para excluir um mapa
app.delete("/api/imoveis/:id/mapas/:mapaId", (req, res) => {
  const { id, mapaId } = req.params;

  // Buscar o caminho do mapa no banco
  const selectSql = "SELECT caminho FROM mapas WHERE id = ? AND imovel_id = ?";
  db.query(selectSql, [mapaId, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Mapa não encontrado." });
    }

    const caminhoMapa = results[0].caminho;

    // Excluir o arquivo do sistema de arquivos
    fs.unlink(caminhoMapa, (unlinkErr) => {
      if (unlinkErr) {
        return res.status(500).json({ error: "Erro ao excluir o arquivo do mapa." });
      }

      // Excluir o registro do banco de dados
      const deleteSql = "DELETE FROM mapas WHERE id = ?";
      db.query(deleteSql, [mapaId], (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({ error: deleteErr.message });
        }
        res.status(200).json({ message: "Mapa excluído com sucesso!" });
      });
    });
  });
});

// Rota para fazer upload de um arquivo
app.post("/api/imoveis/:id/arquivos", uploadArquivos.single("arquivo"), (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;  // Capturando o título enviado

  console.log(`Uploading file for imovelId: ${id}`);

  const caminhoArquivo = req.file ? req.file.path : null;
  const nomeArquivo = req.file ? req.file.originalname : null;

  if (!caminhoArquivo) {
    return res.status(400).json({ error: "O arquivo é obrigatório." });
  }

  if (!titulo) {
    return res.status(400).json({ error: "O título do arquivo é obrigatório." });
  }

  // Inserindo o título e o caminho do arquivo no banco de dados
  const sql = "INSERT INTO arquivos (imovel_id, nome_arquivo, caminho, titulo) VALUES (?, ?, ?, ?)";
  db.query(sql, [id, nomeArquivo, caminhoArquivo, titulo], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Arquivo cadastrado com sucesso!" });
  });
});

// Rota para listar os arquivos de um imóvel
app.get("/api/imoveis/:id/arquivos", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT id, nome_arquivo, caminho, titulo, data_upload FROM arquivos WHERE imovel_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // Retorna os resultados com o título
  });
});

// Rota para excluir um arquivo
app.delete("/api/imoveis/:id/arquivos/:arquivoId", (req, res) => {
  const { id, arquivoId } = req.params;

  // Buscar o caminho do arquivo no banco
  const selectSql = "SELECT caminho FROM arquivos WHERE id = ? AND imovel_id = ?";
  db.query(selectSql, [arquivoId, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Arquivo não encontrado." });
    }

    const caminhoArquivo = results[0].caminho;

    // Excluir o arquivo do sistema de arquivos
    fs.unlink(caminhoArquivo, (unlinkErr) => {
      if (unlinkErr) {
        return res.status(500).json({ error: "Erro ao excluir o arquivo." });
      }

      // Excluir o registro do banco de dados
      const deleteSql = "DELETE FROM arquivos WHERE id = ?";
      db.query(deleteSql, [arquivoId], (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({ error: deleteErr.message });
        }
        res.status(200).json({ message: "Arquivo excluído com sucesso!" });
      });
    });
  });
});




// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});