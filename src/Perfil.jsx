import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./style.css";
import tcc from "./assets/img/tcc.png";
import livro_artigos from "./assets/img/livro_artigos.svg";
import perfil_not from "./assets/img/perfil_not.svg";
import { FiEdit2, FiLock, FiFileText, FiClock, FiUser, FiStar, FiBell } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import BackToTop from "./components/BackToTop";
import { MdOutlineSecurity } from "react-icons/md";

function Perfil() {

  const navigate = useNavigate();


  // pra api (ajuda do gpt)
  const [usuario, setUsuario] = useState(null); // dados do usuário vazio
  const [loading, setLoading] = useState(true); // quando estiver carregando
  const [erro, setErro] = useState(null); // caso tenha erro
  const [stats, setStats] = useState({ documentos: 0, ultimaHora: "Nenhuma", ultimoArquivo: "Sem análises", taxa: "—" });
  const [totalHistorico, setTotalHistorico] = useState(0);
  const [detalhe, setDetalhe] = useState(null);
  const [erroHistorico, setErroHistorico] = useState("");
  const [historico, setHistorico] = useState([]);
  const [doisFatoresAtivo, setDoisFatoresAtivo] = useState(false);

  function handleLogout() {

    const confirmar = window.confirm(
      "Deseja realmente sair da sua conta?"
    );

    if (!confirmar) return;

    localStorage.removeItem("token");

    navigate("/");

  }

  // quando abrir
  useEffect(() => { //BACK BACK BACK
    // fetch("https://sua-api.com/usuario/perfil", {
    //   headers: {
    //     // envia o coiso para autenticar o usuário?
    //     Authorization: `Bearer ${localStorage.getItem("token")}`
    //   }
    // })
    //   .then(res => {
    //     if (!res.ok) throw new Error("Erro ao buscar perfil");
    //     return res.json(); // transforma a resposta em objeto JavaScript
    //   })
    //   .then(data => {
    //     setUsuario(data);  // salva os dados do usuário
    //     setLoading(false); // terminou de carregar
    //   })
    //   .catch(err => {
    //     setErro(err.message); // salva o erro
    //     setLoading(false);    // terminou de carregar (mesmo com erro)
    //   });


    const usuarioSalvo = localStorage.getItem("usuario");

    const buscarPerfil = async () => {

      try {

        const token = localStorage.getItem("token");

        console.log("TOKEN NO PERFIL:", token);

        const resposta = await fetch(
          "http://localhost:8000/perfil/",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!resposta.ok) {
          throw new Error("Erro ao buscar perfil.");
        }

        const dados = await resposta.json();

        setUsuario({
          nome: dados.nome,
          email: dados.email,
          telefone: "-",
          dataCadastro: "-",
          fotoUrl: null
        });


        setDoisFatoresAtivo(dados.dois_fatores_ativo ?? false);

        try {
          const cabecalhos = { Authorization: `Bearer ${token}` };
          const [estatisticasResp, historicoResp] = await Promise.all([
            fetch("http://localhost:8000/analises/estatisticas", { headers: cabecalhos }),
            fetch("http://localhost:8000/analises/?limite=10", { headers: cabecalhos })
          ]);
          if (!estatisticasResp.ok || !historicoResp.ok) throw new Error("Não foi possível carregar o histórico");
          const estatisticas = await estatisticasResp.json();
          const lista = await historicoResp.json();
          const ultima = estatisticas.ultima_analise;
          setStats({
            documentos: estatisticas.documentos,
            ultimaHora: ultima ? new Date(ultima.data_analise + "Z").toLocaleString("pt-BR") : "Nenhuma",
            ultimoArquivo: ultima?.nome || "Sem análises",
            taxa: estatisticas.score_medio_suspeita == null ? "—" : estatisticas.score_medio_suspeita.toLocaleString("pt-BR") + "%"
          });
          setHistorico(lista.itens);
          setTotalHistorico(lista.total);
        } catch (falha) {
          setErroHistorico(falha.message);
        }

      } catch (erro) {

        setErro(erro.message);

      } finally {

        setLoading(false);

      }

    };

    buscarPerfil();

  }, []);
  if (loading) {
    return (
      <div className="home">
        <Header />
        <p className="perfil_loading">Carregando perfil...</p>
        <Footer />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="home">
        <Header />
        <p className="perfil_erro">Erro: {erro}</p>
        <Footer />
      </div>
    );
  }

  function handleEditarPerfil() {
    console.log("Editar perfil clicado");
  }

  function handleTrocarSenha() {
    console.log("Trocar senha clicado");
  }

  async function handleVerDetalhes(id) {
    try {
      const resposta = await fetch(`http://localhost:8000/analises/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!resposta.ok) throw new Error("Não foi possível abrir esta análise");
      setDetalhe(await resposta.json());
    } catch (e) { setErroHistorico(e.message); }
  }

  async function carregarMais() {
    try {
      const resposta = await fetch(`http://localhost:8000/analises/?limite=10&deslocamento=${historico.length}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!resposta.ok) throw new Error("Não foi possível carregar mais análises");
      const dados = await resposta.json();
      setHistorico(anterior => [...anterior, ...dados.itens]);
      setTotalHistorico(dados.total);
    } catch (e) { setErroHistorico(e.message); }
  }

  async function alterar2FA() {

    const novoEstado = !doisFatoresAtivo;

    try {

      const token = localStorage.getItem("token");

      const resposta = await fetch(
        "http://localhost:8000/perfil/2fa",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ativo: novoEstado
          })
        }
      );


      if (!resposta.ok) {
        throw new Error("Erro ao alterar verificação em duas etapas");
      }


      setDoisFatoresAtivo(novoEstado);


    } catch (error) {

      alert(error.message);

    }

  }

  return (
    <div className="home">

      <Header />

      {/*CARD PERFIL */}
      <section className="perfil">
        <div className="card_perfil container">

          <div className="card_perfil_esquerda">

            <div className="foto_perfil">
              {/* usuario.fotoUrl = URL da foto que veio do back-end
                  ex: "https://sua-api.com/uploads/foto-123.jpg"
                  Se não tiver foto, mostra uma imagem padrão */}
              <img src={usuario.fotoUrl || tcc} alt="Foto de perfil" />
            </div>

            <div>
              {/* usuario.nome e usuario.email vêm diretamente da resposta da API */}
              <p className="perfil_nome">{usuario.nome}</p>
              <p className="perfil_email">{usuario.email}</p>
            </div>

          </div>

          <div className="card_perfil_direita">

            <Link
              to="/editarPerfil"
              className="btn_perfil"
              onClick={handleEditarPerfil}
            >
              <FiEdit2 size={14} />
              Editar perfil
            </Link>

            <Link
              to="/esqueceuSenha"
              className="btn_perfil"
            >
              <FiLock size={14} />
              Trocar senha
            </Link>

            <button
              className="btn_perfil"
              onClick={handleLogout}
            >
              Sair
            </button>

          </div>

        </div>
      </section>

      {/* CARD DOS STATUS */}
      <section className="cards_info_perfil container">
        <div className="cards_informacoes">

          {/*  Documentos analisados */}
          <div className="card_stat">
            <div className="card_stat_topo">
              <div className="card_stat_icone">
                <FiFileText size={22} color="#fff" />
              </div>

              <div>
                {/* virá da API: stats.documentos */}
                <p className="card_stat_numero">{stats.documentos}</p>
                <p className="card_stat_titulo">Documentos analisados</p>
              </div>

            </div>
            <p className="card_stat_legenda">Total de análises realizadas</p>
          </div>

          {/* CARD 2: Última análise */}
          <div className="card_stat">
            <div className="card_stat_topo">
              <div className="card_stat_icone">
                <FiClock size={22} color="#fff" />
              </div>
              <div>
                {/* virá da API: stats.ultimaHora */}
                <p className="card_stat_numero">{stats.ultimaHora}</p>
                <p className="card_stat_titulo">Última análise realizada</p>
              </div>
            </div>
            {/* virá da API: stats.ultimoArquivo */}
            <p className="card_stat_legenda">{stats.ultimoArquivo}</p>
          </div>

          {/* CARD 3: Taxa de autenticidade */}
          <div className="card_stat">
            <div className="card_stat_topo">
              <div className="card_stat_icone">
                <MdOutlineSecurity size={22} color="#fff" />
              </div>
              <div>
                {/* virá da API: stats.taxa */}
                <p className="card_stat_numero">{stats.taxa}</p>
                <p className="card_stat_titulo">Pontuação média de suspeita</p>
              </div>
            </div>
            <p className="card_stat_legenda">Média das pontuações disponíveis</p>
          </div>

        </div>
      </section>

      {/* CARD DE EDIÇÃO DAS INFORMAÇÕES */}
      <section className="informacoes_perfil container">
        <div className="cards_dados_perfil">

          <div className="card_info">
            <div className="card_info_topo">
              <div className="card_dados_icone">
                <FiUser size={20} color="#00A279" />
              </div>
              <h2>Informações pessoais</h2>

            </div>

            <div className="card_info_conteudo">
              <div className="card_info_esquerda">
                <div className="info_grid">
                  <div className="info_item">
                    <span className="info_texto">Nome completo</span>
                    <span className="info_valor">{usuario.nome}</span>
                  </div>

                  <div className="info_item">
                    <span className="info_texto">Email</span>
                    <span className="info_valor">{usuario.email}</span>
                  </div>

                  <div className="info_item">
                    <span className="info_texto">Telefone</span>
                    <span className="info_valor">{usuario.telefone}</span>
                  </div>

                  <div className="info_item">
                    <span className="info_texto">Data de Cadastro</span>
                    <span className="info_valor">{usuario.dataCadastro}</span>
                  </div>
                </div>


              </div>

              <div className="card_info_direita">
                <img src={livro_artigos} alt="livro_artigos" className="img_info" />

                <Link to="/editarPerfil" className="btn_perfil_info" onClick={handleEditarPerfil}>

                  <MdOutlineSecurity size={20} />
                  Editar Informações
                </Link>
              </div>

            </div>

          </div>

          <div className="card_dados card_seguranca">

            <div className="card_dados_topo">
              <div className="card_dados_icone card_dados_icone_cheio">
                <MdOutlineSecurity size={20} color="#00A279" />
              </div>

              <h2>Segurança</h2>
            </div>


            <Link
              to="/esqueceuSenha"
              className="item_seguranca"
              onClick={handleTrocarSenha}
            >

              <div>
                <span className="item_seguranca_titulo">
                  Alterar senha
                </span>

                <span className="item_seguranca_desc">
                  Atualize sua senha de acesso
                </span>
              </div>

            </Link>



            <div className="item_seguranca">

              <div>
                <span className="item_seguranca_titulo">
                  Verificação em duas etapas
                </span>

                <span className="item_seguranca_desc">
                  Aumente a segurança da conta
                </span>
              </div>


              <button
                className={doisFatoresAtivo ? "btn_2fa ativo" : "btn_2fa"}
                onClick={alterar2FA}
              >
                {doisFatoresAtivo ? "Ativado" : "Desativado"}
              </button>


            </div>


          </div>
        </div>

      </section>

      {/* CARD PLANOS E NOTIFICAÇÕES  */}
      <section className="plano_notificacoes container">
        <div className="cards_plano">

          <div className="card_plano">

            <div className="card_plano_topo">
              <FiStar size={18} />
              <h2>Plano atual</h2>
            </div>

            <div className="card_plano_conteudo">
              <div className="plano_info">
                <h3>Plano Pro</h3>
                <p> Aproveite todos os benefícios exclusivos </p>

                <Link to="/assinaturas" className="btn_upgrade">
                  Fazer upgrade
                </Link>
              </div>

              <div className="plano_beneficios">
                <span>✓ Análises ilimitadas</span>
                <span>✓ Relatórios completos</span>
                <span>✓ Suporte prioritário</span>
                <span>✓ Histórico avançado</span>
              </div>
            </div>

          </div>
          {/* notificações */}
          <div className="card_notificacoes">

            <div className="card_plano_topo">
              <FiBell size={18} />
              <h2>Notificações</h2>
            </div>

            <div className="notificacao_info">
              <div>
                <h4>Receber emails</h4>
                <p> Receba notificação de suas análises </p>
              </div>

              <label className="switch_bolinha">
                <input type="checkbox" />
                <span className="not_ligada"></span>
              </label>
            </div>

          </div>
        </div>
      </section>

      {/* historico de analises */}
      <section className="historico_analises container">
        <div className="card_historico">
          <div className="historico_topo">
            <div className="historico_titulo">
              <FiClock size={22} />
              <h2>Histórico de análises</h2>
            </div>

            <span className="historico_ver_todas">{totalHistorico} análise(s)</span>
          </div>

          <div className="historico_cabecalho">
            <span>Documento</span>
            <span>Data</span>
            <span>Status</span>
            <span>Ações</span>
          </div>

          {erroHistorico && <p role="alert">{erroHistorico}</p>}
          {historico.length === 0 && <p>Nenhuma análise salva ainda.</p>}
          {historico.map((arquivo) => (

            <div className="historico_item" key={arquivo.id}>
              <div className="historico_documento">
                <FiFileText size={22} />

                <div>
                  <p>{arquivo.nome}</p>
                  <span>{arquivo.nome.split(".").pop().toUpperCase()} - {(arquivo.tamanho_bytes / 1048576).toFixed(2)} MB</span>
                </div>

              </div>

              <div className="historico_data">
                <p>{new Date(arquivo.data_analise + "Z").toLocaleDateString("pt-BR")}</p>
                <span>{new Date(arquivo.data_analise + "Z").toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>

              <div className={arquivo.classificacao.toLowerCase().includes("alta") ? "status_suspeito" : "status_autentico"}>
                {arquivo.classificacao}
              </div>

              <button className="btn_historico" onClick={() => handleVerDetalhes(arquivo.id)}>
                Ver detalhes
              </button>

            </div>

          ))}

          {historico.length < totalHistorico && (
            <button className="btn_carregar" onClick={carregarMais}>Carregar mais</button>
          )}
          {detalhe && (
            <div role="dialog" aria-modal="true" aria-label="Detalhes da análise" className="card_info" style={{ padding: 20, marginTop: 20 }}>
              <h3>{detalhe.nome}</h3>
              <p>Classificação: {detalhe.classificacao}</p>
              <p>Pontuação de suspeita: {detalhe.score_suspeita ?? "Indisponível"}</p>
              <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxHeight: 350, overflow: "auto" }}>{JSON.stringify(detalhe.resultado, null, 2)}</pre>
              <button className="btn_perfil" onClick={() => setDetalhe(null)}>Fechar</button>
            </div>
          )}

        </div>

      </section>




      <Footer />

      <BackToTop />
    </div>
  );
}

export default Perfil;