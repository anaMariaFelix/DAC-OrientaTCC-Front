import { useState, useEffect } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { BsPersonCircle } from 'react-icons/bs';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BuscarUsuarioPorEmail } from '../services/UsuarioService';

const NavBar = () => {

    const { user, setUser, token, setToken } = useAppContext();
    const [hover, setHover] = useState(false);
    const [coordenador, setCoordenador] = useState(false);
    const [orientador, setOrientador] = useState(false);

    const navigate = useNavigate();

    const verificarSeEhCoordenador = async () => {
        if (!user?.email) return;

        const usuario = await BuscarUsuarioPorEmail(user.email, token);

        if (usuario.tipoRole === "COORDENADOR") setCoordenador(true);

        if (usuario.tipoRole === "ORIENTADOR") setOrientador(true);
    }

    const redirecionandoHomeEspecifica = async () => {
        if (coordenador || orientador ) {
            navigate("/principalDoOrientador");
        } else {
            navigate("/principalDoAluno");
        }
    }

    const limparDados = () => {
        setToken(null)
        localStorage.removeItem("token")
        setUser(null)
        localStorage.removeItem("usuario")
    }

    useEffect(() => {
        if (user?.email) {
            verificarSeEhCoordenador();
        }

    }, [user]);

    return (
        <>
            <div className="navbar navbar-expand-lg w-100" style={{ padding: "0.75rem 1rem", margin: 0, borderRadius: '10px' }}>
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <a
                        className="m-0"
                        style={{ textDecoration: 'none', color: 'black' }}
                    >
                        <h1
                            className="m-0"
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            style={{
                                textDecoration: hover ? 'underline' : 'none',
                                transition: '0.2s ease',
                                cursor: "pointer"
                            }}
                            onClick={() => redirecionandoHomeEspecifica()}
                        >
                            OrientaTCC
                        </h1>
                    </a>

                    <div className="d-flex align-items-center">
                        {user?.nome && (
                            <h3 className="me-3 d-none d-md-block">{user.nome}</h3>
                        )}


                        <NavDropdown title={<BsPersonCircle size={45} color="#6c757d" />} id="nav-dropdown" align="end">
                            {coordenador && (
                                <>
                                    <NavDropdown.Item href="/listarOrientador">Gerenciar Orientadores</NavDropdown.Item>
                                    <NavDropdown.Item href="/listarAluno">Listar Alunos</NavDropdown.Item>
                                </>
                            )}
                            <NavDropdown.Item onClick={
                                () => {
                                    if (user.matricula) {
                                        navigate("/editarAluno");
                                    } else {
                                        navigate("/editarOrientador");
                                    }
                                }
                            } 
                            >
                                Minha Conta
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={() => {
                                    limparDados()
                                    navigate("/login")
                                }}
                                style={{ color: "red" }}
                            >
                                Sair
                            </NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </div>
            </div>
            <hr style={{ border: "1px solid black", margin: "0 0 20px 0" }} />
        </>
    );
};

export default NavBar;
