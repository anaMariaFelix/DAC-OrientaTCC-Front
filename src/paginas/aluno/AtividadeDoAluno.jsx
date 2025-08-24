import React, { useRef, useState, useEffect } from "react";
import NavBar from "../../componentes/NavBar";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { CiTrash } from "react-icons/ci";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { buscarUmaAtividade } from "../../services/AtividadeService";
import { useAppContext } from "../../context/AppContext";
import { atualizarAtividade } from "../../services/AtividadeService";
import { toast } from 'react-toastify';
import { deletarPdf } from "../../services/PdfService";

const AdicionarTrabalhoDoTcc = () => {
    const { user,token  } = useAppContext();
    const { idAtividade } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { tccSelecionado } = location.state;
    const [comentario, setComentario] = useState("");
    const [comentariosAnteriores, setComentariosAnteriores] = useState([]);
    const [atividade, setAtividade] = useState(null);
    const [pdfs, setPdfs] = useState([]);
    const [novosPdfs, setNovosPdfs] = useState([]);
    const [pdfsRemovidos, setPdfsRemovidos] = useState([]);
    const [pdfsUsuario, setPdfsUsuario] = useState([]);
    const [pdfsRecebidos, setPdfsRecebidos] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        async function fetchAtividade() {
            try {
                const atividadeEncontrada = await buscarUmaAtividade(idAtividade, token);

                if (atividadeEncontrada?.pdfs?.length) {
                    const arquivos = atividadeEncontrada.pdfs.map(pdf => ({
                        id: pdf.id,
                        nomeArquivo: pdf.nomeArquivo,
                        url: `http://localhost:8080/pdf/arquivo/${pdf.id}`,
                        nomeAdicionou: pdf.nomeAdicionou
                    }));

                    const enviadosPorUsuario = arquivos.filter(pdf => pdf.nomeAdicionou === user.nome);
                    const recebidosDeAlunos = arquivos.filter(pdf => pdf.nomeAdicionou !== user.nome);

                    setPdfsUsuario(enviadosPorUsuario);
                    setPdfsRecebidos(recebidosDeAlunos);
                } else {
                    setPdfsUsuario([]);
                    setPdfsRecebidos([]);
                }

                setAtividade(atividadeEncontrada);

                if (atividadeEncontrada?.comentarios) {
                    setComentariosAnteriores(atividadeEncontrada.comentarios);
                }

                if (atividadeEncontrada?.comentario) {
                    setComentario(atividadeEncontrada.comentario);
                }

            } catch (error) {
                console.error("Erro ao buscar atividade:", error);
            }
        }

        if(token) fetchAtividade();
    }, [tccSelecionado, token]);


    const handleFileSelect = (event) => {
        const arquivos = Array.from(event.target.files).map(file => ({
            nomeArquivo: file.name,
            url: URL.createObjectURL(file),
            file: file,
        }));
        setNovosPdfs(prev => [...prev, ...arquivos]);
    };

    const handleExcluirPdf = async (pdf) => {
        if (pdf.nomeAdicionou && pdf.nomeAdicionou !== user.nome) return;

        if (pdf.id) {
            setPdfsRemovidos(prev => [...prev, pdf.id]);
            setPdfsUsuario(prev => prev.filter(p => p.nomeArquivo !== pdf.nomeArquivo));
        } else {
            setNovosPdfs(prev => prev.filter(p => p.nomeArquivo !== pdf.nomeArquivo));
        }

        try {
            await deletarPdf(pdf.id, token)
            notifySuccess("Pdf excluido com sucesso");
        } catch (error) {
            console.log(error)
        }
    }
    
    const formatarDataExibir = (dataParaFormatar) => {
        if (!dataParaFormatar) return "";

        const data = new Date(dataParaFormatar);

        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();

        return `${dia}/${mes}/${ano}`;
    }

    const handleVoltar = () => {
        navigate("/listaAtividadesAluno", { state: { tccSelecionado: tccSelecionado } });
    };

    const handleAdicionarComentario = async () => {
        if (comentario.trim() === "") return;

        const novosComentarios = [...comentariosAnteriores, comentario];
        setComentariosAnteriores(novosComentarios);
        setComentario("");

        try {
            await salvarAtividade(novosComentarios, token);

        } catch (error) {
            console.log(error);
        }
    };

     const salvarAtividade = async (comentariosParaSalvar = comentariosAnteriores) => {
        const atividadeAtualizada = {
            ...atividade,
            idTrabalho: tccSelecionado.id,
            nome: atividade.nome,
            descricao: atividade.descricao,
            dataEntrega: formatarDataAtualizar(atividade.dataEntrega),
            comentarios: comentariosParaSalvar,
            statusPdf: atividade.status,
            nomeAdicionouPdfs: user.nome
        };

        const formData = new FormData();
        formData.append("atividade", new Blob([JSON.stringify(atividadeAtualizada)], { type: "application/json" }));

        novosPdfs.forEach(pdf => {
            formData.append("arquivos", pdf.file);
        });
        try {

            const updated = await atualizarAtividade(idAtividade, formData, token);

            for (const pdfId of pdfsRemovidos) {
                await deletarPdf(pdfId, token);
            }

            notifySuccess(`Atividade atualizada com sucesso!`);

            if (updated.pdfs?.length) {
                setPdfs(updated.pdfs.map(pdf => ({
                    id: pdf.id,
                    nomeArquivo: pdf.nomeArquivo,
                    url: `http://localhost:8080/pdf/arquivo/${pdf.id}`
                })));
            } else {
                setPdfs([]);
            }

            setNovosPdfs([]);
            setPdfsRemovidos([]);
            handleVoltar();

        } catch (err) {
            notifyError("Erro ao salvar atividade:");
            console.error(err.response.data.message);
        }
    }

    const formatarDataAtualizar = (dataParaFormatar) => {
        if (!dataParaFormatar) return "";

        const data = new Date(dataParaFormatar);

        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();

        return `${ano}-${mes}-${dia}`;
    }

    const notifySuccess = (mensagem) => toast.success(mensagem, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    const notifyError = (mensagem) => toast.error(mensagem, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

     const todosPdfsParaRenderizar = [...pdfsUsuario, ...novosPdfs];

    if (!user || !atividade || !token) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <p>Carregando usuário...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="bg-light py-5 d-flex justify-content-center">
            <Card className="shadow p-4 w-100" style={{ maxWidth: "1100px", borderRadius: "12px" }}>
                <NavBar />

                <Row className="mt-4 g-4">
                    <Col md={8}>
                        <Card className="h-100">
                            <Card.Body>
                                <div className="d-flex justify-content-between flex-wrap">
                                    <Card.Title style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
                                        {atividade.nome}   
                                    </Card.Title>
                                    <p style={{ fontSize: "16px", color: "#555", marginTop: "8px" }}>
                                        <strong>Data de entrega:</strong> {formatarDataExibir(atividade.dataEntrega)}
                                    </p>
                                </div>

                                <hr style={{ border: "1px solid black", margin: "15px 0 25px 0" }} />

                                 <Card.Text style={{ fontSize: "1.1rem", lineHeight: "1.8", height: "225px" }}>
                                    <Container>
                                        <h2>Descrição</h2>
                                        {atividade.descricao}
                                    </Container>
                                </Card.Text>

                                <hr style={{ border: "1px solid black", margin: "15px 0 25px 0" }} />

                                <Form.Group className="mt-4">
                                    <Form.Label style={{ fontSize: "20px", fontWeight: "bold" }}>
                                        Adicionar comentário
                                    </Form.Label>

                                    {comentariosAnteriores.length > 0 && (
                                        <div className="bg-light p-3 mb-3 border rounded" style={{ maxHeight: "150px", overflowY: "auto" }}>

                                            {comentariosAnteriores.map((coment, index) => (
                                                <>
                                                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                                        <span style={{ fontSize: "0.95rem" }}>{coment}</span>
                                                    </div>
                                                </>

                                            ))}

                                        </div>
                                    )}

                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Adicione um comentário"
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                    />

                                    <div className="text-end mt-2">
                                        <Button variant="primary" onClick={() => handleAdicionarComentario()}>Adicionar comentário</Button>
                                    </div>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card style={{ minHeight: "280px" }}>
                            <Card.Body>
                                <Card.Title style={{ fontSize: "1.6rem", fontWeight: "bold" }}>
                                    Seu trabalho
                                </Card.Title>

                                {todosPdfsParaRenderizar.length > 0 && (
                                    <div className="mt-3">
                                        <p><strong>Trabalhos enviados:</strong></p>
                                        {todosPdfsParaRenderizar.map((pdf) => (
                                            <div key={pdf.id ?? pdf.nomeArquivo} className="d-flex align-items-center gap-2 justify-content-between">
                                                <a
                                                    href={pdf.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary text-break"
                                                    style={{ wordBreak: "break-word", display: "block" }}
                                                >
                                                    {pdf.nomeArquivo}
                                                </a>

                                                <Button
                                                    variant="link"
                                                    onClick={() => handleExcluirPdf(pdf)}
                                                    title="Remover arquivo"
                                                    className="ms-2 p-0 text-danger"
                                                    style={{ lineHeight: "1", marginTop: "6px" }}
                                                >
                                                    <CiTrash size={25} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="d-grid gap-3 mt-4">
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => fileInputRef.current.click()}
                                        style={{ fontWeight: "bold", padding: "12px 0", fontSize: "1rem" }}
                                    >
                                        + Adicionar ou criar
                                    </Button>

                                    <Form.Control
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileSelect}
                                        accept=".pdf"
                                        multiple
                                    />

                                    <Button
                                        variant="primary"
                                        style={{ fontWeight: "bold", padding: "12px 0", fontSize: "1rem" }}
                                        onClick={() => salvarAtividade()}
                                    >
                                        Marcar como concluído
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="p-3 mt-3">
                            <Card.Title className="fs-4 fw-bold">Arquivos Recebidos</Card.Title>
                            {pdfsRecebidos.length > 0 ? (
                                <div className="mt-2">
                                    {pdfsRecebidos.map((pdf) => (
                                        <div key={pdf.id} className="d-flex align-items-center gap-2 mt-2">
                                            <Button
                                                variant="link"
                                                className="p-0 text-primary text-break"
                                                style={{ maxWidth: "90%" }}
                                                onClick={() => window.open(pdf.url, "_blank")}
                                            >
                                                {pdf.nomeArquivo}
                                            </Button>

                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">Nenhum arquivo recebido ainda.</p>
                            )}
                        </Card>

                        <div className="text-end mt-3 ">
                            <Button variant="primary" onClick={handleVoltar} >
                                Voltar
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default AdicionarTrabalhoDoTcc;
