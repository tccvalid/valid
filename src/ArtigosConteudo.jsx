import Header from "./components/Header";
import Footer from "./components/Footer";
import { Link, useParams } from "react-router-dom";
import "./style.css";
import artigo_conteudo from "./assets/img/artigoConteudo.svg";
import BackToTop from "./components/BackToTop";
import artigos from "./ArtigosDados";

function ArtigosConteudo() {
  const { id } = useParams();

  const artigo = artigos.find(
    (item) => item.id === Number(id)
  );

  if (!artigo) {
    return (
      <div className="home">
        <Header />

        <section className="conteiner_artigo">
          <p className="texto_artigo_conteudo">
            Artigo não encontrado.
          </p>

          <Link to="/artigos" className="btn-voltar">
            ☚ Voltar
          </Link>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="home">
      <Header />

      <section className="fundoverde">
        <div className="row">
          <div className="col-6">
            <div className="div-texto">
              <p className="text-branco">
                {artigo.titulo}
              </p>

              <p className="p_banner">
                {artigo.subtitulo}
              </p>
            </div>
          </div>

          <div className="col-6">
            <div className="imgartigos">
              <img
                src={artigo_conteudo}
                alt="Ilustração de leitura de artigos"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="conteiner_artigo">
        <div className="conteudo-artigo">
          {artigo.conteudo.map((bloco, index) => (
            <div key={index}>
              {bloco.tipo === "titulo" && (
                <h2 className="artigo_titulo_conteudo">
                  {bloco.texto}
                </h2>
              )}

              {bloco.tipo === "paragrafo" && (
                <p className="texto_artigo_conteudo">
                  {bloco.texto}
                </p>
              )}

              {bloco.tipo === "citacao" && (
                <blockquote className="artigo_citacao">
                  {bloco.texto}
                </blockquote>
              )}

              {bloco.tipo === "lista" && (
                <div className="artigo_lista_container">
                  <ul className="artigo_lista">
                    {bloco.itens?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {bloco.tipo === "destaque" && (
                <div className="conteudo_colorido">
                  <h3>{bloco.titulo}</h3>
                  <p className="texto_artigo_conteudo_colorido">
                    {bloco.texto}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <Link to="/artigos" className="btn-voltar"> ☚ Voltar</Link>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default ArtigosConteudo;