import React, { useState, useEffect} from 'react';
import axios from 'axios';
import NavBar from '../../componentes/NavBar';
import { CiTrash } from 'react-icons/ci';
import { Container, Card, Button, ListGroup, Badge } from 'react-bootstrap';

const ListaAtividadesOrientador = () => {
    /*const atividades = [
        {
            id: 1,
            titulo: "Atividade 1: Introdução ao React",
            descricao: "Leia os conceitos básicos e crie seu primeiro componente.",
            dataEntrega: "2025-06-25",
            entregue: false,
        },
    ];*/
    const [atividades, setAtividades] = useState([]);
    const trabalhoId = 1;

     useEffect(() => {
        axios.get(`http://localhost:8080/atividade/atividades/trabalho/${trabalhoId}`)
            .then((res) => {
                setAtividades(res.data);
            })
            .catch((err) => {
                console.error("Erro ao buscar atividades:", err);
            });
    }, []);

    const deletarAtividade = (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta atividade?")) {
            axios.delete(`http://localhost:8080/atividade/deletar/${id}`)
                .then(() => {
                    // Atualiza a lista após deletar
                    setAtividades(atividades.filter((a) => a.id !== id));
                })
                .catch((err) => {
                    console.error("Erro ao deletar atividade:", err);
                });
        }
    };

    function rotaParaEntrarNaAtividadeOrientador(e) {
        e.preventDefault();
        window.location.href = "/atividadeOrientador";
    }

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
                            onClick={rotaParaEntrarNaAtividadeOrientador}
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
                                    onClick={() => window.location.href = `/atividadeOrientador/${atividade.id}`}
                                >
                                    <div className="flex-grow-1">
                                        <h5 className="mb-1">{atividade.nome}</h5>
                                        <small>
                                            Data de entrega: {new Date(atividade.dataEntrega).toLocaleDateString()}
                                        </small>
                                    </div>

                                    <div className="text-end d-flex align-items-end gap-2">
                                        {!atividade.entregue && (
                                            <Badge bg={atividade.status === "PENDENTE" ? "secondary" : "success"}>
                                                {atividade.status}
                                            </Badge>
                                        )}
                                        <CiTrash
                                            size={25}
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={(event) => {
                                                event.stopPropagation(); // <-- ISSO impede abrir a edição
                                                deletarAtividade(atividade.id);
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
