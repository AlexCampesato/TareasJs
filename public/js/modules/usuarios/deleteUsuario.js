import { usuarioService } from "../../services/usuarioService.js";
import { getUsuarios } from "./getUsuarios.js";
import { showError, showSuccess, showConfirm} from "../../ui/alert.js";

export const toggleEstadoUsuario = async (id, estadoActual, nombre = "") => {

    const accion = parseInt(estadoActual) === 1 ? "desactivar" : "activar";
    const accionCapitalizada = accion.charAt(0).toUpperCase() + accion.slice(1);
    const identificador = nombre ? `"${nombre}"` : `con ID ${id}`;

   const result = await showConfirm(
        `¿${accionCapitalizada} usuario?`,
        `¿Estás seguro de que deseas ${accion} al usuario ${identificador}?`
    );
    const isConfirmed = typeof result === "boolean" ? result : result?.isConfirmed;
    if (!isConfirmed) return;

    try {
        const response = await usuarioService.toggleEstado(id);

        if (response?.success || response?.ok) {
            showSuccess(response.message || `Usuario ${accion === "activar" ? "activado" : "desactivado"} con éxito.`);
            getUsuarios();
        } else {
            showError(response?.message || "No se pudo cambiar el estado del usuario.");
        }
    } catch (error) {
        console.error("Error al cambiar estado del usuario:", error);
        showError(error.message || "Error al cambiar el estado del usuario.");
    }
};

export const deleteUsuario = async (id, nombre= "") => {
    const identificador = nombre ? `"${nombre}"` : `con ID ${id}`;

    const result = await showConfirm(
        "¿Eliminar usuario?",
        `¿Estás seguro de que deseas eliminar al usuario ${identificador}? Esta acción no se puede deshacer.`
    );

    const isConfirmed = typeof result === "boolean" ? result : result?.isConfirmed;
    if (!isConfirmed) return;

    try {
        // Llamamos al servicio
       const response = await usuarioService.delete(id);

        if (response?.success || response?.ok) {
            showSuccess("Usuario eliminado con éxito.");
            getUsuarios();
        } else {
            showError(response?.message || "Error al eliminar el usuario.");
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        showError(error.message || "Ocurrió un error al intentar eliminar.");
    }
};