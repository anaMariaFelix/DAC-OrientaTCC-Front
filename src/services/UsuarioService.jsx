import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/usuarios/"


export async function atualizarSenhaUsuario(id, usuarioAtualizado) {
    try {
        const response = await axios.put(`${API_BASE_URL}${id}`, usuarioAtualizado)
        return response.data;
    } catch (error) {
        console.log("Erro ao atualizar senha do usuário", error)
        throw error
    }
}

export async function BuscarUsuarioPorEmail(email) {
    try {
        const response = await axios.get(`${API_BASE_URL}email/${email}`)
        return response.data;
    } catch (error) {
        console.log("Erro ao buscar usuário por email", error)
        throw error
    }
}