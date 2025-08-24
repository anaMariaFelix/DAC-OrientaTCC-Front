import React, { useEffect, useState } from 'react';
import NavBar from '../../componentes/NavBar';
import { Button, Modal, Container, Card, Form } from 'react-bootstrap';
import { useAppContext } from '../../context/AppContext';
import { buscarTrabalhoAcademicoPorSiapeOrientador } from '../../services/TrabalhoAcademicoService';
import { useNavigate } from 'react-router-dom';

const PrincipalDoOrientador = () => {

    const { user, token } = useAppContext();
    const [tccs, setTccs] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState('');
    const navigate = useNavigate();


    const rotaParaEntrarNaAtividadeOrientador = (tcc) => {
        console.log("opa 01")
        navigate("/listaAtividadesOrientador", { state: { tccSelecionado: tcc } });
    };

    const buscarTCCsDoOrientador = async () => {
        try {
            console.log("opa 02")
            const lista = await buscarTrabalhoAcademicoPorSiapeOrientador(user.siape, token);
            if (Array.isArray(lista)) {
                setTccs(lista);
            }
        } catch (error) {
            console.error("Erro ao buscar trabalhos do orientador:", error.message);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (user?.siape) {
            buscarTCCsDoOrientador();
        }
    }, [user]);

    if (carregando) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <p>Carregando trabalhos...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="bg-light d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card className="shadow p-4" style={{ maxWidth: '1000px', width: '100%' }}>
                <NavBar />

                {tccs.length > 0 ? (
                    <>
                        <h2 className="text-center mb-4">Trabalhos de Conclusão de Curso</h2>

                        <Form.Group className="mb-3 w-50 mx-auto">
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome do trabalho ou do aluno"
                                onChange={(e) => setFiltro(e.target.value)} />
                        </Form.Group>

                        <div className="d-flex flex-wrap gap-3 justify-content-center" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                            {tccs
                                .filter((trabalho) =>
                                    trabalho.nome.toLowerCase().includes(filtro) ||
                                    trabalho.nomeAluno.toLowerCase().includes(filtro))
                                .map((tcc) => (
                                    <Card key={tcc.id} className="shadow-sm" style={{
                                        backgroundColor: "#e6f4ff",
                                        borderRadius: "10px",
                                        padding: "15px",
                                        width: "220px",
                                        height: "200px"
                                    }}>
                                        <Card.Title style={{
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                            wordBreak: "break-word", 
                                            whiteSpace: "normal" 
                                        }}>
                                            {tcc.nome}
                                        </Card.Title>
                                        <Card.Text style={{ marginBottom: "5px" }}><strong>Aluno:</strong> {tcc.nomeAluno}</Card.Text>
                                        <Card.Text style={{ marginBottom: "5px" }}><strong>Data:</strong> {tcc.dataInicio}</Card.Text>
                                        <Card.Text style={{ marginBottom: "5px" }}><strong>Status:</strong> {tcc.status}</Card.Text>
                                        <div className="d-flex gap-2 mt-auto justify-content-end">
                                            <Button variant="primary" size="sm" onClick={() => rotaParaEntrarNaAtividadeOrientador(tcc)}>Acessar</Button>
                                        </div>
                                    </Card>
                                ))}
                        </div>

                    </>
                ) : (
                    <div className="text-center py-5">
                        <h2>Trabalhos de Conclusão de Curso</h2>
                        <p style={{ fontSize: "20px" }}>Você ainda não orienta nenhum trabalho de conclusão de curso.</p>
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default PrincipalDoOrientador;
