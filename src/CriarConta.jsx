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

  const navigate = useNavigate();

  async function cadastrarUsuario(e) {

    e.preventDefault();

    const resposta = await fetch(
      "http://localhost:8000/auth/cadastro",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha
        })
      }
    );


    const dados = await resposta.json();


    if (resposta.ok) {

      alert("Conta criada com sucesso!");

      navigate("/login");

    } else {

      alert(dados.detail);

    }

  }


  return (
    <div className="login-container">

      <div className="row-login">

        {/* ESQUERDA */}
        <div className="login-left entrar divbranca">

          <h1 className="textoazul titulo-login">
            Criar conta
          </h1>

          <p className="descricao-cadastro">
            Complete seus dados e comece a usar nossas
            análises de documentos de forma rápida e prática!
          </p>

          <form onSubmit={cadastrarUsuario}>

            {/* Nome */}
            <div className="divemail">
              <FaRegUser size={16} color="#00A279" />
              <label>Nome completo</label>
            </div>

            <input type="text" className="input" value={nome} onChange={(e) => setNome(e.target.value)} />

            {/* Email */}
            <div className="divemail">
              <MdEmail size={18} color="#00A279" />
              <label>Email</label>
            </div>

            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />

            {/* Senha */}
            <div className="divsenha">
              <MdOutlinePassword size={18} color="#00A279" />
              <label>Senha</label>
            </div>

            <input type="password" className="input" value={senha} onChange={(e) => setSenha(e.target.value)} />

            <a
              href="http://localhost:8000/auth/google"
              className="btngoogle"
            >
              Entrar com Google
              <FcGoogle size={20} />
            </a>

            <button type="submit" className="btnentrar">
              Criar conta
            </button>

          </form>

        </div>

        {/* DIREITA */}
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

          <img src={perfil_not} alt="documentos" className="img_logo_temp" />
        </div>

      </div>

    </div>
  );
}

export default CriarConta;