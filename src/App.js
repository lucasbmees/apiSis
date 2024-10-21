import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import Home from './pages/Home';
import CadastroImoveis from './pages/CadastroImoveis';
import ViewImoveis from './pages/ViewImoveis';
import DespesasGerais from './pages/DespesasGerais'; // Certifique-se de que o caminho está correto
import ImovelDetails from './pages/ImovelDetails'; // Importando o novo componente

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro-imoveis" element={<CadastroImoveis />} />
            <Route path="/view-imoveis" element={<ViewImoveis />} />
            <Route path="/despesas-gerais" element={<DespesasGerais />} />
            <Route path="/imovel/:id" element={<ImovelDetails />} /> {/* Nova rota */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
