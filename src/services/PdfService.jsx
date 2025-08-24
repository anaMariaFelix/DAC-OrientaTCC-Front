import axios from "axios";

const API_BASE_URL = "http://localhost:8080/pdf/";

export async function criarPdf(pdfs) {
  const formData = new FormData();

  pdfs.forEach(file => {
    formData.append("arquivos", file);
  });

  try {
    const response = await axios.post(`${API_BASE_URL}salvar`, formData);
    return response.data;

  } catch (error) {
    console.error("Erro ao criar pdf:", error);
    throw error;
  }
}

export async function deletarPdf(id, tokenUsuario) {
  try {
    const response = await axios.delete(`${API_BASE_URL}${id}`, {
      headers: {
        Authorization: `Bearer ${tokenUsuario}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Erro ao deletar pdf:", error);
    throw error;
  }
}