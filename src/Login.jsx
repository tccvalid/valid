import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import perfil_not from "./assets/img/perfil_not.svg";
import { MdEmail, MdOutlinePassword } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";


function Login() {

  const navigate = useNavigate();

  const API_URL = "http://localhost:8000";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const login = async (e) => {

    e.preventDefault();

    try {

      const dadosLogin = new URLSearchParams();

      dadosLogin.append(
        "username",
        email
      );

      dadosLogin.append(
        "password",
        senha
      );


      const resposta = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },

          body: dadosLogin
        }
      );


      const dados = await resposta.json();

      console.log("RESPOSTA DO LOGIN:", dados);


      if (!resposta.ok) {

        alert(dados.detail);
        return;

      }


      if (dados.status === "2fa") {

        console.log("SALVANDO EMAIL 2FA:", dados.email);

        localStorage.setItem(
          "email2fa",
          dados.email
        );

        navigate("/verificar-2fa");

        return;

      }



      // Login normal

      localStorage.setItem(
        "token",
        dados.access_token
      );


      alert("Login realizado com sucesso!");

      navigate("/perfil");


    } catch (erro) {

      alert("Erro ao conectar com o servidor.");
      console.log(erro);

    }

  };


  return (
    <div className="login-container">

      <div className="row-login">

        {/* Lado esquerdo */}
        <div className="login-left entrar divbranca">

          <h1 className="textoazul titulo-login">
            Faça seu login
          </h1>

          <form onSubmit={login}>

            {/* Email */}
            <div className="divemail">
              <MdEmail size={20} color="#00A279" />
              <label className="label-field">Email</label>
            </div>

            <input
              type="email"
              className="input"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Senha */}
            <div className="divsenha">
              <MdOutlinePassword size={20} color="#00A279" />
              <label className="label-field textoazul">Senha</label>
            </div>

            <input
              type="password"
              className="input"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            {/* Esqueceu senha */}
            <div className="esqueceusenha">
              <Link to="/esqueceuSenha" className="textoazul">
                Esqueceu a senha?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                className="btnentrar"
              >
                Entrar
              </button>

              <a
                href="http://localhost:8000/auth/google"
                className="btngoogle"
              >
                Entrar com Google
                <FcGoogle size={20} color="#00A279" />
              </a>
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

          <div >
            <img src={perfil_not} alt="notificacao" className="img_logo_temp" />
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
