import Header from "./components/Header";
import Footer from "./components/Footer";
import "./style.css";
import "./Sobre.css";


import docsobre1 from "./assets/img/doc-sobre-1.png";
import docsobre2 from "./assets/img/doc-sobre-2.png";
import BackToTop from "./components/BackToTop";

import fotoadriano from "./assets/img/fotoadriano.jpeg";
import fotoana from "./assets/img/fotoana.jpeg";
import fotobea from "./assets/img/fotobea.jpeg";
import fotobya from "./assets/img/fotobya.jpeg";
import fotogaby from "./assets/img/fotogaby.jpeg";


function AnimacaoSobre({ tipo = "rg" }) {
    return (
        <div className={`sobre-visual sobre-visual-${tipo}`}>
            <div className="sobre-circulo"></div>
            <div className="sobre-orbita sobre-orbita-1"></div>
            <div className="sobre-orbita sobre-orbita-2"></div>

            {tipo === "rg" ? (
                <>
                    {/* Carteira de identidade ilustrativa */}
                    <div className="sobre-rg">
                        <div className="sobre-rg-cabecalho">
                            <span className="sobre-rg-brasil">BR</span>
                            <div>
                                <strong>REPÚBLICA FEDERATIVA</strong>
                                <small>DOCUMENTO DE IDENTIDADE</small>
                            </div>
                            <span className="sobre-rg-selo">✓</span>
                        </div>

                        <div className="sobre-rg-conteudo">
                            <div className="sobre-rg-foto">
                                <div className="sobre-rg-cabeca"></div>
                                <div className="sobre-rg-corpo"></div>
                            </div>

                            <div className="sobre-rg-dados">
                                <small>NOME</small>
                                <span className="rg-linha rg-longa"></span>
                                <small>REGISTRO</small>
                                <span className="rg-linha rg-media"></span>
                                <small>DATA DE NASCIMENTO</small>
                                <span className="rg-linha rg-curta"></span>
                                <div className="sobre-rg-assinatura"></div>
                            </div>
                        </div>

                        <div className="sobre-rg-rodape">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <div className="sobre-rg-brilho"></div>
                    </div>

                    {/* Lupa em destaque */}
                    <div className="sobre-lupa">
                        <div className="sobre-lupa-aro">
                            <div className="sobre-lupa-reflexo"></div>
                            <div className="sobre-lupa-ponto"></div>
                            <div className="sobre-lupa-ponto ponto-dois"></div>
                            <div className="sobre-lupa-ponto ponto-tres"></div>
                        </div>
                        <div className="sobre-lupa-cabo"></div>
                    </div>

                    <div className="sobre-etiqueta etiqueta-rg">
                        <span className="sobre-etiqueta-icone">✓</span>
                        <div>
                            <strong>Verificação visual</strong>
                            <small>Elementos do documento</small>
                        </div>
                    </div>

                    <div className="sobre-etiqueta etiqueta-registro">
                        <span className="sobre-ponto-status"></span>
                        <div>
                            <strong>Análise de detalhes</strong>
                            <small>Inspeção assistida por IA</small>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Painel de ampliação de detalhes */}
                    <div className="sobre-painel-pixels">
                        <div className="sobre-painel-topo">
                            <span className="sobre-painel-icone">⌕</span>
                            <div>
                                <strong>Área ampliada</strong>
                                <small>Inspeção de imagem</small>
                            </div>
                            <span className="sobre-painel-status"></span>
                        </div>

                        <div className="sobre-pixels-grandes">
                            {Array.from({ length: 64 }, (_, i) => (
                                <span
                                    key={i}
                                    className={`sobre-pixel pixel-${(i * 7 + 2) % 5}`}
                                ></span>
                            ))}
                        </div>

                        <div className="sobre-painel-rodape">
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    {/* Lupa menor, com varredura */}
                    <div className="sobre-lupa sobre-lupa-pixels">
                        <div className="sobre-lupa-aro">
                            <div className="sobre-lupa-reflexo"></div>
                            <div className="sobre-lupa-ponto"></div>
                            <div className="sobre-lupa-ponto ponto-dois"></div>
                            <div className="sobre-lupa-ponto ponto-tres"></div>
                        </div>
                        <div className="sobre-lupa-cabo"></div>
                    </div>

                    <div className="sobre-etiqueta etiqueta-rg">
                        <span className="sobre-etiqueta-icone">⌕</span>
                        <div>
                            <strong>Ampliação de imagem</strong>
                            <small>Análise de características</small>
                        </div>
                    </div>

                    <div className="sobre-etiqueta etiqueta-registro">
                        <span className="sobre-ponto-status"></span>
                        <div>
                            <strong>Inspeção de pixels</strong>
                            <small>Detalhes em destaque</small>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


function Sobre() {
    return (
        <div className="sobre">
            <Header />

            <section className="container section-sobre">
                <div className="row">
                    <div className="col-6 col-sobre">
                        <div className="texto-sobre">
                            <h1>Sobre o Valid</h1>
                            <p>O projeto consiste em uma plataforma que utiliza inteligência artificial para analisar documentos e identificar possíveis fraudes ou alterações.
                                A ferramenta realiza uma análise detalhada pixel a pixel para determinar se um documento é verdadeiro ou falso.
                                Com isso, ajuda empresas e instituições a evitarem golpes, prejuízos financeiros e problemas legais. O objetivo é tornar
                                a validação documental mais rápida, segura e acessível, acompanhando a evolução das técnicas de falsificação e aumentando
                                a confiança nos processos digitais e físicos.</p>
                        </div>
                    </div>

                    <div className="col-6 col-sobre">
                            <AnimacaoSobre tipo="rg" />
                    </div>
                </div>
            </section>

            <section className="container section-sobre">
                <div className="row">
                    <div className="col-6 col-sobre img-col">
                        <AnimacaoSobre tipo="pixels" />
                    </div>

                    <div className="col-6 col-sobre texto-col">
                        <div className="texto-sobre">
                            <h1>Por que foi desenvolvido</h1>
                            <p>Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) pelos alunos Adriano Bendazolli, Ana Clara Rivas,
                                Beatriz Krisan, Byanca Lourenço e Gabriely Santos, como parte do ensino médio integrado ao curso técnico de Informática
                                para Internet da ETEC Profª Maria Cristina Medeiros.  A proposta tem como objetivo aplicar, na prática, conhecimentos
                                adquiridos ao longo da formação, por meio da criação de uma solução tecnológica voltada à análise e validação de documentos.
                                O projeto busca contribuir com a sociedade ao oferecer uma ferramenta inovadora para identificação de possíveis fraudes, unindo
                                aprendizado acadêmico e impacto real no mercado.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="fundoverde marginsecdesen">
                <div className="container sec-desenvolvedores">
                    <h1>Desenvolvedores do projeto</h1>

                    <div className="row divfotos">
                        <div className="div-foto">
                            <div>
                                <img src={fotoadriano} alt="" className="img-foto-desen" />
                            </div>
                            <h2>Adriano</h2>
                            <p>Estudante</p>
                        </div>

                        <div className="div-foto">
                            <div>
                                <img src={fotoana} alt="" className="img-foto-desen" />
                            </div>
                            <h2>Ana Clara</h2>
                            <p>Estudante</p>
                        </div>

                        <div className="div-foto">
                            <div>
                                <img src={fotobea} alt="" className="img-foto-desen" />
                            </div>
                            <h2>Beatriz</h2>
                            <p>Estudante</p>
                        </div>

                        <div className="div-foto">
                            <div>
                                <img src={fotobya} alt="" className="img-foto-desen" />
                            </div>
                            <h2>Byanca</h2>
                            <p>Estudante</p>
                        </div>

                        <div className="div-foto">
                            <div>
                                <img src={fotogaby} alt="" className="img-foto-desen" />
                            </div>
                            <h2>Gabriely</h2>
                            <p>Estudante</p>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />

            <BackToTop />
        </div>
    );
}

export default Sobre;