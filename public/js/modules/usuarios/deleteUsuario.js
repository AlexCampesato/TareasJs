import { usuarioService } from "../../services/usuarioService.js";
import { getUsuarios } from "./getUsuarios.js";

export const deleteUsuario = async (id) => {
    //  Pedimos confirmación al usuario
    if (!confirm(`¿Estás seguro de que deseas eliminar el usuario con ID ${id}? Esta acción no se puede deshacer.`)) {
        return; // Si cancela, no hacemos nada
    }

    try {
        //  Llamamos al servicio
        const response = await usuarioService.delete(id);

        // Evaluamos la respuesta
        if (response.success || response.ok) {
            alert("Usuario eliminado con éxito.");
            getUsuarios(); // Recargamos la tabla dinámicamente
        } else {
            alert(response.message || "Error al eliminar el usuario.");
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("Ocurrió un error de conexión al intentar eliminar.");
    }
};