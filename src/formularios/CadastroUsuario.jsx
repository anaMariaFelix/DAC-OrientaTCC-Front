import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { criarAluno } from '../services/AlunoService';
import { criarOrientador } from '../services/OrientadorService';

const CadastroUsuario = () => {

  const [siape, setSiape] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [areaAtuacao, setAreaAtuacao] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  const navigate = useNavigate();

  const notifySucess = () => toast.success('Usuário cadastrado com sucesso!', {
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

  const rotaCadastro = async (e) => {
    e.preventDefault();

    const camposComuns = nome && email && senha && tipoUsuario;

    if (tipoUsuario === "aluno") {
      if (camposComuns && matricula) {
        const user = {
          matricula,
          nome,
          email,
          senha
        };

        try {
          const alunoSalvo = await criarAluno(user);
          notifySucess();
          navigate("/principalDoOrientador");

        } catch (error) {
          notifyError(error.response.data.message);
        }

      }

    } else {
      if (camposComuns && siape && areaAtuacao) {
        const user = {
          siape,
          nome,
          email,
          senha,
          areaAtuacao,
        };
        try {
          await criarOrientador(user);
          notifySucess();
          navigate("/principalDoOrientador");

        } catch (error) {
          const mensagemErro = error?.response?.data?.message || error.message || "Erro desconhecido.";
          console.log(mensagemErro)
          if (mensagemErro.includes("could not execute")) {
            notifyError(`Usuário com identificador ${matricula ? matricula : siape} já existe no banco`);
          } else {
            notifyError(mensagemErro);
          }

        }

      }

    }

  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="shadow p-4" style={{ width: "100%", maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Formulário de Cadastro</h3>

        <Form onSubmit={rotaCadastro}>

          {tipoUsuario === "orientador" ? (
            <Form.Group className="mb-3" controlId="siape">
              <Form.Label>SIAPE</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu SIAPE"
                onChange={(e) => setSiape(e.target.value)}
                required
              />
            </Form.Group>
          ) : (
            <Form.Group className="mb-3" controlId="matricula">
              <Form.Label>Matrícula</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite sua matrícula"
                onChange={(e) => setMatricula(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="nome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite seu nome"
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite seu email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="senha">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite sua senha"
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
            />
          </Form.Group>

          {tipoUsuario === "orientador" && (
            <Form.Group className="mb-3" controlId="area">
              <Form.Label>Área de Atuação</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite sua área de atuação"
                onChange={(e) => setAreaAtuacao(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-4">
            <Form.Label>Tipo de usuário</Form.Label>
            <div className="d-flex gap-4">
              <Form.Check
                type="radio"
                label="Aluno"
                name="tipoUsuario"
                id="aluno"
                value="aluno"
                checked={tipoUsuario === "aluno"}
                onChange={(e) => setTipoUsuario(e.target.value)}
                required
              />
              <Form.Check
                type="radio"
                label="Orientador"
                name="tipoUsuario"
                id="orientador"
                value="orientador"
                checked={tipoUsuario === "orientador"}
                onChange={(e) => setTipoUsuario(e.target.value)}
                required
              />
            </div>
          </Form.Group>

          <div className='d-flex justify-content-between'>
            <Button variant="secondary" className="w-25" onClick={() => { navigate("/principalDoOrientador") }}>
              Voltar
            </Button>
            <Button type="submit" variant="primary" className="w-25">
              Salvar
            </Button>
          </div>

        </Form>
      </Card>
    </Container >
  );
};

export default CadastroUsuario;
