import React, { useRef, useState, useEffect } from "react";
import NavBar from "../../componentes/NavBar";
import { CiTrash } from "react-icons/ci";
import axios from "axios";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

const AtividadeOrientador = () => {
  const { id } = useParams();
  const tipoUser = "ORIENTADOR";

  const comentariosAnteriores = [
    "Muito bom, ficou claro! ",
    "Adicione mais detalhes na descrição.",
  ];

  const [nomeAtividade, setNomeAtividade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [status, setStatus] = useState("PENDENTE");
  const [comentario, setComentario] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idAtividade, setIdAtividade] = useState(null);

  const [pdfs, setPdfs] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/atividade/listar/${id}`)
        .then((res) => {
          const data = res.data;
          setNomeAtividade(data.nome || "");
          setDescricao(data.descricao || "");
          setDataEntrega(data.dataEntrega ? data.dataEntrega.substring(0, 16) : "");
          setStatus(data.statusPdf || "PENDENTE");
          setIdAtividade(data.id);
          setModoEdicao(true);

          if (data.pdfs && data.pdfs.length > 0) {
              const listaPdfs = data.pdfs.map((pdf) => ({
                id: pdf.id,
                nomeArquivo: pdf.nomeArquivo,
                url: `http://localhost:8080/pdf/arquivo/${pdf.id}`
              }));
            setPdfs(listaPdfs);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const novosPdfs = Array.from(files).map((file) => ({
        nomeArquivo: file.name,
        url: URL.createObjectURL(file),
        file: file
      }));
      setPdfs((prev) => [...prev, ...novosPdfs]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleCancel = () => {
    setFileName(null);
    setFileURL(null);
    fileInputRef.current.value = null;
  };

  const getStatusTextColor = (status) => {
    if (status === "PENDENTE") return "orange";
    if (status === "AVALIADO") return "green";
    if (status === "REJEITADO") return "black";
    return "black";
  };

  const handleAbrirPdf = () => {
    if (fileURL) {
      window.open(fileURL, "_blank");
    }
  };

  const handleSalvarAtividade = async () => {
    const atividade = {
      nome: nomeAtividade,
      descricao: descricao,
      dataEntrega: dataEntrega,
      statusPdf: status,
      comentarios: comentario,
      trabalhoAcademico: { id: 1 },
      pdfs: [],
    };

    const formData = new FormData();
    formData.append(
      "atividade",
      new Blob([JSON.stringify(atividade)], { type: "application/json" })
    );

    if (fileInputRef.current.files.length > 0) {
      formData.append("arquivos", fileInputRef.current.files[0]);
    }

    try {
      let response;
      if (id) {
        response = await axios.put(
          `http://localhost:8080/atividade/editar/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              tipoUser: tipoUser,
            },
          }
        );
        alert("Atividade atualizada com sucesso!");
      } else {
        response = await axios.post(
          "http://localhost:8080/atividade/salvarAtividade",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              tipoUser: tipoUser,
            },
          }
        );
        alert("Atividade salva com sucesso!");
      }
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao salvar:", error.response || error.message || error);
      alert("Erro ao salvar a atividade.");
    }
  };

  const handleExcluirPdf = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este PDF?")) {
      axios.delete(`http://localhost:8080/pdf/${id}`)
        .then(() => {
          setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
        })
        .catch((err) => {
          console.error("Erro ao excluir PDF:", err);
        });
    }
  };

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
                      value={nomeAtividade}
                      onChange={(e) => setNomeAtividade(e.target.value)}
                      placeholder="Nome da atividade"
                      style={{ fontSize: "1.2rem", fontWeight: "bold", border: "none" }}
                    />
                    <Form.Label className="fw-bold mt-2">Status:</Form.Label>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{ maxWidth: "200px", fontWeight: "600", color: getStatusTextColor(status) }}
                    >
                      <option style={{color: "orange"}} value="PENDENTE">PENDENTE</option>
                      <option style={{color: "green"}} value="AVALIADO">AVALIADO</option>
                      <option style={{color: "red"}} value="REJEITADO">REJEITADO</option>
                    </Form.Select>
                  </div>
                  <div>
                    <Form.Label className="fw-bold">Data de entrega:</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={dataEntrega}
                      onChange={(e) => setDataEntrega(e.target.value)}
                    />
                  </div>
                </div>
                <hr className="my-4" />
                <Form.Control
                  as="textarea"
                  rows={8}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  style={{ fontSize: "1.1rem" }}
                />
                <div className="mt-4">
                  <Form.Label className="fw-bold fs-5">Adicionar comentário</Form.Label>
                  <div className="bg-light p-3 mb-3 border rounded" style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {comentariosAnteriores.length > 0 ? (
                      comentariosAnteriores.map((coment, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ fontSize: "0.95rem" }}>{coment}</span>
                          <CiTrash size={22} color="red" title="Excluir comentário" style={{ cursor: "pointer" }} />
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
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                  />
                  <div className="text-end mt-2">
                    <Button variant="primary">Adicionar comentário</Button>
                  </div>
                </div>
              </Form>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-3 mb-3">
              <Card.Title className="fs-4 fw-bold">Submeter Arquivos</Card.Title>


                {pdfs.length > 0 && (
                      <div className="mt-3">
                        <strong>Arquivos:</strong>
                        {pdfs.map((pdf) => (
                          <div key={pdf.id} className="d-flex align-items-center gap-2 mt-2">
                            <Button
                              variant="link"
                              className="p-0 text-primary text-break"
                              style={{ maxWidth: "90%" }}
                              onClick={() => window.open(pdf.url, "_blank")}
                            >
                              {pdf.nomeArquivo}
                            </Button>
                            
                            <Button
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => handleExcluirPdf(pdf.id)}
                            >
                              <CiTrash size={22} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}


              <div className="d-grid gap-2 mt-4">
                <Button variant="outline-primary" onClick={handleButtonClick}>
                  + Adicionar ou criar
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                  accept=".pdf"
                />
                <Button variant="primary" onClick={() => setStatus("Concluído")}>
                  Marcar como concluído
                </Button>
              </div>
            </Card>
            <Card className="p-3">
              <Card.Title className="fs-4 fw-bold">Arquivos Recebidos</Card.Title>
              <p className="text-muted">Nenhum arquivo recebido ainda.</p>
            </Card>
            <div className="text-end mt-3">
              <Button
                style={{ backgroundColor: "#4a90e2", border: "none" }}
                onClick={handleSalvarAtividade}
              >
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