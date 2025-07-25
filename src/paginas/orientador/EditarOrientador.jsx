import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { atualizarOrientador } from '../../services/OrientadorService';

const EditarOrientador = () => {
    const { user, setUser } = useAppContext();
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [areaAtuacao, setAreaAtuacao] = useState('');
    const [carregandoUsuario, setCarregandoUsuario] = useState(true);

    const [botaoDesabilitado, setBotaoDesabilitado] = useState(true);

    useEffect(() => {
        const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));
        if (usuarioSalvo) {
            setUser(usuarioSalvo);
        }
        setCarregandoUsuario(false);
    }, []);

    useEffect(() => {
        if (user) {
            setNome(user.nome);
            setSenha('');
            setAreaAtuacao(user.areaAtuacao || '');
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const nomeAlterado = nome !== user.nome;
        const senhaAlterada = senha.length > 0;
        const areaAtuacaoAlterada = areaAtuacao !== (user.areaAtuacao || '');

        setBotaoDesabilitado(!(nomeAlterado || senhaAlterada || areaAtuacaoAlterada));
    }, [nome, senha, areaAtuacao, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuarioAtualizado = {
            ...user,
            nome,
            areaAtuacao,
            ...(senha ? { senha } : {})
        };

        try {
            const usuarioSalvo = await atualizarOrientador(usuarioAtualizado);
            
            setUser(usuarioSalvo);
            localStorage.setItem("usuario", JSON.stringify(usuarioSalvo));
            notifySuccess();

        } catch (error) {
            console.error("Erro ao atualizar orientador:", error);
            toast.error("Erro ao salvar os dados. Tente novamente.");
        }
    };

    const notifySuccess = () => toast.success('O orientador foi editado com sucesso!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    if (carregandoUsuario) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </Spinner>
            </Container>
        );
    }

    if (!user) return null;

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Card className="shadow p-4" style={{ width: "100%", maxWidth: "500px" }}>
                <h3 className="text-center mb-4">Formulário de Edição</h3>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="siape">
                        <Form.Label>SIAPE</Form.Label>
                        <Form.Control type="text" value={user.siape} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={user.email} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="nome">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite seu nome"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="areaAtuacao">
                        <Form.Label>Área de Atuação</Form.Label>
                        <Form.Control
                            type="text"
                            value={areaAtuacao}
                            onChange={(e) => setAreaAtuacao(e.target.value)}
                            placeholder="Digite sua área de atuação"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="senha">
                        <Form.Label>Senha</Form.Label>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip id="tooltip-senha">
                                    Se informar uma nova senha, ela será atualizada. Caso contrário, a senha atual será mantida.
                                </Tooltip>
                            }
                        >
                            <Form.Control
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite nova senha (opcional)"
                                minLength={6}
                            />
                        </OverlayTrigger>
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" className="w-25" onClick={() => navigate("/principalDoOrientador")}>
                            Voltar
                        </Button>
                        <Button type="submit" variant="primary" className="w-25" disabled={botaoDesabilitado}>
                            Salvar
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default EditarOrientador;
