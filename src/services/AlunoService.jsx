import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/alunos/";

export async function criarAluno(aluno) {
  try {
    const response = await axios.post(`${API_BASE_URL}`, aluno);
    return response.data;

  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    throw error;
  }
}

export async function buscarAlunoPorId(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}${id}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    throw error;
  }
}

export async function buscarAlunoPorEmail(email) {
  try {
    const response = await axios.get(`${API_BASE_URL}email/${email}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    throw error;
  }
}

export async function buscarAlunoPorMatricula(matricula) {
  try {
    const response = await axios.get(`${API_BASE_URL}matricula/${matricula}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    throw error;
  }
}

export async function buscarTodosAlunos() {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    throw error;
  }
}

export async function atualizarAluno(alunoAtualizado) {
  try {
    const response = await axios.put(`${API_BASE_URL}`, alunoAtualizado, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    throw error;
  }
}

export async function deletarAlunoPorEmail(email) {
  try {
    const emailEncoded = encodeURIComponent(email);
    const response = await axios.delete(`${API_BASE_URL}email/${emailEncoded}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar aluno:", error);
    throw error;
  }
}
