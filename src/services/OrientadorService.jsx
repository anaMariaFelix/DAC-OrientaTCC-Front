import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/orientadores/";

export async function criarOrientador(orientador, tokenUsuario) {
  try {
    const response = await axios.post(`${API_BASE_URL}`, orientador, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
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

export async function buscarOrientadorPorEmail(email, tokenUsuario) {
  try {
    const response = await axios.get(`${API_BASE_URL}email/${email}`, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
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

export async function buscarTodosOrientadores(tokenUsuario) {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar orientadores:", error);
    throw error;
  }
}

export async function atualizarOrientador(orientadorAtualizado, tokenUsuario) {
  try {
    const response = await axios.put(`${API_BASE_URL}`, orientadorAtualizado, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      },
  
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar orientadores:", error);
    throw error;
  }
}

export async function atualizarPermissaoOrientador(orientadorAtualizado, tokenUsuario) {
  try {
    const response = await axios.put(`${API_BASE_URL}siape/${orientadorAtualizado.siape}`, orientadorAtualizado, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      },
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar orientadores:", error);
    throw error;
  }
}

export async function deletarOrientadorPorEmail(email, tokenUsuario) {
  try {
    const response = await axios.delete(`${API_BASE_URL}email/${email}`, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao deletar orientador:", error);
    throw error;
  }
}