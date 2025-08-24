import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useAppContext } from '../../context/AppContext';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { atualizarAluno } from '../../services/AlunoService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditarAluno = () => {
    const { user, setUser, token } = useAppContext();
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [botaoDesabilitado, setBotaoDesabilitado] = useState(true);


    useEffect(() => {
        if (user && token) {
            setNome(user.nome);
            setSenha('');
        }
    }, [user, token]);

    useEffect(() => {
        if (!user) return;

        const nomeAlterado = nome !== user.nome;
        const senhaAlterada = senha.length > 0;

        setBotaoDesabilitado(!(nomeAlterado || senhaAlterada));
    }, [nome, senha, user]);


    if (!user && !token) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </Spinner>
            </Container>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuarioAtualizado = {
            ...user,
            nome,
            ...(senha ? { senha } : {}) 
        };

        try {
            const usuarioSalvo = await atualizarAluno(usuarioAtualizado, token);

            setUser(usuarioSalvo);
            localStorage.setItem("usuario", JSON.stringify(usuarioSalvo));
            notifySuccess();
            navigate("/principalDoAluno");

        } catch (error) {

            toast.error("Erro ao salvar os dados. Tente novamente.");
        }


    };

    const notifySuccess = () => toast.success('O aluno foi editado com sucesso!', {
        position: "top-right",
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Card className="shadow p-4" style={{ width: "100%", maxWidth: "500px" }}>
                <h3 className="text-center mb-4">Formulário de Edição</h3>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="matricula">
                        <Form.Label>Matrícula</Form.Label>
                        <Form.Control
                            type="text"
                            value={user.matricula}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={user.email}
                            disabled
                        />
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

                    <div className='d-flex justify-content-between'>
                        <Button className='w-25' variant="secondary" onClick={() => navigate("/principalDoAluno")}>
                            Voltar
                        </Button>
                        <Button type="submit" variant="primary" className='w-25' disabled={botaoDesabilitado}>
                            Salvar
                        </Button>
                    </div>

                </Form>
            </Card>
        </Container >
    );
};

export default EditarAluno;
