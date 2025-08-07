import React, { useRef, useState, useEffect } from "react";
import NavBar from "../../componentes/NavBar";
import { CiTrash } from "react-icons/ci";
import { criarAtividade, atualizarAtividade, buscarUmaAtividade } from "../../services/AtividadeService";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deletarPdf } from "../../services/PdfService";
import { toast } from 'react-toastify';
import { useAppContext } from "../../context/AppContext";

const AtividadeOrientador = () => {

  const { idAtividade } = useParams();
  const { user } = useAppContext()

  const location = useLocation();
  const { tccSelecionado } = location.state;

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    dataEntrega: "",
    statusPdf: "PENDENTE",
    comentarios: [],
  });

  const [comentariosAnteriores, setComentariosAnteriores] = useState([]);
  const [comentarioAtual, setComentarioAtual] = useState("");

  const [modoEdicao, setModoEdicao] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [novosPdfs, setNovosPdfs] = useState([]);
  const [pdfsRemovidos, setPdfsRemovidos] = useState([]);
  const [pdfsUsuario, setPdfsUsuario] = useState([]); 
  const [pdfsRecebidos, setPdfsRecebidos] = useState([]); 

  useEffect(() => {
    if (idAtividade) {
      fetchAtividade(idAtividade);
    }
  }, [idAtividade]);

  const handleVoltar = () => {
    navigate("/listaAtividadesOrientador", { state: { tccSelecionado: tccSelecionado } });
  };

  const handleAdicionarComentario = () => {
    if (comentarioAtual.trim() === "") return;
    setComentariosAnteriores(prev => [...prev, comentarioAtual.trim()]);
    setComentarioAtual("");
  };

  const handleExcluirComentario = (index) => {
    setComentariosAnteriores(prev => prev.filter((_, i) => i !== index));
  };

  const fetchAtividade = async (id) => {
    try {
      const data = await buscarUmaAtividade(id)
      setForm({
        nome: data.nome || "",
        descricao: data.descricao || "",
        dataEntrega: formatarData(data.dataEntrega) || "",
        statusPdf: data.statusPdf || "PENDENTE",
        comentarios: data.comentarios || [],
      });
      setModoEdicao(true);

      if (data.pdfs?.length) {
        const arquivos = data.pdfs.map(pdf => ({
          id: pdf.id,
          nomeArquivo: pdf.nomeArquivo,
          url: `http://localhost:8080/pdf/arquivo/${pdf.id}`,
          nomeAdicionou: pdf.nomeAdicionou || "",
        }));

        const enviadosPorUsuario = arquivos.filter(pdf => pdf.nomeAdicionou === user.nome);
        const recebidosDeAlunos = arquivos.filter(pdf => pdf.nomeAdicionou !== user.nome);

        setPdfsUsuario(enviadosPorUsuario);
        setPdfsRecebidos(recebidosDeAlunos);
      } else {
        setPdfsUsuario([]);
        setPdfsRecebidos([]);
      }

      if (data.comentarios && Array.isArray(data.comentarios)) {
        setComentariosAnteriores(data.comentarios);
      } else if (data.comentarios) {
        setComentariosAnteriores([data.comentarios]);
      } else {
        setComentariosAnteriores([]);
      }
    } catch (err) {
      console.error("Erro ao buscar atividade:", err);
    }
  };

  const formatarData = (dataParaFormatar) => {
    if (!dataParaFormatar) return "";

    const data = new Date(dataParaFormatar);

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    return `${ano}-${mes}-${dia}`;
  }

  const formatarDataParaLocalDate = (dataCompleta) => {
    if (!dataCompleta) return "";
    return dataCompleta.split(" ")[0];
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (event) => {
    const arquivos = Array.from(event.target.files).map(file => ({
      nomeArquivo: file.name,
      url: URL.createObjectURL(file),
      file: file,
    }));
    setNovosPdfs(prev => [...prev, ...arquivos]);
  };

  const handleExcluirPdf = (pdf) => {
    if (pdf.nomeAdicionou && pdf.nomeAdicionou !== user.nome) return;

    if (pdf.id) {
      setPdfsRemovidos(prev => [...prev, pdf.id]);
      setPdfsUsuario(prev => prev.filter(p => p.nomeArquivo !== pdf.nomeArquivo));
    } else {
      setNovosPdfs(prev => prev.filter(p => p.nomeArquivo !== pdf.nomeArquivo));
    }
  };

  const todosPdfsParaRenderizar = [...pdfsUsuario, ...novosPdfs]; 

  const getStatusTextColor = (status) => {
    switch (status) {
      case "PENDENTE": return "orange";
      case "AVALIADO": return "green";
      case "REJEITADO": return "red";
      default: return "black";
    };
  }

  const handleSalvarAtividade = async () => {
    const atividade = {
      ...form,
      idTrabalho: tccSelecionado.id,
      dataEntrega: formatarDataParaLocalDate(form.dataEntrega),
      comentarios: comentariosAnteriores,
      nomeAdicionouPdfs: user.nome
    };

    const formData = new FormData();
    formData.append("atividade", new Blob([JSON.stringify(atividade)], { type: "application/json" }));

    novosPdfs.forEach(pdf => {
      formData.append("arquivos", pdf.file);
    });

    try {
      if (modoEdicao) {
        await atualizarAtividade(idAtividade, formData, { headers: { tipoUser: "ORIENTADOR" } });
        
        for (const pdfId of pdfsRemovidos) {
          await deletarPdf(pdfId);
        }
      } else {
        await criarAtividade(formData);
      }

      notifySuccess();
      
      if (modoEdicao) {
        const updated = await buscarUmaAtividade(idAtividade);
        if (updated.pdfs?.length) {
          setPdfs(updated.pdfs.map(pdf => ({
            id: pdf.id,
            nomeArquivo: pdf.nomeArquivo,
            url: `http://localhost:8080/pdf/arquivo/${pdf.id}`
          })));
        } else {
          setPdfs([]);
        }
      }
      setNovosPdfs([]);
      setPdfsRemovidos([]);
      handleVoltar();

    } catch (err) {
      notifyError("Erro ao salvar atividade:");
      console.error(err.response.data.message);
    }
  };

  const notifySuccess = () => toast.success(`Atividade ${modoEdicao ? "atualizada" : "salva"} com sucesso!`, {
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

  return (
    <Container fluid className="bg-light py-5 d-flex justify-content-center">
      <Card className="shadow p-4 w-100" style={{ maxWidth: "1100px", borderRadius: "12px" }}>
        <NavBar />
        <Row className="mt-4">
          <Col md={8}>
            <Card className="mb-3 p-3">
              <Form>
                <div className="d-flex justify-content-between flex-wrap">
                  <div>
                    <Form.Control
                      type="text"
                      value={form.nome}
                      onChange={(e) => handleChange("nome", e.target.value)}
                      placeholder="Nome da atividade"
                      style={{ fontSize: "1.2rem", fontWeight: "bold", border: "none" }}
                    />
                    <Form.Label className="fw-bold mt-2">Status:</Form.Label>
                    <Form.Select
                      value={form.statusPdf}
                      onChange={(e) => handleChange("statusPdf", e.target.value)}
                      style={{ maxWidth: "200px", fontWeight: "600", color: getStatusTextColor(form.statusPdf), borderBottom: "1px" }}
                    >
                      <option style={{ color: "orange" }} value="PENDENTE">PENDENTE</option>
                      <option style={{ color: "green" }} value="AVALIADO">AVALIADO</option>
                      <option style={{ color: "red" }} value="REJEITADO">REJEITADO</option>
                    </Form.Select>
                  </div>
                  <div>
                    <Form.Label className="fw-bold">Data de entrega:</Form.Label>
                    <Form.Control
                      type="date"
                      value={form.dataEntrega}
                      onChange={(e) => handleChange("dataEntrega", e.target.value)}
                    />
                  </div>
                </div>
                <hr className="my-4" />
                <Form.Control
                  as="textarea"
                  rows={8}
                  value={form.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                  style={{ fontSize: "1.1rem" }}
                />
                <div className="mt-4">
                  <Form.Label className="fw-bold fs-5">Adicionar comentário</Form.Label>
                  <div className="bg-light p-3 mb-3 border rounded" style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {comentariosAnteriores.length > 0 ? (
                      comentariosAnteriores.map((coment, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>{coment}</span>
                          <CiTrash
                            size={22}
                            color="red"
                            title="Excluir comentário"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleExcluirComentario(index)}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">Nenhum comentário ainda.</p>
                    )}
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Adicione um comentário"
                    value={comentarioAtual}
                    onChange={(e) => setComentarioAtual(e.target.value)}
                  />
                  <div className="text-end mt-2">
                    <Button variant="primary" onClick={handleAdicionarComentario}>
                      Adicionar comentário
                    </Button>
                  </div>
                </div>
              </Form>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-3 mb-3">
              <Card.Title className="fs-4 fw-bold">Submeter Arquivos</Card.Title>


                {todosPdfsParaRenderizar.length > 0 && (
                <div className="mt-3">
                  <strong>Arquivos:</strong>
                  {todosPdfsParaRenderizar.map((pdf) => (
                    <div key={pdf.id ?? pdf.nomeArquivo} className="d-flex align-items-center gap-2 mt-2 justify-content-between">
                      <Button
                        variant="link"
                        className="p-0 text-primary text-break"
                        style={{ maxWidth: "90%" }}
                        onClick={() => window.open(pdf.url ?? URL.createObjectURL(pdf.file), "_blank")}
                      >
                        {pdf.nomeArquivo}
                      </Button>
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={() => handleExcluirPdf(pdf)}
                      >
                        <CiTrash size={22} title="Excluir PDF" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}


              <div className="d-grid gap-2 mt-4">
                <Button variant="outline-primary" onClick={() => fileInputRef.current.click()}>
                  + Adicionar ou criar
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                  accept=".pdf"
                   multiple
                />
              </div>
            </Card>
            <Card className="p-3">
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
            <div className="text-end mt-3 d-flex justify-content-between">
              <Button variant="secondary" onClick={handleVoltar}>
                Voltar
              </Button>

              <Button onClick={handleSalvarAtividade}>
                Salvar Atividade
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default AtividadeOrientador;