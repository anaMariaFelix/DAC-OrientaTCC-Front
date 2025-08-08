import React, { useState, useEffect } from 'react';
import NavBar from '../../componentes/NavBar';
import { Container, Card, ListGroup, Badge, Alert } from 'react-bootstrap';
import { useAppContext } from '../../context/AppContext';
import { buscarAtividadesPorTrabalho } from '../../services/AtividadeService';
import { useLocation, useNavigate } from 'react-router-dom';

const ListaAtividadesAluno = () => {

    const location = useLocation();
    const { tccSelecionado } = location.state;
    const navigate = useNavigate();
    const { user, setUser } = useAppContext();
    const [atividades, setAtividades] = useState([]);

    const buscarAtividadesDoTrabalho = async (id) => {
        try {
            const atividadesEncontradas = await buscarAtividadesPorTrabalho(id);
            console.log(atividadesEncontradas)

            setAtividades(atividadesEncontradas)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (tccSelecionado?.id) {
            buscarAtividadesDoTrabalho(tccSelecionado.id);
        }
    }, []);

    function rotaParaEntrarAtividadeAluno(id) {
        navigate(`/atividadeDoAluno/${id}`, { state: { tccSelecionado: tccSelecionado } });
    }

    if (!user) {
        return (
            <Container className="text-center mt-5">
                <p>Carregando informações...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="bg-light d-flex justify-content-center" style={{ padding: "60px 20px" }}>
            <Card className="shadow p-4 w-100" style={{ maxWidth: "1100px", borderRadius: "12px" }}>
                <NavBar />

                <Container className="my-4" style={{ maxWidth: "700px" }}>
                    <h2 className="mb-4">Atividades</h2>

                    {atividades.length === 0 ? (
                        <Alert variant="info" className="text-center">
                            Nenhuma atividade foi cadastrada ainda. Aguarde o orientador adicionar.
                        </Alert>
                    ) : (
                        <ListGroup>
                            {atividades.map((atividade) => (
                                <ListGroup.Item
                                    key={atividade.id}
                                    action
                                    onClick={() => rotaParaEntrarAtividadeAluno(atividade.id)}
                                    className="d-flex justify-content-between align-items-center flex-wrap"
                                    style={{
                                        borderRadius: "6px",
                                        marginBottom: "12px",
                                        backgroundColor: "#f8f9fa",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e9ecef")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                                >
                                    <div className="flex-grow-1">
                                        <h5 className="mb-1">{atividade.nome}</h5>
                                        <small>
                                            Data de entrega: {new Date(atividade.dataEntrega).toLocaleDateString()}
                                        </small>
                                    </div>

                                    <div className="text-end d-flex flex-column align-items-end">
                                        {!atividade.entregue && (
                                            <Badge bg={
                                                atividade.status === "PENDENTE" ? "secondary" :
                                                    atividade.status === "AVALIADO" ? "success" :
                                                        "danger"
                                            }>
                                                {atividade.status}
                                            </Badge>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Container>
            </Card>
        </Container>
    );
};

export default ListaAtividadesAluno;