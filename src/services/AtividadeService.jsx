import axios from "axios";

const API_BASE_URL = "http://localhost:8080/atividade/";

export async function criarAtividade(atividade, tokenUsuario) {
  try {
    const response = await axios.post(`${API_BASE_URL}salvarAtividade`, atividade, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    throw error;
  }
}

export async function buscarAtividadesPorTrabalho(trabalhoId, tokenUsuario) {
  try {
    const response = await axios.get(`${API_BASE_URL}atividades/trabalho/${trabalhoId}`, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar atividade:", error);
    throw error;
  }
}

export async function deletarAtividade(id, tokenUsuario) {
  try {
    const response = await axios.delete(`${API_BASE_URL}deletar/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao deletar atividade:", error);
    throw error;
  }
}

export async function atualizarAtividade(id, atividade, tokenUsuario) {
  try {
    const response = await axios.put(`${API_BASE_URL}editar/${id}`, atividade, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    throw error;
  }
}

export async function buscarUmaAtividade(id, tokenUsuario) {
  try {
    const response = await axios.get(`${API_BASE_URL}listar/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar atividade:", error);
    throw error;
  }
}
