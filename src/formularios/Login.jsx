import React, { useState } from 'react';
import { Container, Card, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { buscarAlunoPorEmail } from '../services/AlunoService';
import { useAppContext } from '../context/AppContext';
import { enviarEmailNovaSenha } from '../services/EmailService';
import { toast } from 'react-toastify';
import { BuscarUsuarioPorEmail } from '../services/UsuarioService';
import { buscarOrientadorPorEmail } from '../services/OrientadorService';
import { autenticarUsuario } from '../services/AutenticacaoService';


const Login = () => {

  const { setUser, setToken } = useAppContext()
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const notifySuccess = () => toast.success('Um email foi enviado com a nova senha', {
    position: "top-right",
    autoClose: 3000, 
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  const notifyErrorRecuperarSenha = () => toast.error('Usuário com email informado nao existe!', {
    position: "top-right",
    autoClose: 3000, 
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  const notifyErrorLogin = (msg) => toast.error(msg, {
    position: "top-right",
    autoClose: 3000, 
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  const recuperacaoDeSenha = async (e) => {
    e.preventDefault();

    if (!emailRecuperacao) {
      alert("Preencha o campo de email");
      return;
    }

    try {
      await enviarEmailNovaSenha(emailRecuperacao);

        notifySuccess();
        handleClose();    

    } catch (error) {
      console.error("Erro na recuperação de senha:", error.message);

      if (error.response?.status === 404) {
        notifyErrorRecuperarSenha("Usuário não encontrado com esse e-mail.");
      } else {
        notifyErrorRecuperarSenha("Erro ao tentar recuperar senha. Tente novamente.");
      }
    }

  };

  const rotaParaEntrar = async (e) => {
    e.preventDefault();

    if (email && senha) {

      try {
        const usuarioLogin = { email, senha }
        const { token } = await autenticarUsuario(usuarioLogin);
        setToken(token);
        localStorage.setItem("token", token);

        const usuario = await BuscarUsuarioPorEmail(email, token);

        if (usuario.tipoRole === "ALUNO") {
          const aluno = await buscarAlunoPorEmail(email, token);

          setUser(aluno);
          localStorage.setItem("usuario", JSON.stringify(aluno));
          navigate("/principalDoAluno");

        } else {
          const orientador = await buscarOrientadorPorEmail(email, token);

          setUser(orientador);
          localStorage.setItem("usuario", JSON.stringify(orientador));
          navigate("/principalDoOrientador");
        }

      } catch (error) {
        notifyErrorLogin("Verifique suas informações de login");
        console.log(error);
      }
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="shadow p-4" style={{ width: "100%", maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Login</h3>

        <Form onSubmit={rotaParaEntrar}>
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
            <div className=" d-flex text-center justify-content-center mt-2">
              <p
                onClick={() => setShow(true)}
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                  backgroundColor: "white",
                  width: "135px",
                  marginBottom: "0px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#357ABD";

                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#0d6efd";

                }}
              >
                Esqueceu a senha?
              </p>
            </div>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Entrar
          </Button>
        </Form>
      </Card>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Senha</Modal.Title>
        </Modal.Header>

        <Form onSubmit={recuperacaoDeSenha}>
          <Modal.Body>
            <Form.Group controlId='email'>
              <Form.Label className='mb-3'>
                Informe seu <strong>e-mail</strong> para receber uma nova senha
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite seu email"
                onChange={(e) => setEmailRecuperacao(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="danger" type="submit">
              Confirmar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Login;
