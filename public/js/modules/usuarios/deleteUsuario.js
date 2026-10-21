import { usuarioService } from "../../services/usuarioService.js";
import { getUsuarios } from "./getUsuarios.js";

export const toggleEstadoUsuario = async (id, estadoActual) => {
    const accion = parseInt(estadoActual) === 1 ? "desactivar" : "activar";
    if (!confirm(`¿Estás seguro de que deseas ${accion} al usuario con ID ${id}?`)) {
        return;
    }

    try {
        const response = await usuarioService.toggleEstado(id);
        if (response.success || response.ok) {
            if (typeof toastr !== "undefined") {
                toastr.success(response.message || `Usuario ${accion === "activar" ? "activado" : "desactivado"} con éxito.`);
            } else {
                alert(response.message || "Estado actualizado con éxito.");
            }
            getUsuarios();
        } else {
            alert(response.message || "No se pudo cambiar el estado del usuario.");
        }
    } catch (error) {
        console.error("Error al cambiar estado del usuario:", error);
        alert(error.message || "Error al cambiar el estado del usuario.");
    }
};

export const deleteUsuario = async (id) => {
    // Pedimos confirmación al usuario
    if (!confirm(`¿Estás seguro de que deseas eliminar el usuario con ID ${id}?`)) {
        return; // Si cancela, no hacemos nada
    }

    try {
        // Llamamos al servicio
        const response = await usuarioService.delete(id);

        // Evaluamos la respuesta
        if (response.success || response.ok) {
            if (typeof toastr !== "undefined") {
                toastr.success("Usuario eliminado con éxito.");
            } else {
                alert("Usuario eliminado con éxito.");
            }
            getUsuarios(); // Recargamos la tabla dinámicamente
        } else {
            alert(response.message || "Error al eliminar el usuario.");
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert(error.message || "Ocurrió un error al intentar eliminar.");
    }
};