import Header from "./components/Header";
import Footer from "./components/Footer";
import "./style.css";
import "./Artigos.css";
import artigos from "./ArtigosDados";

import { Link } from "react-router-dom";
import BackToTop from "./components/BackToTop";

function Artigos() {

  return (
    <div className="home">
      <Header />

      <section className="fundoverde">
        <div className="row">
          <div className="col-6">
            <div className="div-texto">
              <p className="text-branco branco-artigos">
                Blog
              </p>

              <p className="hero-descricao">
                Identifique possíveis indícios de falsificação e
                adulteração documental com tecnologia inteligente.
              </p>
            </div>
          </div>

          <div className="col-6">
            <div className="imgartigos livro-visual">
              <div className="livro-cena">
                <div className="sobre-circulo"></div>
                <div className="sobre-orbita sobre-orbita-1"></div>
                <div className="sobre-orbita sobre-orbita-2"></div>

                {/* Círculos orbitais */}
                <div className="livro-orbitas">

                  {/* Círculos decorativos do livro */}
                  <div className="livro-orbitas">
                    <span className="livro-orbita orbita-externa"></span>
                    <span className="livro-orbita orbita-media"></span>
                    <span className="livro-orbita orbita-interna"></span>

                    <span className="orbita-ponto orbita-ponto-1"></span>
                    <span className="orbita-ponto orbita-ponto-2"></span>
                    <span className="orbita-ponto orbita-ponto-3"></span>
                  </div>
                </div>

                {/* Livro aberto */}
                <div className="livro-aberto">

                  {/* Página esquerda */}
                  <div className="livro-pagina pagina-esquerda">
                    <span className="livro-linha titulo-pagina" />

                    <div className="livro-texto-simulado">
                      <span />
                      <span />
                      <span />
                    </div>

                    <span className="livro-linha" />
                    <span className="livro-linha curta" />
                    <span className="livro-linha media" />

                    {/* Ilustração decorativa */}
                    <div className="livro-ilustracao">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    {/* Mini gráfico */}
                    <div className="livro-mini-grafico">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="livro-texto-simulado">
                      <span />
                      <span />
                    </div>
                  </div>

                  {/* Página direita */}
                  <div className="livro-pagina pagina-direita">
                    <span className="livro-linha titulo-pagina" />

                    <div className="livro-texto-simulado texto-direita">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    {/* Caixa de destaque */}
                    <div className="livro-destaque">
                      <span className="livro-simbolo">✓</span>
                      <div>
                        <span />
                        <span />
                      </div>
                    </div>

                    {/* Pequenas anotações */}
                    <div className="livro-mini-notas">
                      <span className="nota-icone">✓</span>
                      <span />
                      <span />
                    </div>

                    <span className="livro-linha" />
                    <span className="livro-linha media" />
                    <span className="livro-linha curta" />

                    {/* Linhas decorativas adicionais */}
                    <div className="livro-texto-simulado">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>

                  {/* Lombada central */}
                  <div className="livro-lombada" />

                  {/* Folha animada */}
                  <div className="livro-folha">
                    <div className="folha-frente">
                      <span className="livro-linha titulo-pagina" />

                      <div className="livro-texto-simulado">
                        <span />
                        <span />
                        <span />
                      </div>

                      <div className="livro-mini-grafico">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>

                      <span className="livro-linha media" />
                    </div>

                    <div className="folha-verso">
                      <span className="livro-linha titulo-pagina" />

                      <div className="livro-texto-simulado">
                        <span />
                        <span />
                        <span />
                      </div>

                      <div className="livro-destaque">
                        <span className="livro-simbolo">✓</span>
                        <div>
                          <span />
                          <span />
                        </div>
                      </div>

                      <span className="livro-linha media" />
                    </div>
                  </div>
                </div>

                {/* Pontos decorativos */}
                <span className="livro-ponto ponto-livro-1" />
                <span className="livro-ponto ponto-livro-2" />

                {/* Etiqueta flutuante */}
                <div className="livro-etiqueta">
                  <span className="livro-etiqueta-icone">✦</span>
                  <div>
                    <strong>Conhecimento</strong>
                    <small> & Informações</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container artigosmarbottom">
        <div className="cards-artigos">
          {artigos.map((artigo) => (
            <div className="card_artigos" key={artigo.id}>
              <div
                className="card_img_artigos"
                style={{
                  backgroundImage: `url("${artigo.imagem}")`,
                }}
              />

              <div className="card_body_artigos">
                <div className="card_clique">
                  <Link
                    to={`/artigosConteudo/${artigo.id}`}
                    className="card_clique_aqui"
                  >
                    Clique Aqui
                  </Link>

                  <span className="card_author">
                    {artigo.autor}
                  </span>
                </div>

                <p className="card_titulo_artigos">
                  {artigo.titulo}
                </p>

                <p className="card_desc">
                  {artigo.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default Artigos;