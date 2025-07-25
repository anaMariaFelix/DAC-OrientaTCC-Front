import axios from "axios";

export async function enviarEmailNovaSenha(email, nomeUsuario, siapeOuMatricula) {
    try {
        const response = await axios.post(`http://localhost:8080/api/email/enviar/${email}/${nomeUsuario}/${siapeOuMatricula}`);
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar aluno:", error);
        throw error;
    }
}
