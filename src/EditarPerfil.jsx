import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./style.css";
import tcc from "./assets/img/tcc.png";
import { FiEdit2, FiShield, FiUser } from "react-icons/fi";
import BackToTop from "./components/BackToTop";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineSecurity } from "react-icons/md";

function EditarPerfil() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataCadastro: "",
    fotoUrl: ""
  });

  useEffect(() => {

    const buscarPerfil = async () => {

      try {

        const token = localStorage.getItem("token");

        const resposta = await fetch(
          "http://localhost:8000/perfil/",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!resposta.ok) {
          throw new Error("Erro ao carregar perfil.");
        }

        const dados = await resposta.json();

        setForm({
          nome: dados.nome,
          email: dados.email,
          telefone: "",
          dataCadastro: "",
          fotoUrl: ""
        });

      } catch (erro) {

        console.log(erro);

      }

    };

    buscarPerfil();

  }, []);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleFoto(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    const reader = new FileReader();
    reader.onloadend = () => { setForm({ ...form, fotoUrl: reader.result }); };
    reader.readAsDataURL(arquivo);
  }

  async function handleSalvar() {

    try {

      const token = localStorage.getItem("token");

      const resposta = await fetch(
        "http://localhost:8000/perfil/",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            nome: form.nome,
            email: form.email
          })
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {

        alert(dados.detail || "Erro ao atualizar perfil.");
        return;

      }

      alert(dados.mensagem);

      navigate("/perfil");

    } catch (erro) {

      console.log(erro);
      alert("Erro ao conectar com o servidor.");

    }

  }

  function handleCancelar() {
    navigate("/perfil");
  }

  return (
    <div className="home">

      <Header />

      <section className="informacoes_perfil container">
        <div className="perfil_banner">
          <div className="card_perfil">
            <div className="card_perfil_esquerda">

              <div className="foto_perfil">
                <label htmlFor="fotoInput">
                  <img src={form.fotoUrl || tcc} alt="Foto de perfil" />
                </label>
                <input id="fotoInput" type="file" accept="image/*" onChange={handleFoto} hidden />
              </div>

              <div>
                <p className="perfil_nome">{form.nome}</p>
                <p className="perfil_email">{form.email}</p>
              </div>

            </div>
          </div>

          <div className="cards_dados_perfil">
            {/* Informações */}
            <div className="card_info">
              <div className="card_info_topo">
                <div className="card_dados_icone">
                  <FiUser size={20} color="#00A279" />
                </div>
                <h2>Informações pessoais</h2>
              </div>

              <div className="info_grid">
                <div className="info_item">
                  <span className="info_texto">Nome completo</span>
                  <input type="text" name="nome" value={form.nome} onChange={handleChange} className="input_editar" />
                </div>

                <div className="info_item">
                  <span className="info_texto">Email</span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="input_editar" />
                </div>

                <div className="info_item">
                  <span className="info_texto">Telefone</span>
                  <input type="text" name="telefone" value={form.telefone} onChange={handleChange} className="input_editar" />
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="card_dados card_seguranca">

              <div className="card_dados_topo">
                <div className="card_dados_icone">
                  <MdOutlineSecurity size={20} color="#00A279" />
                </div>
                <h2>Segurança</h2>
              </div>

              <Link to="/esqueceuSenha" className="item_seguranca">
                <span className="item_seguranca_titulo">
                  Alterar senha
                </span>

                <span className="item_seguranca_desc">
                  Atualize sua senha de acesso
                </span>
              </Link>

              <Link to="/" className="item_seguranca">
                <span className="item_seguranca_titulo">
                  Verificação em duas etapas
                </span>

                <span className="item_seguranca_desc">
                  Aumente a segurança da conta
                </span>
              </Link>

            </div>

          </div>

          <div className="acoes_perfil">
            <button className="btn_salvar_perfil" onClick={handleSalvar}>
              <FiEdit2 />
              Salvar alterações
            </button>

            <button className="btn_salvar_perfil" onClick={handleCancelar}>
              X Cancelar
            </button>
          </div>

        </div>

      </section>

      <Footer />
      <BackToTop />

    </div>
  );
}

export default EditarPerfil;