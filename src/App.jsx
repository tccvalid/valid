import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./Home";
import Artigos from "./Artigos";
import ArtigosConteudo from "./ArtigosConteudo";
import Sobre from "./Sobre";
import Perfil from "./Perfil";
import Assinaturas from "./Assinaturas";
import Analise from "./Analise";
import EditarPerfil from "./EditarPerfil";
import Login from "./Login";
import CriarConta from "./CriarConta";
import EsqueceuSenha from "./EsqueceuSenha";
import EsqueceuSenhaCodigo from "./Verificar2FA";
import NovaSenha from "./NovaSenha";
import Verificar2FA from "./Verificar2FA";

import GoogleCallback from "./GoogleCallback";
import PrivateRoute from "./components/PrivateRoute";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artigos" element={<Artigos />} />
        <Route path="/artigosConteudo" element={<ArtigosConteudo />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/login" element={<Login />} />
        <Route path="/criarconta" element={<CriarConta />} />
        <Route path="/esqueceuSenha" element={<EsqueceuSenha />} />
        <Route
          path="/verificar-2fa"
          element={<Verificar2FA />}
        />        <Route path="/novaSenha" element={<NovaSenha />} />


        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />

        <Route
          path="/editarPerfil"
          element={
            <PrivateRoute>
              <EditarPerfil />
            </PrivateRoute>
          }
        />

        <Route
          path="/analise"
          element={
            <PrivateRoute>
              <Analise />
            </PrivateRoute>
          }
        />

        <Route
          path="/assinaturas"
          element={
            <PrivateRoute>
              <Assinaturas />
            </PrivateRoute>
          }
        />

        <Route
          path="/google/callback"
          element={<GoogleCallback />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;