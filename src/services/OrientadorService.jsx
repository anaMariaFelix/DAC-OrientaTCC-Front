import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/orientadores/";

export async function criarOrientador(orientador) {
  try {
    const response = await axios.post(`${API_BASE_URL}`, orientador);
    return response.data;

  } catch (error) {
    return error;
  }
}

export async function buscarOrientadorPorId(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}${id}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar orientador:", error);
    throw error;
  }
}

export async function buscarOrientadorPorEmail(email) {
  try {
    const response = await axios.get(`${API_BASE_URL}email/${email}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar orientador:", error);
    throw error;
  }
}

export async function buscarOrientadorPorSiape(siape) {
  try {
    const response = await axios.get(`${API_BASE_URL}siape/${siape}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar orientador:", error);
    throw error;
  }
}

export async function buscarTodosOrientadores() {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar orientadores:", error);
    throw error;
  }
}

export async function atualizarOrientador(orientadorAtualizado) {
  try {
    const response = await axios.put(`${API_BASE_URL}`, orientadorAtualizado, {
      headers: {
        'Content-Type' : 'application/json'
      },
      withCredentials: true
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar orientadores:", error);
    throw error;
  }
}

export async function atualizarPermissaoOrientador(orientadorAtualizado) {
  try {
    const response = await axios.put(`${API_BASE_URL}siape/${orientadorAtualizado.siape}`, orientadorAtualizado, {
      headers: {
        'Content-Type' : 'application/json'
      },
      withCredentials: true
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar orientadores:", error);
    throw error;
  }
}

export async function deletarOrientadorPorEmail(email) {
  try {
    const response = await axios.delete(`${API_BASE_URL}email/${email}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao deletar orientador:", error);
    throw error;
  }
}