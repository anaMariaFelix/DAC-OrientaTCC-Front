import axios from "axios";

export async function enviarEmailNovaSenha(email) {
    try {
        const response = await axios.post(`http://localhost:8080/api/email/enviar/${email}`);
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar aluno:", error);
        throw error;
    }
}
