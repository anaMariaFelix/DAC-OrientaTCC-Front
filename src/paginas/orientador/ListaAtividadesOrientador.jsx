import React, { useState, useEffect } from 'react';
import NavBar from '../../componentes/NavBar';
import { CiTrash } from 'react-icons/ci';
import { Container, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { buscarAtividadesPorTrabalho } from '../../services/AtividadeService';
import { toast } from 'react-toastify';
import { deletarAtividade } from '../../services/AtividadeService';

const ListaAtividadesOrientador = () => {
    const location = useLocation();
    const { tccSelecionado } = location.state;

    const navigate = useNavigate();
    const [atividades, setAtividades] = useState([]);
    const trabalhoId = 1;

     const buscarAtividadesDoTrabalho = async (id) => {
        try {
            const atividadesEncontradas = await buscarAtividadesPorTrabalho(id);
            setAtividades(atividadesEncontradas)
        } catch (error) {
            console.log("Erro ao buscar atividades", error.message)
        }
    }

    useEffect(() => {
        if (tccSelecionado?.id) {
            buscarAtividadesDoTrabalho(tccSelecionado.id)
        } 
    }, []);

     const deletarAtividadeExistente = async (id) => {
        try {
            await deletarAtividade(id);

            notifySuccess();
            setAtividades(atividades.filter(atividade => atividade.id !== id));
        } catch (error) {
            console.log(error.response);
            notifyError("Não foi possivel deletar a atividade");
        }
    }
    function rotaParaAdicioanrAtividadeOrientador() {
        navigate(`/atividadeOrientador`, { state: { tccSelecionado: tccSelecionado } });
    }

    function rotaParaEntrarNaAtividadeOrientador(id) {
        navigate(`/atividadeOrientador/${id}`, { state: { tccSelecionado: tccSelecionado } });
    }

    const notifySuccess = () => toast.success(`Atividade deletada com sucesso!`, {
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
        <Container fluid className="d-flex justify-content-center bg-light" style={{ padding: "60px 20px" }}>
            <Card
                className="shadow p-4 w-100"
                style={{ maxWidth: "1100px", borderRadius: "12px" }}
            >
                <NavBar />

                <div className="my-4" style={{ width: "700px", margin: "0 auto" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Atividades</h2>
                        <Button
                             onClick={rotaParaAdicioanrAtividadeOrientador}
                            style={{
                                padding: "10px 20px",
                                fontSize: "14px",
                                borderRadius: "8px",
                                backgroundColor: "#4a90e2",
                                border: "none",
                                fontWeight: 600,
                                boxShadow: "0 4px 10px rgba(74,144,226,0.4)",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3a78c2")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4a90e2")}
                        >
                            Adicionar Atividade
                        </Button>
                    </div>

                    {atividades.length === 0 ? (
                        <Card
                            className="text-center"
                            style={{
                                backgroundColor: "#e9f5ff",
                                border: "1px solid #bce8f1",
                                padding: "20px",
                                borderRadius: "8px",
                                color: "#31708f",
                            }}
                        >
                            Nenhuma atividade foi cadastrada ainda.
                        </Card>
                    ) : (
                        <ListGroup className="mt-3">
                            {atividades.map((atividade) => (
                                <ListGroup.Item
                                    key={atividade.id}
                                    className="d-flex justify-content-between align-items-center flex-wrap"
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: "6px",
                                        marginBottom: "12px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e9ecef")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                                    onClick={() => rotaParaEntrarNaAtividadeOrientador(atividade.id)}
                                >
                                    <div className="flex-grow-1">
                                        <h5 className="mb-1">{atividade.nome}</h5>
                                        <small>
                                            Data de entrega: {new Date(atividade.dataEntrega).toLocaleDateString()}
                                        </small>
                                    </div>

                                    <div className="text-end d-flex align-items-end gap-2">
                                        {!atividade.entregue && (
                                            <Badge bg={
                                                atividade.status === "PENDENTE" ? "secondary" :
                                                    atividade.status === "AVALIADO" ? "success" :
                                                        "danger"
                                            }>
                                                {atividade.status}
                                            </Badge>
                                        )}
                                        <CiTrash
                                            size={25}
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                deletarAtividadeExistente(atividade.id);
                                            }}
                                        />
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>
            </Card>
        </Container>
    );
};

export default ListaAtividadesOrientador;
