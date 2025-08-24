import { jwtDecode } from "jwt-decode";
import { useAppContext } from "../context/AppContext";

export function getUserRoles() {

    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role || null;

    } catch (error) {
        console.error("Erro ao decodificar token", error);
        return null;
    }

}