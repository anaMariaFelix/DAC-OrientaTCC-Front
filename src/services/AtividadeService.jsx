import axios from "axios";

const API_BASE_URL = "http://localhost:8080/atividade/";

export async function criarAtividade(atividade) {
  try {
    const response = await axios.post(`${API_BASE_URL}salvarAtividade`, atividade);
    return response.data;

  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    throw error;
  }
}

export async function buscarAtividadesPorTrabalho(trabalhoId) {
  try {
    const response = await axios.get(`${API_BASE_URL}atividades/trabalho/${trabalhoId}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar atividade:", error);
    throw error;
  }
}

export async function deletarAtividade(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}deletar/${id}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao deletar atividade:", error);
    throw error;
  }
}

export async function atualizarAtividade(id, atividade) {
  try {
    const response = await axios.put(`${API_BASE_URL}editar/${id}`, atividade);
    return response.data;

  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    throw error;
  }
}

export async function buscarUmaAtividade(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}listar/${id}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar atividade:", error);
    throw error;
  }
}

export async function buscarTodasAtividades() {
  try {
    const response = await axios.get(`${API_BASE_URL}listarTodos`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    throw error;
  }
}