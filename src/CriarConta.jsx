
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import perfil_not from "./assets/img/perfil_not.svg";
import { MdEmail, MdOutlinePassword } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

function CriarConta() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000";

  async function cadastrarUsuario(e) {
    e.preventDefault();

    if (carregando) return;

    if (!nome.trim() || !email.trim() || !senha) {
      alert("Preencha todos os campos para criar sua conta.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`${API_URL}/auth/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha: senha
        })
      });

      const dados = await resposta.json().catch(() => ({}));

      if (resposta.ok) {
        alert("Conta criada com sucesso!");
        navigate("/login");
        return;
      }

      const detalhe = dados.detail;
      let mensagem = "Não foi possível criar a conta.";

      if (typeof detalhe === "string") {
        mensagem = detalhe;
      } else if (detalhe) {
        mensagem = JSON.stringify(detalhe);
      }

      console.error("Erro retornado pela API:", resposta.status, dados);
      alert(`Erro ao cadastrar (${resposta.status}): ${mensagem}`);
    } catch (erro) {
      console.error("Erro de conexão com o servidor:", erro);

      alert(
        "Não foi possível conectar ao servidor do VALID.\n\n" +
        "Verifique se o backend está rodando em " +
        "http://127.0.0.1:8000."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-container">
      <div className="row-login">
        <div className="login-left entrar divbranca">
          <h1 className="textoazul titulo-login">
            Criar conta
          </h1>

          <p className="descricao-cadastro">
            Complete seus dados e comece a usar nossas
            análises de documentos de forma rápida e prática!
          </p>

          <form onSubmit={cadastrarUsuario}>
            <div className="divemail">
              <FaRegUser size={16} color="#00A279" />
              <label htmlFor="nome">Nome completo</label>
            </div>

            <input
              id="nome"
              type="text"
              className="input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              autoComplete="name"
              required
              disabled={carregando}
            />

            <div className="divemail">
              <MdEmail size={18} color="#00A279" />
              <label htmlFor="email">Email</label>
            </div>

            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              autoComplete="email"
              required
              disabled={carregando}
            />

            <div className="divsenha">
              <MdOutlinePassword size={18} color="#00A279" />
              <label htmlFor="senha">Senha</label>
            </div>

            <input
              id="senha"
              type="password"
              className="input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Crie uma senha"
              autoComplete="new-password"
              required
              disabled={carregando}
            />

            <a
              href={`${API_URL}/auth/google`}
              className="btngoogle"
            >
              Entrar com Google
              <FcGoogle size={20} />
            </a>

            <button
              type="submit"
              className="btnentrar"
              disabled={carregando}
            >
              {carregando ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </div>

        <div className="login-right criarconta divazul">
          <h1 className="textobranco titulo-cadastro">
            Já possui uma conta?
          </h1>

          <p className="textobranco textoleft">
            Faça seu login e aproveite nossas análises!
          </p>

          <Link className="btnbranco" to="/login">
            Entrar
          </Link>

          <img
            src={perfil_not}
            alt="Ilustração de documentos"
            className="img_logo_temp"
          />
        </div>
      </div>
    </div>
  );
}

export default CriarConta;
