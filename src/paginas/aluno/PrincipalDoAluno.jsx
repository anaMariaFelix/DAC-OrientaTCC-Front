import React, { useEffect, useState } from "react";
import NavBar from "../../componentes/NavBar";
import { Button, Modal, Card, Container, Row, Col } from "react-bootstrap";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { buscarTrabalhoAcademicoPorMatriculaAluno, deletarTrabalhoAcademico } from "../../services/TrabalhoAcademicoService";
import { toast } from "react-toastify";

const PrincipalDoAluno = () => {

    const { user, setUser } = useAppContext();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [trabalhoAcademico, setTrabalhoAcademico] = useState({});
    const [carregandoUsuario, setCarregandoUsuario] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    
    const confirmarExclusao = async (trabalhoid) => {
        try {
            await deletarTrabalhoAcademico(trabalhoid)
            notifySuccess();
            handleClose();
            setTrabalhoAcademico({});

        } catch (error) {
            notifyError();
        }

    };

    const notifySuccess = () => toast.success('O trabalho foi deletado com sucesso!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    const notifyError = () => toast.error('O trabalho não pode ser deletado', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    const rotaParaCadastrarTCC = (e) => {
        e.preventDefault();
        navigate("/cadastroTCC");
    };

    const rotaParaEntrarNoTCC = (e) => {
        e.preventDefault();
        navigate("/listaAtividadesAluno", { state: { tccSelecionado: trabalhoAcademico } });
    };

    const buscarTrabalhoAluno = async () => {
        try {
            const trabalho = await buscarTrabalhoAcademicoPorMatriculaAluno(user.matricula);

            if (!trabalho || Object.keys(trabalho).length === 0) {
                return;
            }

            setTrabalhoAcademico(trabalho);

        } catch (error) {
            console.error("Erro ao buscar trabalho acadêmico do aluno:", error.message);
        }
    }

    useEffect(() => {
        console.log(user)
        if (user?.matricula) {
            buscarTrabalhoAluno();
        }
    }, [user]);

    useEffect(() => {
        const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));
        if (usuarioSalvo) {
            setUser(usuarioSalvo);
            buscarTrabalhoAcademicoPorMatriculaAluno(usuarioSalvo.matricula)
                .then(trabalho => {
                    if (trabalho && Object.keys(trabalho).length > 0) {
                        setTrabalhoAcademico(trabalho);
                        console.log(trabalho)
                    }
                })
                .catch(error => {
                    console.error("Erro ao buscar trabalho acadêmico do aluno:", error.message);
                });
        }
        setCarregandoUsuario(false);
    }, []);

    if (carregandoUsuario) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <p>Carregando usuário...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Card className="shadow p-4 w-100" style={{ maxWidth: "1000px", minHeight: "550px" }}>
                <NavBar />

                {trabalhoAcademico.nome ? (
                    <div>
                        <h3 className="text-center mb-4 mt-4">Meu trabalho Acadêmico</h3>

                        <Card className="mx-auto shadow-sm" style={{ backgroundColor: "#e6f4ff", maxWidth: "500px", border: "1px solid #cce6ff", borderRadius: "12px", padding: "20px" }}>
                            <Card.Body>
                                <Card.Title className="mb-3" style={{ fontWeight: "600", color: "#333" }}>
                                    {trabalhoAcademico.nome}
                                </Card.Title>

                                <Card.Text className="mb-2">
                                    <strong>Orientador:</strong> {trabalhoAcademico.nomeOrientador}
                                </Card.Text>
                                <Card.Text className="mb-4">
                                    <strong>Data de criação:</strong> {trabalhoAcademico.dataInicio}
                                </Card.Text>
                                <Card.Text className="mb-2">
                                    <strong>Status:</strong> {trabalhoAcademico.status}
                                </Card.Text>

                                <Row className="mt-4">
                                    <Col>
                                        <Button
                                            variant="danger"
                                            className="w-100"
                                            onClick={handleShow}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = "#c0392b";
                                                e.target.style.boxShadow = "0 6px 14px rgba(192, 57, 43, 0.6)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = "#dc3545";
                                                e.target.style.boxShadow = "0 4px 10px rgba(220, 53, 69, 0.4)";
                                            }}
                                            style={{
                                                fontWeight: "600",
                                                boxShadow: "0 4px 10px rgba(220, 53, 69, 0.4)",
                                                transition: "background-color 0.3s ease, box-shadow 0.3s ease"
                                            }}
                                        >
                                            Excluir
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            variant="primary"
                                            className="w-100"
                                            onClick={rotaParaEntrarNoTCC}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = "#357ABD";
                                                e.target.style.boxShadow = "0 6px 14px rgba(53,122,189,0.6)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = "#0d6efd";
                                                e.target.style.boxShadow = "0 4px 10px rgba(13,110,253,0.4)";
                                            }}
                                            style={{
                                                fontWeight: "600",
                                                boxShadow: "0 4px 10px rgba(13,110,253,0.4)",
                                                transition: "background-color 0.3s ease, box-shadow 0.3s ease"
                                            }}
                                        >
                                            Acessar
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirmação</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{trabalhoAcademico.status === "EM_ANDAMENTO" ? "Seu trabalho está em andamento" : ''}</Modal.Body>
                            <Modal.Body>Tem certeza que deseja excluir?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancelar
                                </Button>
                                <Button variant="danger" onClick={() => confirmarExclusao(trabalhoAcademico.id)}>
                                    Confirmar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                ) : (
                    <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                        <h1 className="text-center mb-4">Bem-vindo(a), {user.nome}</h1>
                        <p className="text-center" style={{ fontSize: "25px" }}>
                            Cadastre seu trabalho de conclusão de curso
                        </p>
                        <Button variant="primary" size="lg" className="mt-4" onClick={rotaParaCadastrarTCC} style={{ width: "300px" }}>
                            Cadastrar
                        </Button>
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default PrincipalDoAluno;
