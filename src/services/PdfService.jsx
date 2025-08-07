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

export async function baixarPdf(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}arquivo/${id}`, { responseType: 'blob' });
    return response.data;

  } catch (error) {
    console.error("Erro ao baixar pdf:", error);
    throw error;
  }
}

export async function buscarPdfPorId(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}${id}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar pdf:", error);
    throw error;
  }
}

export async function deletarPdf(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}${id}`);
    return response.data;

  } catch (error) {
    console.error("Erro ao deletar pdf:", error);
    throw error;
  }
}