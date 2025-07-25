import { useState, useEffect } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { atualizarPermissaoOrientador } from '../../services/OrientadorService';

const EditarPermissaoOrientador = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [orientador, setOrientador] = useState();
    const [permissaoOriginal, setPermissaoOriginal] = useState();

    useEffect(() => {
        if (location.state?.professor) {
            const professor = {
                ...location.state.professor,
                permissao: location.state.professor.permissao || 'orientador',
            };
            setOrientador(professor);
            setPermissaoOriginal(professor.permissao || 'orientador');
        }
    }, [location]);

    function handlePermissaoChange(e) {
        setOrientador(prev => ({ ...prev, permissao: e.target.value }));
    }

    function houveAlteracaoPermissao() {
        return orientador?.permissao !== permissaoOriginal;
    }

    async function atualizacaoDoOrientador(e) {
        e.preventDefault();
        try {

            await atualizarPermissaoOrientador(orientador);
            notifySuccess();
            navigate('/principalDoOrientador');

        } catch (erro) {
            notifyError();
        }
    }

    const notifySuccess = () => toast.success('O orientador foi atualizado com sucesso!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    const notifyError = () => toast.error('Ocorreu um erro ao atualizar o orientador, verifique as informações!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    if (!orientador) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <p>Carregando orientador...</p>
            </Container>
        );
    }

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100 bg-light"
        >
            <Card style={{ maxWidth: '500px', width: '100%' }} className="p-4 shadow">
                <h3 className="text-center mb-4">Editar Permissão</h3>

                <Form noValidate onSubmit={atualizacaoDoOrientador}>
                    <Form.Group className="mb-3" controlId="siape">
                        <Form.Label>SIAPE</Form.Label>
                        <Form.Control type="text" value={orientador.siape} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={orientador.email} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="nome">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" value={orientador.nome} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="areaAtuacao">
                        <Form.Label>Área de Atuação</Form.Label>
                        <Form.Control type="text" value={orientador.areaAtuacao} disabled />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="d-block">Permissão</Form.Label>
                        <Form.Check
                            inline
                            label="Orientador"
                            name="permissao"
                            type="radio"
                            id="orientador"
                            value="orientador"
                            checked={orientador.permissao === 'orientador'}
                            onChange={handlePermissaoChange}
                            required
                        />
                        <Form.Check
                            inline
                            label="Coordenador"
                            name="permissao"
                            type="radio"
                            id="coordenador"
                            value="coordenador"
                            checked={orientador.permissao === 'coordenador'}
                            onChange={handlePermissaoChange}
                            required
                        />
                    </Form.Group>

                    <div className='d-flex justify-content-between'>
                        <Button
                            variant="secondary"
                            className="w-25"
                            onClick={() => navigate("/principalDoOrientador")}
                        >
                            Voltar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-25"
                            disabled={!houveAlteracaoPermissao()}
                        >
                            Salvar
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default EditarPermissaoOrientador;
