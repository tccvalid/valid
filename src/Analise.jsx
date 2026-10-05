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
    const [gerandoPDF, setGerandoPDF] = useState(false);


    // Estados para integração com a API
    const [resultadoAPI, setResultadoAPI] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [versaoImagem, setVersaoImagem] = useState(Date.now());
    const [modoComparacao, setModoComparacao] = useState(false);
    const [documento2, setDocumento2] = useState(null);
    const [resultadoComparacao, setResultadoComparacao] = useState(null);
    const [detalheComparacao, setDetalheComparacao] = useState(false);


    // Manipulação de seleção do arquivo
    const handleArquivo = (file) => {
        if (file) {
            setArquivo(file);
            setPreview(URL.createObjectURL(file));
            setErro("");
            setResultadoAPI(null);
            if (!modoComparacao) setEtapa("preview");
        }
    };


    const handleInputChange = (e) => {
        const file = e.target.files[0];
        handleArquivo(file);
    };


    const compararDocumentos = async () => {
        if (!arquivo || !documento2) {
            setErro("Selecione os dois documentos para comparar.");
            return;
        }

        setCarregando(true);
        setErro("");
        setResultadoComparacao(null);
        setDetalheComparacao(false);

        const dados = new FormData();
        dados.append("documento1", arquivo);
        dados.append("documento2", documento2);

        try {
            const resposta = await fetch(
                "http://127.0.0.1:5000/valid/comparar",
                {
                    method: "POST",
                    body: dados
                }
            );

            const json = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    json.erro || "Erro ao comparar documentos."
                );
            }

            setResultadoComparacao(json.comparacao);
            setDetalheComparacao(false);
        } catch (err) {
            setErro(
                err.message ||
                "Não foi possível conectar ao comparador."
            );
        } finally {
            setCarregando(false);
        }
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


            // Salva a análise no histórico do usuário logado.
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const salvo = await fetch("http://localhost:8000/analises/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            nome_arquivo: arquivo.name,
                            tamanho_bytes: arquivo.size,
                            resultado: dadosRetornados
                        })
                    });

                    if (!salvo.ok) {
                        console.warn("Histórico não salvo:", await salvo.text());
                    }
                } catch (falhaHistorico) {
                    console.warn("API de histórico indisponível:", falhaHistorico);
                }
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

    // =========================================================
    // GERAR E BAIXAR RELATÓRIO PDF
    // =========================================================

    const baixarPDF = async () => {

        if (!resultadoAPI) {
            setErro("Nenhum resultado de análise disponível.");
            return;
        }

        setGerandoPDF(true);
        setErro("");

        try {

            const dadosPDF = {
                ...resultadoAPI,
                nome_arquivo: arquivo?.name || "documento_analisado"
            };

            const resposta = await fetch(
                "http://127.0.0.1:5000/gerar_pdf",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dadosPDF)
                }
            );

            if (!resposta.ok) {

                let mensagem = "Erro ao gerar o relatório PDF.";

                try {
                    const erroAPI = await resposta.json();
                    mensagem = erroAPI.erro || mensagem;
                } catch {
                    // mantém mensagem padrão
                }

                throw new Error(mensagem);
            }

            // Recebe o PDF como arquivo
            const blob = await resposta.blob();

            // Cria um endereço temporário para o PDF
            const url = window.URL.createObjectURL(blob);

            // Cria um link temporário para download
            const link = document.createElement("a");

            link.href = url;
            link.download = `VALID_Relatorio_${arquivo?.name?.replace(/\.[^/.]+$/, "") || "documento"}.pdf`;

            document.body.appendChild(link);

            link.click();

            // Limpa depois do download
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error("Erro ao gerar PDF:", err);

            setErro(
                err.message ||
                "Não foi possível gerar o relatório PDF."
            );

        } finally {

            setGerandoPDF(false);
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

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        justifyContent: "center",
                                        marginBottom: "24px",
                                        flexWrap: "wrap"
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="btn-acao"
                                        onClick={() => {
                                            setModoComparacao(false);
                                            setDocumento2(null);
                                            setResultadoComparacao(null);
                                            setDetalheComparacao(false);
                                            setErro("");
                                        }}
                                        style={{
                                            opacity: modoComparacao ? 0.65 : 1
                                        }}
                                    >
                                        Análise individual
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-acao"
                                        onClick={() => {
                                            setModoComparacao(true);
                                            setResultadoAPI(null);
                                            setResultadoComparacao(null);
                                            setDetalheComparacao(false);
                                            setEtapa("upload");
                                            setErro("");
                                        }}
                                        style={{
                                            opacity: modoComparacao ? 1 : 0.65
                                        }}
                                    >
                                        Comparar documentos
                                    </button>
                                </div>

                                {!modoComparacao ? (
                                    <>
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
                                    </>
                                ) : (
                                    <div className="comparacao-area">

                                        {!carregando && !resultadoComparacao && (
                                            <>
                                                <div className="comparacao-documentos-grid">
                                                    <div className={`comparacao-arquivo-card ${arquivo ? "selecionado" : ""}`}>
                                                        <div className="comparacao-arquivo-icone">
                                                            <FaFilePdf />
                                                        </div>

                                                        <span className="mini-label">DOCUMENTO 01</span>
                                                        <h3>
                                                            {arquivo
                                                                ? arquivo.name
                                                                : "Selecione o primeiro documento"}
                                                        </h3>

                                                        <p>
                                                            Documento principal que será usado como referência na comparação.
                                                        </p>

                                                        <div className="btn-upload">
                                                            <label style={{ cursor: "pointer" }}>
                                                                {arquivo ? "Trocar documento" : "Selecionar documento"}
                                                                <input
                                                                    type="file"
                                                                    hidden
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];

                                                                        if (file) {
                                                                            setArquivo(file);
                                                                            setErro("");
                                                                            setResultadoComparacao(null);
                                                                            setDetalheComparacao(false);
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="comparacao-conector">
                                                        <div className="comparacao-linha"></div>
                                                        <span>VS</span>
                                                        <div className="comparacao-linha"></div>
                                                    </div>

                                                    <div className={`comparacao-arquivo-card ${documento2 ? "selecionado" : ""}`}>
                                                        <div className="comparacao-arquivo-icone">
                                                            <FaFilePdf />
                                                        </div>

                                                        <span className="mini-label">DOCUMENTO 02</span>
                                                        <h3>
                                                            {documento2
                                                                ? documento2.name
                                                                : "Selecione o segundo documento"}
                                                        </h3>

                                                        <p>
                                                            Documento que terá nome, CPF e data confrontados com o primeiro.
                                                        </p>

                                                        <div className="btn-upload">
                                                            <label style={{ cursor: "pointer" }}>
                                                                {documento2 ? "Trocar documento" : "Selecionar documento"}
                                                                <input
                                                                    type="file"
                                                                    hidden
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];

                                                                        if (file) {
                                                                            setDocumento2(file);
                                                                            setErro("");
                                                                            setResultadoComparacao(null);
                                                                            setDetalheComparacao(false);
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {erro && (
                                                    <p className="erro-comparacao">
                                                        {erro}
                                                    </p>
                                                )}

                                                <button
                                                    className="btn-acao"
                                                    onClick={compararDocumentos}
                                                    disabled={!arquivo || !documento2}
                                                >
                                                    Comparar documentos
                                                </button>
                                            </>
                                        )}

                                        {carregando && (
                                            <div className="scanner-loading comparacao-loading">
                                                <div className="scanner-particles">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>

                                                <div className="document-scanner">
                                                    <div className="document-glow"></div>

                                                    <div className="fake-document">
                                                        <div className="doc-top">
                                                            <div className="doc-symbol"></div>

                                                            <div className="doc-title-lines">
                                                                <span></span>
                                                                <span></span>
                                                            </div>
                                                        </div>

                                                        <div className="doc-line long"></div>
                                                        <div className="doc-line medium"></div>
                                                        <div className="doc-line short"></div>

                                                        <div className="doc-block">
                                                            <span></span>
                                                            <span></span>
                                                            <span></span>
                                                        </div>

                                                        <div className="doc-line long"></div>
                                                        <div className="doc-line medium"></div>

                                                        <div className="scanner-line">
                                                            <div className="scanner-line-glow"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="loading-text">
                                                    <div className="loading-eyebrow">
                                                        <span className="pulse-dot"></span>
                                                        COMPARAÇÃO EM ANDAMENTO
                                                    </div>

                                                    <h2>
                                                        Comparando os documentos
                                                    </h2>

                                                    <p>
                                                        O VALID está extraindo e confrontando os campos dos dois arquivos para medir a compatibilidade.
                                                    </p>

                                                    <div className="loading-status">
                                                        <span className="status-loader"></span>
                                                        Verificando nome, CPF e data...
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {resultadoComparacao && !detalheComparacao && (
                                            <div className="resultado-area comparacao-resultado-enter">
                                                <div className="icone-resultado">
                                                    {resultadoComparacao.status === "COMPATIVEL"
                                                        ? <GoShieldCheck />
                                                        : <GoShield />}
                                                </div>

                                                <h2>
                                                    {resultadoComparacao.status === "COMPATIVEL"
                                                        ? "Documentos compatíveis"
                                                        : resultadoComparacao.status === "PARCIALMENTE_COMPATIVEL"
                                                            ? "Compatibilidade parcial"
                                                            : "Documentos divergentes"}
                                                </h2>

                                                <p>
                                                    {resultadoComparacao.status === "COMPATIVEL"
                                                        ? "Os campos comparáveis encontrados nos dois documentos apresentam correspondência."
                                                        : resultadoComparacao.status === "PARCIALMENTE_COMPATIVEL"
                                                            ? "Parte dos campos coincide, mas existem diferenças que merecem atenção."
                                                            : "Foram identificadas divergências entre os campos extraídos dos documentos."}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Compatibilidade Final:{" "}
                                                        {Number(resultadoComparacao.compatibilidade ?? 0).toFixed(1)}%
                                                    </strong>
                                                </p>

                                                <button
                                                    className="btn-acao"
                                                    onClick={() => setDetalheComparacao(true)}
                                                >
                                                    Ver relatório completo
                                                </button>
                                            </div>
                                        )}

                                        {resultadoComparacao && detalheComparacao && (
                                            <div className="relatorio-area comparacao-resultado-enter">
                                                <div className="section-title">
                                                    <span>DETALHAMENTO TÉCNICO</span>
                                                    <h2>Relatório de Comparação</h2>
                                                </div>

                                                <div
                                                    className="resultado-principal"
                                                    style={{ marginTop: "20px" }}
                                                >
                                                    <div
                                                        className={`score-card ${
                                                            resultadoComparacao.status === "COMPATIVEL"
                                                                ? "baixa"
                                                                : resultadoComparacao.status === "PARCIALMENTE_COMPATIVEL"
                                                                    ? "media"
                                                                    : "alta"
                                                        }`}
                                                    >
                                                        <div className="score-label">
                                                            COMPATIBILIDADE
                                                        </div>

                                                        <div className="score">
                                                            {Number(
                                                                resultadoComparacao.compatibilidade ?? 0
                                                            ).toFixed(1)}
                                                            <small>%</small>
                                                        </div>

                                                        <div className="classificacao">
                                                            {resultadoComparacao.status === "COMPATIVEL"
                                                                ? "Compatível"
                                                                : resultadoComparacao.status === "PARCIALMENTE_COMPATIVEL"
                                                                    ? "Parcialmente compatível"
                                                                    : "Incompatível"}
                                                        </div>
                                                    </div>

                                                    <div className="explicacao">
                                                        <span className="mini-label">
                                                            RESULTADO DA COMPARAÇÃO
                                                        </span>

                                                        <h3>
                                                            Resumo da análise
                                                        </h3>

                                                        <p>
                                                            O VALID comparou os campos estruturados encontrados nos dois documentos.
                                                            O percentual representa a compatibilidade entre os dados disponíveis e deve
                                                            ser utilizado como apoio à triagem documental.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div
                                                    className="section-title"
                                                    style={{ marginTop: "30px" }}
                                                >
                                                    <span>DOCUMENTOS</span>
                                                    <h2>Arquivos comparados</h2>
                                                </div>

                                                <div className="comparacao-resumo-arquivos">
                                                    <div className="metrica">
                                                        <span>Documento 01</span>
                                                        <strong>{arquivo?.name || "-"}</strong>
                                                    </div>

                                                    <div className="metrica">
                                                        <span>Documento 02</span>
                                                        <strong>{documento2?.name || "-"}</strong>
                                                    </div>
                                                </div>

                                                <div
                                                    className="section-title"
                                                    style={{ marginTop: "30px" }}
                                                >
                                                    <span>COMPARAÇÃO DE CAMPOS</span>
                                                    <h2>Resultados encontrados</h2>
                                                </div>

                                                <div className="analises-grid">
                                                    {[
                                                        {
                                                            chave: "nome",
                                                            titulo: "NOME",
                                                            icone: "N",
                                                            descricao: "Correspondência entre os nomes identificados."
                                                        },
                                                        {
                                                            chave: "cpf",
                                                            titulo: "CPF",
                                                            icone: "C",
                                                            descricao: "Correspondência entre os CPFs identificados."
                                                        },
                                                        {
                                                            chave: "data",
                                                            titulo: "DATA",
                                                            icone: "D",
                                                            descricao: "Correspondência entre as datas identificadas."
                                                        }
                                                    ].map((campo) => {
                                                        const statusCampo =
                                                            resultadoComparacao.campos?.[campo.chave];

                                                        const compativel =
                                                            statusCampo === "COMPATIVEL";

                                                        const naoComparavel =
                                                            !statusCampo ||
                                                            statusCampo === "NAO_IDENTIFICADO" ||
                                                            statusCampo === "NAO_COMPARAVEL";

                                                        const percentual =
                                                            campo.chave === "nome"
                                                                ? Math.min(
                                                                    Number(
                                                                        resultadoComparacao.detalhes
                                                                            ?.nome_similaridade ?? 0
                                                                    ) * 100,
                                                                    100
                                                                )
                                                                : compativel
                                                                    ? 100
                                                                    : 0;

                                                        const valores =
                                                            resultadoComparacao.detalhes
                                                                ?.valores?.[campo.chave];

                                                        const formatarValor = (valor) => {
                                                            if (Array.isArray(valor)) {
                                                                return valor.length
                                                                    ? valor.join(", ")
                                                                    : "Não identificado";
                                                            }

                                                            if (
                                                                valor === null ||
                                                                valor === undefined ||
                                                                valor === ""
                                                            ) {
                                                                return "Não identificado";
                                                            }

                                                            return String(valor);
                                                        };

                                                        return (
                                                            <div
                                                                className={`analise-card comparacao-campo-card ${
                                                                    compativel
                                                                        ? "campo-compativel"
                                                                        : naoComparavel
                                                                            ? "campo-neutro"
                                                                            : "campo-divergente"
                                                                }`}
                                                                key={campo.chave}
                                                            >
                                                                <div className="card-top">
                                                                    <div className="card-icon">
                                                                        {campo.icone}
                                                                    </div>

                                                                    <span>{campo.titulo}</span>
                                                                </div>

                                                                <h3>
                                                                    {naoComparavel
                                                                        ? "Não identificado"
                                                                        : compativel
                                                                            ? "Compatível"
                                                                            : statusCampo === "PARCIALMENTE_COMPATIVEL"
                                                                                ? "Parcialmente compatível"
                                                                                : statusCampo === "INVALIDO"
                                                                                    ? "Inválido"
                                                                                    : statusCampo === "AMBIGUO"
                                                                                        ? "Ambíguo"
                                                                                        : "Divergente"}
                                                                </h3>

                                                                <div className="barra">
                                                                    <div
                                                                        style={{
                                                                            width: `${percentual}%`
                                                                        }}
                                                                    ></div>
                                                                </div>

                                                                <p>
                                                                    {campo.descricao}
                                                                </p>

                                                                {valores && (
                                                                    <div className="comparacao-valores">
                                                                        <div className="comparacao-valor-linha">
                                                                            <span>Documento 1</span>
                                                                            <strong>
                                                                                {formatarValor(valores.documento1)}
                                                                            </strong>
                                                                        </div>

                                                                        <div className="comparacao-valor-linha">
                                                                            <span>Documento 2</span>
                                                                            <strong>
                                                                                {formatarValor(valores.documento2)}
                                                                            </strong>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {campo.chave === "nome" && (
                                                                    <p className="comparacao-similaridade">
                                                                        Similaridade nominal:{" "}
                                                                        <strong>
                                                                            {percentual.toFixed(1)}%
                                                                        </strong>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div
                                                    className="section-title metric-title"
                                                    style={{ marginTop: "30px" }}
                                                >
                                                    <span>DETALHAMENTO</span>
                                                    <h2>Métricas da comparação</h2>
                                                </div>

                                                <div className="metricas">
                                                    <div className="metrica">
                                                        <span>Compatibilidade geral</span>
                                                        <strong>
                                                            {Number(
                                                                resultadoComparacao.compatibilidade ?? 0
                                                            ).toFixed(2)}%
                                                        </strong>
                                                    </div>

                                                    <div className="metrica">
                                                        <span>Campos comparáveis</span>
                                                        <strong>
                                                            {resultadoComparacao.detalhes
                                                                ?.campos_comparaveis ?? 0}
                                                        </strong>
                                                    </div>

                                                    <div className="metrica">
                                                        <span>Similaridade do nome</span>
                                                        <strong>
                                                            {(
                                                                Number(
                                                                    resultadoComparacao.detalhes
                                                                        ?.nome_similaridade ?? 0
                                                                ) * 100
                                                            ).toFixed(2)}%
                                                        </strong>
                                                    </div>

                                                    <div className="metrica">
                                                        <span>Status final</span>
                                                        <strong>
                                                            {resultadoComparacao.status === "COMPATIVEL"
                                                                ? "Compatível"
                                                                : resultadoComparacao.status === "PARCIALMENTE_COMPATIVEL"
                                                                    ? "Parcial"
                                                                    : "Incompatível"}
                                                        </strong>
                                                    </div>
                                                </div>

                                                <div className="acoes-relatorio comparacao-acoes">
                                                    <button
                                                        className="btn-acao btn-fechar-rel"
                                                        onClick={() => setDetalheComparacao(false)}
                                                    >
                                                        Voltar para o Resultado
                                                    </button>

                                                    <button
                                                        className="btn-acao"
                                                        onClick={() => {
                                                            setArquivo(null);
                                                            setDocumento2(null);
                                                            setResultadoComparacao(null);
                                                            setDetalheComparacao(false);
                                                            setErro("");
                                                        }}
                                                    >
                                                        Comparar outros documentos
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* ETAPA 2: PREVIEW & ENVIAR */}
                        {etapa === "preview" && (
                            <div className={`preview-area ${carregando ? "modo-carregando" : ""}`}>

                                {!carregando ? (
                                    <>
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
                                            <p
                                                style={{
                                                    color: "#d9534f",
                                                    marginTop: "15px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {erro}
                                            </p>
                                        )}

                                        <button
                                            className="btn-acao"
                                            onClick={analisarDocumento}
                                            disabled={carregando}
                                        >
                                            Analisar documento
                                        </button>
                                    </>
                                ) : (
                                    <div className="scanner-loading">

                                        {/* DOCUMENTO */}
                                        <div className="document-scanner">

                                            <div className="document-glow"></div>

                                            <div className="fake-document">

                                                <div className="doc-top">
                                                    <div className="doc-symbol"></div>

                                                    <div className="doc-title-lines">
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                </div>

                                                <div className="doc-line long"></div>
                                                <div className="doc-line medium"></div>
                                                <div className="doc-line short"></div>

                                                <div className="doc-block">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>

                                                <div className="doc-line long"></div>
                                                <div className="doc-line medium"></div>

                                                {/* LINHA DO SCANNER */}
                                                <div className="scanner-line">
                                                    <div className="scanner-line-glow"></div>
                                                </div>

                                            </div>
                                        </div>

                                        {/* TEXTO */}
                                        <div className="loading-text">

                                            <h2>
                                                Analisando seu documento
                                            </h2>

                                            <p>
                                                O sistema está examinando pixels,
                                                regiões textuais e padrões estruturais.
                                            </p>

                                            <div className="loading-status">
                                                <span className="status-loader"></span>
                                                <span className="loading-message">
                                                    Processando informações...
                                                </span>
                                            </div>

                                        </div>

                                    </div>
                                )}
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
                                            representa 50% do resultado e a análise geométrica textual representa 50%.
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
                                                            Nível: {anomalia.nivel_classificacao}
                                                            {" | "}
                                                            Pontuação Suspeita:{" "}
                                                            {Number(anomalia.pontuacao_suspeita).toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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


                                {/* BOTÃO PARA VOLTAR */}
                                {/* AÇÕES DO RELATÓRIO */}
                                <div
                                    className="acoes-relatorio"
                                    style={{
                                        marginTop: "30px",
                                        textAlign: "center",
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "15px",
                                        flexWrap: "wrap"
                                    }}
                                >

                                    {/* BOTÃO BAIXAR PDF */}
                                    <button
                                        className="btn-acao"
                                        onClick={baixarPDF}
                                        disabled={gerandoPDF}
                                    >
                                        <FaFilePdf style={{ marginRight: "8px" }} />

                                        {gerandoPDF
                                            ? "Gerando PDF..."
                                            : "Baixar relatório PDF"
                                        }
                                    </button>


                                    {/* BOTÃO VOLTAR */}
                                    <button
                                        className="btn-acao btn-fechar-rel"
                                        onClick={() => setEtapa("resultado")}
                                        disabled={gerandoPDF}
                                    >
                                        Voltar para o Resultado
                                    </button>

                                </div>

                                {/* ERRO AO GERAR PDF */}
                                {erro && (
                                    <p
                                        style={{
                                            color: "#d9534f",
                                            marginTop: "15px",
                                            textAlign: "center",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {erro}
                                    </p>
                                )}
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

