import React, { useEffect, useState } from 'react';
import NavBar from '../../componentes/NavBar';
import { CiTrash } from 'react-icons/ci';
import { Container, Card, Form, Button, ListGroup, Alert, Row, Col } from 'react-bootstrap';
import { useAppContext } from '../../context/AppContext';
import { buscarTodosOrientadores, deletarOrientadorPorEmail } from '../../services/OrientadorService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


const GerenciarOrientador = () => {

    const { user } = useAppContext();
    const navigate = useNavigate();

    const [listaOrientadores, setListaOrientadores] = useState([]);
    const [filtro, setFiltro] = useState('');

    const buscarOrientadores = async () => {
        try {
            const lista = await buscarTodosOrientadores();
            setListaOrientadores(lista);
        } catch (error) {
            return
        }

    }

    const deletarOrientador = async (orientador) => {
        try {
            await deletarOrientadorPorEmail(orientador.email);
            notifySuccess();
            if (orientador.email === user.email) {
                localStorage.removeItem("usuario");
                navigate("/login");
            }
            buscarOrientadores();

        } catch (error) {
            notifyError(error.response.data.message);
        }
    }


    useEffect(() => {
        buscarOrientadores();
    }, [])

    const notifySuccess = () => toast.success('O Orientador foi deletado com sucesso!', {
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
        <Container
            fluid
            className="bg-light d-flex justify-content-center align-items-center min-vh-100"
        >
            <Card className="shadow p-4 w-100" style={{ maxWidth: '1000px', height: '550px', display: 'flex', flexDirection: 'column' }}>
                <NavBar />

                <div className="my-4" style={{ maxWidth: '700px', margin: '0 auto', flexGrow: 1 }}>
                    <h3 className="mb-4">Orientadores Cadastrados</h3>

                    <Row className="mb-4 g-2" style={{ width: "750px" }}>
                        <Col xs={10} md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome do orientador"
                                onChange={(e) => setFiltro(e.target.value)}
                            />
                        </Col>

                        <Col xs={12} md={3}>
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
                                Adicionar Orientador
                            </Button>
                        </Col>
                    </Row>

                    {listaOrientadores === 0 ? (
                        <Alert
                            variant="info"
                            className="text-center"
                            style={{
                                padding: "20px",
                                borderRadius: "8px",
                                backgroundColor: "#e9f5ff",
                                color: "#31708f",
                                border: "1px solid #bce8f1",
                            }}
                        >
                            Nenhum Orientador foi cadastrado ainda.
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
                                {listaOrientadores
                                    .filter((professor) =>
                                        professor.nome.toLowerCase().includes(filtro.toLowerCase())
                                    )
                                    .map((professor) => (
                                        <ListGroup.Item
                                            className="d-flex justify-content-between align-items-center flex-wrap"
                                            style={{
                                                backgroundColor: "#f8f9fa",
                                                marginBottom: "12px",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                transition: "background-color 0.3s",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e9ecef")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                                            onClick={() => navigate("/coordenadorEditaOrientador", { state: { professor } })}
                                        >
                                             <div className="flex-grow-1">
                                                <h5 className="mb-1">{professor.nome}</h5>
                                                <small>SIAPE: {professor.siape}</small>
                                            </div>
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        {professor.siape === user.siape
                                                            ? "Ao remover você mesmo, será direcionado para a tela de login (sem cadastro)."
                                                            : "Ao remover um orientador, ele será excluído do sistema."}
                                                    </Tooltip>
                                                }
                                            >
                                                <div style={{ display: "inline-block" }}>
                                                    <CiTrash
                                                        size={23}
                                                        style={{ color: "red", cursor: "pointer" }}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            deletarOrientador(professor);
                                                        }}
                                                    />
                                                </div>
                                            </OverlayTrigger>
                                        </ListGroup.Item>
                                    ))}
                            </ListGroup>
                        </div>
                    )}
                </div>
            </Card >
        </Container >
    );
};

export default GerenciarOrientador;
