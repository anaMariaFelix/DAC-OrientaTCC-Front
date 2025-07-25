import React, { useRef, useState } from "react";
import NavBar from "../../componentes/NavBar";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { CiTrash } from "react-icons/ci";

const AdicionarTrabalhoDoTcc = () => {
    const [fileName, setFileName] = useState("");
    const [fileURL, setFileURL] = useState("");
    const [comentario, setComentario] = useState("");

    const comentariosAnteriores = [
        "Andrey é lindo",
        "Andrey é lindo",
        "Andrey é lindo",

    ];

    const fileInputRef = useRef(null);

    function handleFileSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            setFileName(files[0].name);
            setFileURL(URL.createObjectURL(files[0]));
        }
    }

    function handleButtonClick() {
        fileInputRef.current.click();
    }

    function handleCancel() {
        setFileName(null);
        setFileURL(null);
        fileInputRef.current.value = null;
    }

    return (
        <Container fluid className="bg-light py-5 d-flex justify-content-center">
            <Card className="shadow p-4 w-100" style={{ maxWidth: "1100px", borderRadius: "12px" }}>
                <NavBar />

                <Row className="mt-4 g-4">
                    {/* CARD GRANDE */}
                    <Col md={8}>
                        <Card className="h-100">
                            <Card.Body>
                                <div className="d-flex justify-content-between flex-wrap">
                                    <Card.Title style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
                                        Nome da atividade
                                    </Card.Title>
                                    <p style={{ fontSize: "16px", fontWeight: "bold", color: "#555", marginTop: "8px" }}>
                                        Data de entrega: 23:59
                                    </p>
                                </div>

                                <hr style={{ border: "1px solid black", margin: "15px 0 25px 0" }} />

                                <Card.Text style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                                    <strong>COMO FAZER?</strong> Componham equipes considerando os softwares
                                    definidos nas disciplinas de Projeto I e Projeto II, que possuam features
                                    (mesmo que em parte) funcionais e viáveis para avaliação de usabilidade.
                                    <br />
                                    Faça a imersão no produto considerando features a serem categorizadas com a
                                    técnica de <strong>CARD SORTING</strong>. Em seguida, descreva jornadas do
                                    usuário com a técnica de <strong>JOURNEY MAP</strong>, a fim de revelar
                                    armadilhas e momentos importantes do usuário na interação ou experiência com
                                    o produto.
                                </Card.Text>

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
                                                    <hr style={{ border: "1px solid black", margin: "0 0 20px 0" }} />
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
                                        <Button variant="primary">Adicionar comentário</Button>
                                    </div>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* CARD PEQUENO */}
                    <Col md={4}>
                        <Card style={{ minHeight: "280px" }}>
                            <Card.Body>
                                <Card.Title style={{ fontSize: "1.6rem", fontWeight: "bold" }}>
                                    Seu trabalho
                                </Card.Title>

                                {/* Exibição do arquivo */}
                                {fileName && (
                                    <div className="mt-3 d-flex align-items-start">
                                        <div>
                                            <p>
                                                <strong>Arquivo selecionado:</strong>
                                            </p>

                                            <div className="d-flex">
                                                <a
                                                    href={fileURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: "#0d6efd",
                                                        textDecoration: "underline",
                                                        wordBreak: "break-word",
                                                        display: "block",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    {fileName}
                                                </a>

                                                <Button
                                                    variant="link"
                                                    onClick={handleCancel}
                                                    title="Remover arquivo"
                                                    className="ms-2 p-0 text-danger"
                                                    style={{ lineHeight: "1", marginTop: "6px" }}
                                                >
                                                    <CiTrash size={25} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botões */}
                                <div className="d-grid gap-3 mt-4">
                                    <Button
                                        variant="outline-primary"
                                        onClick={handleButtonClick}
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
                                    />

                                    <Button
                                        variant="primary"
                                        style={{ fontWeight: "bold", padding: "12px 0", fontSize: "1rem" }}
                                    >
                                        Marcar como concluído
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default AdicionarTrabalhoDoTcc;
