import React, { useEffect, useState } from 'react';
import NavBar from '../../componentes/NavBar';
import { CiTrash } from 'react-icons/ci';
import { Container, Card, Form, Button, ListGroup, Alert, Row, Col } from 'react-bootstrap';
import { buscarTodosAlunos, deletarAlunoPorEmail } from '../../services/AlunoService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const GerenciarAluno = () => {

    const navigate = useNavigate();

    const [listaAlunos, setListaAlunos] = useState([]);
    const [filtro, setFiltro] = useState('');

    const buscarAlunos = async () => {
        try {
            const lista = await buscarTodosAlunos();
            setListaAlunos(lista);
        } catch (error) {
            return
        }

    }

    useEffect(() => {
        buscarAlunos();
    }, [])

    const deletarAluno = async (aluno) => {
        try {
            await deletarAlunoPorEmail(aluno.email);
            notifySuccess();

            buscarAlunos();
        } catch (error) {
            notifyError();
        }
    }

    const notifySuccess = () => toast.success('O Aluno foi deletado com sucesso!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    const notifyError = () => toast.error('Ocorreu um erro ao deletar o aluno!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    return (
        <Container fluid className="bg-light d-flex justify-content-center align-items-center min-vh-100">
            <Card className="shadow p-4 w-100" style={{ maxWidth: '1000px' }}>
                <NavBar />

                <div className="my-4 mx-auto" style={{ width: "700px" }}>
                    <h3 className="mb-4">Alunos Cadastrados</h3>

                    <Row className="align-items-end mb-4">
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome do aluno"
                                onChange={(e) => setFiltro(e.target.value)}
                            />
                        </Col>

                        <Col md={3} className="mt-3 mt-md-0">
                            <Button
                                onClick={() => navigate("/cadastro")}
                                className="w-100"
                                style={{
                                    fontSize: "16px",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    boxShadow: "0 4px 10px rgba(74,144,226,0.4)",
                                    backgroundColor: "#4a90e2",
                                    border: "none",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = "#357ABD";
                                    e.currentTarget.style.boxShadow = "0 6px 14px rgba(53,122,189,0.6)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = "#4a90e2";
                                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(74,144,226,0.4)";
                                }}
                            >
                                Adicionar Aluno
                            </Button>
                        </Col>
                    </Row>

                    {listaAlunos.length === 0 ? (
                        <Alert
                            variant="info"
                            className="text-center"
                            style={{
                                padding: '20px',
                                borderRadius: '8px',
                                backgroundColor: '#e9f5ff',
                                color: '#31708f',
                                border: '1px solid #bce8f1',
                            }}
                        >
                            Nenhum aluno foi cadastrado ainda.
                        </Alert>
                    ) : (
                        <div
                            style={{
                                maxHeight: "250px", 
                                overflowY: "auto",
                                paddingRight: "10px",
                            }}
                        >
                            <ListGroup>
                                {listaAlunos
                                    .filter((aluno) =>
                                        aluno.nome.toLowerCase().includes(filtro.toLowerCase())
                                    )
                                    .map((aluno) => (
                                        <ListGroup.Item
                                            key={aluno.matricula}
                                            className="d-flex justify-content-between align-items-center"
                                            style={{
                                                backgroundColor: '#f8f9fa',
                                                marginBottom: '12px',
                                                borderRadius: '6px',
                                                transition: 'background-color 0.3s',
                                            }}
                                        >
                                            <div>
                                                <h5 className="mb-1">{aluno.nome}</h5>
                                                <small>Matrícula: {aluno.matricula}</small>
                                            </div>
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Ao remover um orientador, ele será excluído do sistema
                                                    </Tooltip>
                                                }
                                            >
                                                <div style={{ display: "inline-block" }}>
                                                    <CiTrash
                                                        size={23}
                                                        style={{ color: "red", cursor: "pointer" }}
                                                        onClick={() => deletarAluno(aluno)}
                                                    />
                                                </div>
                                            </OverlayTrigger>
                                        </ListGroup.Item>
                                    ))}
                            </ListGroup>
                        </div>
                    )}
                </div>
            </Card>
        </Container>
    );
};

export default GerenciarAluno;
