import axios from "axios";

export async function enviarEmailNovaSenha(email, nomeUsuario) {
    try {
        const response = await axios.post(`http://localhost:8080/api/email/enviar/${email}/${nomeUsuario}`);
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar aluno:", error);
        throw error;
    }
}
