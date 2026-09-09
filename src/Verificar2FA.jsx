import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

import perfil_not from "./assets/img/perfil_not.svg";
import { MdOutlineSecurity } from "react-icons/md";


function Verificar2FA() {


  const navigate = useNavigate();

  const API_URL = "http://localhost:8000";


  const [email, setEmail] = useState(
    localStorage.getItem("email2fa") || ""
  );

  const [codigo, setCodigo] = useState("");



  async function verificarCodigo(e) {

    e.preventDefault();


    try {


      const resposta = await fetch(
        `${API_URL}/auth/verificar-2fa`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },


          body: JSON.stringify({

            email,

            codigo

          })

        }
      );



      const dados = await resposta.json();

      console.log("RESPOSTA 2FA:", resposta.status, dados);



      if (!resposta.ok) {

        alert(
          dados.detail || "Código inválido."
        );

        return;

      }



      localStorage.setItem(
        "token",
        dados.access_token
      );



      navigate("/");



    } catch (error) {


      alert(
        "Erro ao conectar com o servidor."
      );


      console.log(error);


    }


  }




  return (

    <div className="login-container">


      <div className="row-login">


        {/* lado esquerdo */}

        <div className="login-left entrar divbranca">


          <h1 className="textoazul titulo-login">

            Verificação em duas etapas

          </h1>


          <form onSubmit={verificarCodigo}>


            <div className="divemail">

              <MdOutlineSecurity
                size={22}
                color="#00A279"
              />

              <label className="label-field">

                Código de segurança

              </label>


            </div>

            <input

              type="text"

              className="input"

              placeholder="Código de 6 dígitos"

              value={codigo}

              onChange={(e) => setCodigo(e.target.value)}

              maxLength="6"

              required

            />





            <button

              type="submit"

              className="btnentrar"

            >

              Verificar código

            </button>



          </form>



        </div>





        {/* lado direito */}


        <div className="login-right criarconta divazul">


          <h1 className="textobranco textoleft titulo-cadastro">

            Sua conta está protegida

          </h1>



          <p className="textobranco textoleft">

            A verificação em duas etapas adiciona uma camada extra de segurança ao seu acesso.

          </p>




          <Link

            className="btnbranco"

            to="/"

          >

            Voltar

          </Link>




          <img

            src={perfil_not}

            alt="segurança"

            className="img_logo_temp"

          />



        </div>



      </div>



    </div>

  );


}


export default Verificar2FA;