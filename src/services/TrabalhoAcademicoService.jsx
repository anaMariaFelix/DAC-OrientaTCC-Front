import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/trabalhoAcademico/";

export async function criarTrabalhoAcademico(trabalhoAcademico) {
  try {
    const response = await axios.post(`${API_BASE_URL}`, trabalhoAcademico);
    return response.data;

  } catch (error) {
    console.error("Erro ao criar trabalho:", error);
    throw error;
  }
}

export async function deletarTrabalhoAcademico(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}${id}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao deletar trabalho:", error);
    throw error;
  }
}

export async function buscarTrabalhoAcademicoPorId(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}${id}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao procurar trabalho:", error);
    throw error;
  }
}

export async function buscarTrabalhoAcademicoPorMatriculaAluno(matricula) {
  try {
    const response = await axios.get(`${API_BASE_URL}matricula/${matricula}`);
    return response.data;

  } catch (error) {
    if (error.response?.data.status === 404) {
      return null; 
    }

    console.error("Erro inesperado ao procurar trabalho do aluno:", error);
    return null;
  }

}

export async function buscarTrabalhoAcademicoPorSiapeOrientador(siape) {
  try {
    const response = await axios.get(`${API_BASE_URL}siape/${siape}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao procurar trabalhos do orientador:", error);
    throw error;
  }
}
