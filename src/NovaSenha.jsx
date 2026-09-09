import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./style.css";
import perfil_not from "./assets/img/perfil_not.svg";
import { MdEmail, MdOutlinePassword } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";


function NovaSenha() {

  const navigate = useNavigate();

  const API_URL = "http://localhost:8000";


  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [senha, setSenha] = useState("");

  const [confirmarSenha, setConfirmarSenha] = useState("");

  const redefinirSenha = async (e) => {

    e.preventDefault();


    if (senha !== confirmarSenha) {

      alert("As senhas não coincidem.");
      return;

    }


    try {

      const resposta = await fetch(
        `${API_URL}/auth/redefinir-senha`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            token: token,

            nova_senha: senha

          })

        }
      );


      const dados = await resposta.json();


      if (resposta.ok) {

        alert("Senha alterada com sucesso!");

        navigate("/login");

      } else {

        alert(dados.detail);

      }


    } catch (erro) {

      console.log(erro);

      alert(
        "Erro ao conectar com o servidor."
      );

    }

  };


  return (
    <div className="login-container">

      <div className="row-login">

        {/* Lado esquerdo */}
        <div className="login-left entrar divbranca">

          <h1 className="textoazul titulo-login">
            Redefinir senha
          </h1>
          <p>
            Digite sua nova senha para recuperar sua conta.
          </p>

          <form onSubmit={redefinirSenha}>

            {/* senha */}
            <div className="divemail">
              <MdOutlinePassword size={20} color="#00A279" />
              <label className="label-field">Digite sua nova senha</label>
            </div>
            <input
              type="password"
              className="input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <div className="divemail">
              <MdOutlinePassword size={20} color="#00A279" />
              <label className="label-field">Confirme sua nova senha</label>
            </div>
            <input
              type="password"
              className="input"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />


            <div>
              <button
                type="submit"
                className="btnentrar"
              >
                Redefinir
              </button>
            </div>
          </form>
        </div>

        {/* Lado direito */}
        <div className="login-right criarconta divazul">

          <h1 className="textobranco textoleft titulo-cadastro">
            Ainda não tem uma conta?
          </h1>

          <p className="textobranco textoleft">
            Cadastre-se agora e aproveite análises de documentos rápidas, seguras e eficientes!
          </p>

          <Link className="btnbranco" to="/criarconta">
            Criar conta
          </Link>

          <img src={perfil_not} alt="notificacao" className="img_logo_temp" />

        </div>

      </div>
    </div>
  );
}

export default NovaSenha;
