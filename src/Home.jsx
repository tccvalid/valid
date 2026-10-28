import Header from "./components/Header";
import Footer from "./components/Footer";
import "./style.css";
import "./Home.css";

import documento from "./assets/img/documento.png";
import { LuFolderGit2 } from "react-icons/lu";
import { LuDownload } from "react-icons/lu";
import { LuSquareDashed } from "react-icons/lu";
import { TbShieldSearch } from "react-icons/tb";
import { PiClipboardTextBold } from "react-icons/pi";
import { GrAlert } from "react-icons/gr";
import { LuScanEye } from "react-icons/lu";
import { CgFileDocument } from "react-icons/cg";
import { MdOutlineSecurity } from "react-icons/md";
import { PiBuildingApartment } from "react-icons/pi";
import { TbSchool } from "react-icons/tb";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import BackToTop from "./components/BackToTop";

function Home() {
  return (
    <div className="home">
      <div className="inicial">

        <Header />

        {/* seção 1 - destaque principal */}
        <section className="fundoverde hero-valid">
          <div className="row hero-valid-row">

            {/* Texto à esquerda */}
            <div className="col-lg-6 col-12 div-col-inicial">
              <div className="div-texto hero-valid-texto">

                <h1 className="text-branco">
                  Verifique a autenticidade de documentos com{" "}
                  <span className="text-subli2ini">
                    Inteligência Artificial.
                  </span>
                </h1>

                <p className="hero-descricao">
                  Identifique possíveis indícios de falsificação e
                  adulteração documental com tecnologia inteligente.
                </p>

                <div className="hero-acoes">
                  <Link to="/analise" className="hero-botao">
                    Analisar documento
                    <FaArrowRight />
                  </Link>
                </div>

              </div>
            </div>

            {/* Elemento tecnológico à direita */}
            <div className="col-lg-6 col-12 hero-visual-col">
              <div className="hero-visual">

                <div className="hero-orbita hero-orbita-1"></div>
                <div className="hero-orbita hero-orbita-2"></div>
                <div className="hero-luz"></div>

                {/* Pontos decorativos */}
                <span className="hero-ponto ponto-2"></span>
                <span className="hero-ponto ponto-3"></span>
                <span className="hero-ponto ponto-4"></span>

                {/* Documento principal */}
                <div className="hero-documento">

                  <div className="hero-doc-topo">
                    <div className="hero-doc-icone">
                      <CgFileDocument />
                    </div>

                    <div className="hero-doc-titulo">
                      <span></span>
                      <span></span>
                    </div>

                    <div className="hero-doc-status">
                      <MdOutlineSecurity />
                    </div>
                  </div>

                  <div className="hero-doc-conteudo">
                    <div className="hero-avatar">
                      <div className="hero-avatar-cabeca"></div>
                      <div className="hero-avatar-corpo"></div>
                    </div>

                    <div className="hero-doc-linhas">
                      <span className="linha longa"></span>
                      <span className="linha media"></span>
                      <span className="linha longa"></span>
                      <span className="linha curta"></span>
                      <span className="linha media"></span>
                    </div>
                  </div>

                  <div className="hero-doc-bloco">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="hero-doc-rodape">
                    <span></span>
                    <span></span>
                  </div>

                  {/* Scanner em movimento */}
                  <div className="hero-scanner">
                    <div className="hero-scan-linha"></div>
                  </div>

                  {/* Marcas de análise */}
                  <div className="hero-marcacao marcacao-1">
                    <span></span>
                  </div>

                  <div className="hero-marcacao marcacao-2">
                    <span></span>
                  </div>

                </div>

                {/* Cartão flutuante de análise */}
                <div className="hero-card-analise">
                  <div className="hero-card-icone">
                    <LuScanEye />
                  </div>

                  <div className="hero-card-textos">
                    <strong>Análise inteligente</strong>
                    <span>Verificação de padrões</span>
                  </div>

                  <div className="hero-card-pulso"></div>
                </div>

                {/* Cartão flutuante de pixels */}
                <div className="hero-card-pixels">
                  <div className="hero-pixels-topo">
                    <span className="hero-pixel-ponto"></span>
                    <span>Análise de pixels</span>
                  </div>

                  <div className="hero-pixel-grade">
                    {Array.from({ length: 36 }, (_, i) => (
                      <span
                        key={i}
                        className={`pixel pixel-${(i * 7 + 3) % 5}`}
                      ></span>
                    ))}
                  </div>
                </div>

                {/* Indicador inferior */}
                <div className="hero-indicador">
                  <span className="hero-indicador-icone">
                    <MdOutlineSecurity />
                  </span>

                  <div>
                    <strong>VALID</strong>
                    <span>Tecnologia e segurança documental</span>
                  </div>

                  <span className="hero-indicador-ponto"></span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* seção 2 - cards */}
        <section className="container">
          <div className="cards-home">
            <div className="card-home">
              <div className="icardhome"><LuFolderGit2 /></div>
              <h2>Planos e Testes</h2>
              <p>Experimente gratuitamente ou conheça nossos planos mensais e anuais sob medida para sua necessidade.</p>
            </div>

            <div className="card-home card-destaque">
              <div className="icardhome"><LuFolderGit2 /></div>
              <h2>Análise Anti-Fraude</h2>
              <p>Verifique a integridade e autenticidade dos seus documentos instantaneamente com nossa IA protetora.</p>
            </div>

            <div className="card-home">
              <div className="icardhome"><LuFolderGit2 /></div>
              <h2>Conteúdo & Artigos</h2>
              <p>Aprenda a identificar documentos falsos e descubra as melhores práticas para evitar fraudes no mercado.</p>
            </div>
          </div>
        </section>

        {/* seção 3 - como funciona */}
        <section className="container como-funciona">
          <h2 className="titulos-home">Como funciona?</h2>
          <p>Processo simples e eficiente em apenas 4 etapas</p>

          <div className="cards-home-func">
            <div className="card-etapas">
              <div className="icardhome2"><LuDownload /></div>
              <h3>Uploud do documento</h3>
              <p>Faça upload do documento que deseja verificar de forma rápida e segura</p>
            </div>

            <div className="card-etapas">
              <div className="icardhome2"><LuSquareDashed /></div>
              <h3>Análise pixel por pixel</h3>
              <p>Detecção de manipulações através de análise microscópica de pixels</p>
            </div>

            <div className="card-etapas">
              <div className="icardhome2"><TbShieldSearch /></div>
              <h3>Detecção de manipulação</h3>
              <p>Identificamos alterações, adulterações e inconsistências no documento</p>
            </div>

            <div className="card-etapas">
              <div className="icardhome2"><PiClipboardTextBold /></div>
              <h3>Geração de relatório</h3>
              <p>Receba um relatório completo e detalhado sobre a autenticidade do documento</p>
            </div>
          </div>

        </section>

        {/* seção 4 - funcionalidades */}
        <section className="container">
          <h2 className="titulos-home">Funcionalidades</h2>

          <div className="cards-funcionalidades">

            <div className="card-funcionalidades">
              <div className="texto-card-funci">
                <h2>Verificação de autenticidade</h2>
                <p>Análise profunda para identificar documentos fraudulentos ou alterados</p>
              </div>

              <div className="icon-card-funci"><GrAlert /></div>
            </div>

            <div className="card-funcionalidades">
              <div className="texto-card-funci">
                <h2>Análise de pixels</h2>
                <p>Detecção de manipulações através de análise de pixels</p>
              </div>

              <div className="icon-card-funci"><LuScanEye /></div>
            </div>

            <div className="card-funcionalidades">
              <div className="texto-card-funci">
                <h2>Relatórios detalhados</h2>
                <p>Documentação completa com evidências visuais e técnicas</p>
              </div>

              <div className="icon-card-funci"><CgFileDocument /></div>
            </div>

            <div className="card-funcionalidades">
              <div className="texto-card-funci">
                <h2>Segurança e privacidade</h2>
                <p>Documentos são processados com criptografia de ponta a ponta</p>
              </div>

              <div className="icon-card-funci"><MdOutlineSecurity /></div>
            </div>

          </div>
        </section>

        {/* seção 5 - público-alvo  */}
        <section className="container publico-alvo">
          <h2 className="titulos-home">Público-Alvo</h2>
          <p>Nossa plataforma atende diversos segmentos que necessitam de verificação confiável de documentos</p>
        </section>

        <section className="fundoverdeclarinho">
          <div className="cards-home-inicial container">
            <div className="card-home cardhome2">
              <div className="icardhome"><PiBuildingApartment /></div>
              <h2>Empresas</h2>
              <p>Validação de documentos de fornecedores, parceiros e clientes</p>

              <div className="exemplos-doc">
                <div className="exemplo-doc">Contrato</div>
                <div className="exemplo-doc">Notas fiscais</div>
                <div className="exemplo-doc">Certidões</div>
              </div>
            </div>

            <div className="card-home card-destaque cardhome2">
              <div className="icardhome"><TbSchool /></div>
              <h2>Instituições de ensino</h2>
              <p>Verificação de certificados, diplomas e históricos escolares</p>

              <div className="exemplos-doc">
                <div className="exemplo-doc">Diplomas</div>
                <div className="exemplo-doc">Certificados</div>
                <div className="exemplo-doc">Históricos</div>
              </div>
            </div>

            <div className="card-home cardhome2">
              <div className="icardhome"><HiOutlinePencilSquare /></div>
              <h2>RH e Recrutamento</h2>
              <p>Conferência de documentação de candidatos e colaboradores</p>

              <div className="exemplos-doc">
                <div className="exemplo-doc">Currículos</div>
                <div className="exemplo-doc">Certidões</div>
                <div className="exemplo-doc">Atestados</div>
              </div>
            </div>
          </div>
        </section>

        {/* seção 6 */}
        <section className="fundoverde2 secverificardoc">

          <h1>Proteja-se contra fraudes documentais com <h1 className="text-subli2">tecnologia de ponta</h1></h1>
          <p>Junte-se a milhares de empresas e usuários que confiam em nossa plataforma para garantir a autenticidade de seus documentos</p>

          <div className="btn-verfi1doc">
            <Link to="/analise">Verificar meu primeiro documento</Link>
            <FaArrowRight />
          </div>

        </section>

        <Footer />

        <BackToTop />
      </div>
    </div>

  );
}

export default Home;
