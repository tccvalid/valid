import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import "./Analise.css";
import { useState } from "react";
import { LuDownload } from "react-icons/lu";
import { FaFilePdf } from "react-icons/fa";
import { GoShieldCheck, GoShield } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";


function Analise() {
    const [etapa, setEtapa] = useState("upload"); // 'upload' | 'preview' | 'resultado' | 'relatorio'
    const [arquivo, setArquivo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragAtivo, setDragAtivo] = useState(false);


    // Estados para integração com a API
    const [resultadoAPI, setResultadoAPI] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [versaoImagem, setVersaoImagem] = useState(Date.now());


    // Manipulação de seleção do arquivo
    const handleArquivo = (file) => {
        if (file) {
            setArquivo(file);
            setPreview(URL.createObjectURL(file));
            setErro("");
            setResultadoAPI(null);
            setEtapa("preview");
        }
    };


    const handleInputChange = (e) => {
        const file = e.target.files[0];
        handleArquivo(file);
    };


    // Função de Análise com chamada Real à API Python
    const analisarDocumento = async () => {
        if (!arquivo) {
            setErro("Selecione um documento antes de iniciar.");
            return;
        }


        setCarregando(true);
        setErro("");


        const dados = new FormData();
        dados.append("imagem", arquivo);


        try {
            const resposta = await fetch("http://127.0.0.1:5000/analisar", {
                method: "POST",
                body: dados,
            });


            const dadosRetornados = await resposta.json();


            if (!resposta.ok) {
                throw new Error(dadosRetornados.erro || "Erro durante a análise do documento.");
            }


            setResultadoAPI(dadosRetornados);
            setVersaoImagem(Date.now());
            setEtapa("resultado");
        } catch (err) {
            setErro(err.message || "Não foi possível conectar ao servidor.");
        } finally {
            setCarregando(false);
        }
    };


    // Auxiliares para extrair os dados da API com segurança
    const obterClassificacao = () => resultadoAPI?.analise_global?.classification || "Não identificada";
    const obterScoreFinal = () => resultadoAPI?.analise_global?.combined_score ?? 0;
    const obterPixelScore = () => resultadoAPI?.analise_global?.pixel_score ?? 0;
    const obterScoreGeometria = () => resultadoAPI?.analise_global?.geometry_score ?? 0;
    const obterContinuidade = () => resultadoAPI?.analise_global?.continuity_score ?? "-";
    const obterMaiorBloco = () => resultadoAPI?.analise_global?.max_block_score ?? "-";
    const obterBlocosSuspeitos = () => resultadoAPI?.lista_anomalias?.length ?? 0;
    const obterTotalRegioes = () => resultadoAPI?.total_regioes_texto ?? 0;
    const obterRegioesSuspeitas = () => resultadoAPI?.analise_global?.suspicious_geometry_regions ?? 0;


    // Determina classe e status do resultado
    const ehAutentico = () => {
        const classif = obterClassificacao().toLowerCase();
        return !classif.includes("alta");
    };


    const classeResultado = () => {
        const classif = obterClassificacao().toLowerCase();
        if (classif.includes("alta")) return "alta";
        if (classif.includes("média") || classif.includes("media")) return "media";
        return "baixa";
    };


    return (
        <div
            className={`analise ${dragAtivo ? "drag-ativo" : ""}`}
            onDragOver={(e) => {
                e.preventDefault();
                setDragAtivo(true);
            }}
            onDragLeave={() => setDragAtivo(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragAtivo(false);
                const file = e.dataTransfer.files[0];
                handleArquivo(file);
            }}
        >
            <Header />


            <section className="secanalise">
                <h1 className="titulos-analise">Análise de Documento</h1>


                <div className="container row-analise">


                    {/* CARD PRINCIPAL */}
                    <div className="card-analise">


                        {/* ETAPA 1: UPLOAD */}
                        {etapa === "upload" && (
                            <div className="upload-area">
                                <div className="icone-download"><LuDownload /></div>
                                <h3>Arraste ou envie seu documento</h3>


                                <div className="btn-upload">
                                    <label style={{ cursor: "pointer" }}>
                                        Selecione um arquivo
                                        <input
                                            type="file"
                                            hidden
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>


                                <p>JPG, PNG ou PDF</p>
                            </div>
                        )}


                        {/* ETAPA 2: PREVIEW & ENVIAR */}
                        {etapa === "preview" && (
                            <div className="preview-area">
                                <div className="preview-area-img">
                                    {arquivo?.type?.includes("image") ? (
                                        <img
                                            src={preview}
                                            alt="Documento"
                                            className="preview-img"
                                        />
                                    ) : arquivo?.type === "application/pdf" ? (
                                        <div className="pdf-preview">
                                            <FaFilePdf size={80} color="#00A279" />
                                            <h3>{arquivo.name}</h3>
                                        </div>
                                    ) : (
                                        <p>{arquivo?.name}</p>
                                    )}
                                </div>


                                {erro && (
                                    <p style={{ color: "#d9534f", marginTop: "15px", fontWeight: "bold" }}>
                                        {erro}
                                    </p>
                                )}


                                <button
                                    className="btn-acao"
                                    onClick={analisarDocumento}
                                    disabled={carregando}
                                >
                                    {carregando ? "Analisando documento..." : "Analisar documento"}
                                </button>
                            </div>
                        )}


                        {/* ETAPA 3: RESULTADO SINTÉTICO */}
                        {etapa === "resultado" && (
                            <div className="resultado-area">
                                <div className="icone-resultado">
                                    {ehAutentico() ? <GoShieldCheck /> : <GoShield />}
                                </div>


                                <h2>
                                    {ehAutentico() ? "Autêntico" : "Suspeito"}
                                </h2>


                                <p>
                                    {ehAutentico()
                                        ? "Seu documento foi analisado com sucesso e não foram identificados sinais significativos de alteração."
                                        : "Seu documento foi analisado e foram identificadas possíveis inconsistências na estrutura ou pixels."}
                                </p>


                                <p>
                                    <strong>
                                        Classificação Final: {obterClassificacao()} ({Number(obterScoreFinal()).toFixed(1)}%)
                                    </strong>
                                </p>


                                <button
                                    className="btn-acao"
                                    onClick={() => setEtapa("relatorio")}
                                >
                                    Ver relatório completo
                                </button>
                            </div>
                        )}


                        {/* ETAPA 4: RELATÓRIO DETALHADO COMPLETO */}
                        {etapa === "relatorio" && (
                            <div className="relatorio-area">
                                <div className="section-title">
                                    <span>DETALHAMENTO TÉCNICO</span>
                                    <h2>Relatório de Análise</h2>
                                </div>


                                {/* SCORE PRINCIPAL & EXPLICAÇÃO */}
                                <div className="resultado-principal" style={{ marginTop: "20px" }}>
                                    <div className={`score-card ${classeResultado()}`}>
                                        <div className="score-label">SCORE FINAL</div>
                                        <div className="score">
                                            {Number(obterScoreFinal()).toFixed(1)}
                                            <small>%</small>
                                        </div>
                                        <div className="classificacao">{obterClassificacao()}</div>
                                    </div>


                                    <div className="explicacao">
                                        <span className="mini-label">RESULTADO DA FUSÃO</span>
                                        <h3>Resumo da Análise</h3>
                                        <p>
                                            O resultado final combina as análises de pixels e EOCR. A análise de pixels
                                            representa 70% do resultado e a análise geométrica textual representa 30%.
                                        </p>
                                    </div>
                                </div>


                                {/* GALERIA DE IMAGENS DAS ANÁLISES */}
                                <div className="section-title" style={{ marginTop: "30px" }}>
                                    <span>VISUALIZAÇÃO</span>
                                    <h2>Imagens das análises</h2>
                                </div>


                                <div className="imagens-analise">
                                    <div className="imagem-analise-card">
                                        <div className="imagem-analise-header">
                                            <span>PIXEL</span>
                                            <h3>Mapa de blocos suspeitos</h3>
                                        </div>
                                        <div className="imagem-container">
                                            <img
                                                src={`http://127.0.0.1:5000/results/block_heatmap.png?v=${versaoImagem}`}
                                                alt="Heatmap da análise de pixels"
                                            />
                                        </div>
                                        <p>Visualização dos blocos identificados pela análise de pixels.</p>
                                    </div>


                                    <div className="imagem-analise-card">
                                        <div className="imagem-analise-header">
                                            <span>EOCR</span>
                                            <h3>Análise híbrida</h3>
                                        </div>
                                        <div className="imagem-container">
                                            <img
                                                src={`http://127.0.0.1:5000/results/hybrid_analysis.png?v=${versaoImagem}`}
                                                alt="Resultado visual da análise EOCR"
                                            />
                                        </div>
                                        <p>Visualização das regiões textuais analisadas pelo EOCR.</p>
                                    </div>


                                    <div className="imagem-analise-card">
                                        <div className="imagem-analise-header">
                                            <span>CONTINUIDADE</span>
                                            <h3>Mapa de continuidade</h3>
                                        </div>
                                        <div className="imagem-container">
                                            <img
                                                src={`http://127.0.0.1:5000/results/continuity_heatmap.png?v=${versaoImagem}`}
                                                alt="Heatmap de continuidade dos pixels"
                                            />
                                        </div>
                                        <p>Visualização das variações de continuidade encontradas no documento.</p>
                                    </div>
                                </div>


                                {/* CARDS DE ANÁLISES COM BARRAS DE PROGRESSO */}
                                <div className="analises-grid" style={{ marginTop: "30px" }}>
                                    {/* CARD PIXEL */}
                                    <div className="analise-card">
                                        <div className="card-top">
                                            <div className="card-icon">P</div>
                                            <span>ANÁLISE DE PIXELS</span>
                                        </div>
                                        <h3>{Number(obterPixelScore()).toFixed(1)}%</h3>
                                        <div className="barra">
                                            <div style={{ width: `${Math.min(Number(obterPixelScore()), 100)}%` }}></div>
                                        </div>
                                        <p>Avaliação de alterações e inconsistências nos pixels do documento.</p>
                                    </div>


                                    {/* CARD EOCR */}
                                    <div className="analise-card">
                                        <div className="card-top">
                                            <div className="card-icon">E</div>
                                            <span>ANÁLISE EOCR</span>
                                        </div>
                                        <h3>{Number(obterScoreGeometria()).toFixed(1)}%</h3>
                                        <div className="barra">
                                            <div style={{ width: `${Math.min(Number(obterScoreGeometria()), 100)}%` }}></div>
                                        </div>
                                        <p>Avaliação da geometria textual, incluindo ângulo e densidade das regiões.</p>
                                    </div>


                                    {/* CARD FUSÃO */}
                                    <div className="analise-card">
                                        <div className="card-top">
                                            <div className="card-icon">F</div>
                                            <span>FUSÃO DAS ANÁLISES</span>
                                        </div>
                                        <h3>{Number(obterScoreFinal()).toFixed(1)}%</h3>
                                        <div className="barra">
                                            <div style={{ width: `${Math.min(Number(obterScoreFinal()), 100)}%` }}></div>
                                        </div>
                                        <p>Combinação dos resultados para gerar a classificação final.</p>
                                    </div>
                                </div>


                                {/* GRID DE MÉTRICAS DETALHADAS */}
                                <div className="section-title metric-title" style={{ marginTop: "30px" }}>
                                    <span>DETALHAMENTO</span>
                                    <h2>Métricas da análise</h2>
                                </div>


                                <div className="metricas">
                                    <div className="metrica">
                                        <span>Score de pixels</span>
                                        <strong>{Number(obterPixelScore()).toFixed(2)}</strong>
                                    </div>
                                    <div className="metrica">
                                        <span>Score EOCR</span>
                                        <strong>{Number(obterScoreGeometria()).toFixed(2)}</strong>
                                    </div>
                                    <div className="metrica">
                                        <span>Score combinado</span>
                                        <strong>{Number(obterScoreFinal()).toFixed(2)}</strong>
                                    </div>
                                    <div className="metrica">
                                        <span>Continuidade</span>
                                        <strong>{obterContinuidade()}</strong>
                                    </div>
                                    <div className="metrica">
                                        <span>Maior bloco suspeito</span>
                                        <strong>{obterMaiorBloco()}</strong>
                                    </div>
                                    <div className="metrica">
                                        <span>Blocos suspeitos</span>
                                        <strong>{obterBlocosSuspeitos()}</strong>
                                    </div>
                                    <div className="metrica">
                                        <span>Anomalias de vizinhança</span>
                                        <strong>-</strong>
                                    </div>
                                    <div className="metrica">
                                        <span>Regiões EOCR</span>
                                        <strong>{obterTotalRegioes()}</strong>
                                    </div>
                                    <div className="metrica">
                                        <span>Regiões suspeitas</span>
                                        <strong>{obterRegioesSuspeitas()}</strong>
                                    </div>
                                </div>


                                {/* ÁREAS DE ATENÇÃO / LISTA DE ANOMALIAS */}
                                {resultadoAPI?.lista_anomalias && resultadoAPI.lista_anomalias.length > 0 && (
                                    <div className="regioes" style={{ marginTop: "30px" }}>
                                        <div className="section-title">
                                            <span>ATENÇÃO</span>
                                            <h2>Áreas que merecem atenção</h2>
                                        </div>


                                        <div className="regioes-list">
                                            {resultadoAPI.lista_anomalias.map((anomalia, index) => (
                                                <div className="regiao" key={index}>
                                                    <div className="regiao-number">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </div>
                                                    <div className="regiao-info">
                                                        <strong>
                                                            {anomalia.texto_identificado || `Região ${index + 1}`}
                                                        </strong>
                                                        <span>
                                                            Nível: {anomalia.nivel_classificacao} | Pontuação Suspeita: {Number(anomalia.pontuacao_suspeita).toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                {/* BOTÃO PARA VOLTAR */}
                                <div className="acoes-relatorio" style={{ marginTop: "30px", textAlign: "center" }}>
                                    <button
                                        className="btn-acao btn-fechar-rel"
                                        onClick={() => setEtapa("resultado")}
                                    >
                                        Voltar para o Resultado
                                    </button>
                                </div>
                            </div>
                        )}


                    </div>


                    {/* CARD DE STATUS LATERAL */}
                    <div className="card-status">
                        <h3>Status</h3>
                        <hr />


                        <div className="status-item">
                            <div className={`status-circle ${etapa !== "upload" ? "concluido" : ""}`}>
                                {etapa !== "upload" && <FaCheck />}
                            </div>
                            <span>Upload do arquivo</span>
                        </div>


                        <div className="status-item">
                            <div
                                className={`status-circle ${["resultado", "relatorio"].includes(etapa) ? "concluido" : ""
                                    }`}
                            >
                                {["resultado", "relatorio"].includes(etapa) && <FaCheck />}
                            </div>
                            <span>Análise do documento</span>
                        </div>


                        <div className="status-item">
                            <div className={`status-circle ${etapa === "relatorio" ? "concluido" : ""}`}>
                                {etapa === "relatorio" && <FaCheck />}
                            </div>
                            <span>Relatório</span>
                        </div>
                    </div>


                </div>
            </section>


            <Footer />
            <BackToTop />
        </div>
    );
}


export default Analise;
