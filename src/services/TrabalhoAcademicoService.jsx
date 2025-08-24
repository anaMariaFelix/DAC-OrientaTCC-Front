import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/trabalhoAcademico/";

export async function criarTrabalhoAcademico(trabalhoAcademico, tokenUsuario) {
  try {
    const response = await axios.post(`${API_BASE_URL}`, trabalhoAcademico, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao criar trabalho:", error);
    throw error;
  }
}

export async function deletarTrabalhoAcademico(id, tokenUsuario) {
  try {
    const response = await axios.delete(`${API_BASE_URL}${id}`, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao deletar trabalho:", error);
    throw error;
  }
}

export async function buscarTrabalhoAcademicoPorMatriculaAluno(matricula, tokenUsuario) {
  try {
    const response = await axios.get(`${API_BASE_URL}matricula/${matricula}`, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    if (error.response?.data.status === 404) {
      return null; 
    }

    console.error("Erro inesperado ao procurar trabalho do aluno:", error);
    return null;
  }

}

export async function buscarTrabalhoAcademicoPorSiapeOrientador(siape, tokenUsuario) {
  try {
    const response = await axios.get(`${API_BASE_URL}siape/${siape}`, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao procurar trabalhos do orientador:", error);
    throw error;
  }
}
