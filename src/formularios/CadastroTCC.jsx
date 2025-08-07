import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useAppContext } from '../context/AppContext';
import { criarTrabalhoAcademico } from '../services/TrabalhoAcademicoService';
import { toast } from 'react-toastify';

const CadastroTcc = () => {

  const navigate = useNavigate();
  const { user, setUser } = useAppContext();

  const [tema, setTema] = useState("");
  const [siape, setSiape] = useState("");

  const rotaParaCadastrar = async (e) => {
    e.preventDefault();

    if (tema && siape) {

      const trabalho = {
        nome: tema,
        dataInicio: formatarDataParaDDMMYYYY(),
        siapeOrientador: siape,
        matriculaAluno: user.matricula,
        status: "EM_ANDAMENTO"
      }
      console.log(trabalho)

      try {
        await criarTrabalhoAcademico(trabalho);
        notifySuccess();
        navigate("/principalDoAluno");
        
      } catch (error) {
        notifyError();
      }


    }
  }

  function formatarDataParaDDMMYYYY(data = new Date()) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
  }

  const notifySuccess = () => toast.success('O trabalho foi criado com sucesso!', {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  const notifyError = () => toast.error('O SIAPE do orientador não existe ou está incorreto', {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  return ( //renderizar a tela
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card style={{ width: "100%", maxWidth: "700px" }} className="shadow">
        <Card.Body className="d-flex flex-column justify-content-center" style={{ height: "550px" }}>
          <h3 className="text-center mb-4">Cadastrar TCC</h3>

          <Form onSubmit={rotaParaCadastrar}>
            <Form.Group className="mb-3" controlId="tema">
              <Form.Label>Tema</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o tema do TCC"
                onChange={(e) => setTema(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="siape">
              <Form.Label>Orientador SIAPE</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o SIAPE"
                minLength={7}
                onChange={(e) => setSiape(e.target.value)}
                required
              />
            </Form.Group>

            <Row className="justify-content-between">
              <Col xs={12} md={5}>
                <Button variant="secondary" className="w-100" onClick={() => navigate('/principalDoAluno')}>
                  Voltar
                </Button>
              </Col>
              <Col xs={12} md={5}>
                <Button type="submit" variant="primary" className="w-100" id="cadastrar">
                  Cadastrar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CadastroTcc;
