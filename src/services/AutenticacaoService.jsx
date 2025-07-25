import axios from "axios";

export async function autenticarUsuario(usuarioLogin) {
    try {
        const response = await axios.post(`http://localhost:8080/api/auth`, usuarioLogin);
        return response.data;

    } catch (error) {
        console.error("Erro ao autenticar o aluno:", error);
        throw error;
    }
}