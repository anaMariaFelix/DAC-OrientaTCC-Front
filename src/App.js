import { Routes, Route, Navigate } from 'react-router-dom';

import CadastroUsuario from './formularios/CadastroUsuario.jsx';
import Login from './formularios/Login.jsx';

import PrincipalDoAluno from './paginas/aluno/PrincipalDoAluno'
import CadastroTcc from './formularios/CadastroTCC.jsx';
import ListaAtividadesAluno from './paginas/aluno/ListaAtividadesAluno.jsx';
import AdicionarTrabalhoDoTcc from './paginas/aluno/AtividadeDoAluno.jsx';
import EditarAluno from './paginas/aluno/EditarAluno.jsx';

import PrincipalDoOrientador from './paginas/orientador/PrincipalDoOrientador.jsx';
import ListaAtividadesOrientador from './paginas/orientador/ListaAtividadesOrientador.jsx';
import AtividadeOrientador from './paginas/orientador/AtividadeOrientador.jsx';
import EditarOrientador from './paginas/orientador/EditarOrientador.jsx';


import GerenciarAluno from './paginas/coordenador/GerenciarAluno.jsx';
import GerenciarOrientador from './paginas/coordenador/GerenciarOrientador.jsx';
import EditarPermissaoOrientador from './paginas/coordenador/EditarPermissaoOrientador.jsx';

import { ToastContainer } from 'react-toastify';
import { AppProvider } from './context/AppContext.jsx';
import PrivateRoute from './componentes/PrivateRoute.jsx';


function App() {
  

  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute permissao="ALUNO" />}>
          <Route path="/principalDoAluno" element={<PrincipalDoAluno />} />
          <Route path="/cadastroTCC" element={<CadastroTcc />} />
          <Route path="/listaAtividadesAluno" element={<ListaAtividadesAluno />} />
          <Route path="/atividadeDoAluno/:idAtividade" element={<AdicionarTrabalhoDoTcc />} />
          <Route path="/editarAluno" element={<EditarAluno />} />
        </Route>

        <Route element={<PrivateRoute permissao={["ORIENTADOR", "COORDENADOR"]} />}>
          <Route path="/principalDoOrientador" element={<PrincipalDoOrientador />} />
          <Route path="/listaAtividadesOrientador" element={<ListaAtividadesOrientador />} />
          <Route path="/atividadeOrientador" element={<AtividadeOrientador />} />
          <Route path="/atividadeOrientador/:idAtividade" element={<AtividadeOrientador />} />
          <Route path="/editarOrientador" element={<EditarOrientador />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
        </Route>
        
        <Route element={<PrivateRoute permissao="COORDENADOR" />}>
          <Route path="/listarAluno" element={<GerenciarAluno />} />
          <Route path="/listarOrientador" element={<GerenciarOrientador />} />
          <Route path="/coordenadorEditaOrientador" element={<EditarPermissaoOrientador />} />
        </Route>
      </Routes>
      <ToastContainer />
    </AppProvider>

  );
}

export default App;
