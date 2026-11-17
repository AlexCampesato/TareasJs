import { tareaService } from "../../services/tareaService.js";
import { getTareas } from "./getTareas.js";
import { authService } from "../../services/authService.js";
import {showSuccess, showError, showConfirm} from "../../ui/alert.js";

export const deleteTarea = async (id, titulo ="") => {

    const response = await authService.checkSession();
    const user = response.user;
    const idRol = Number( user.id_rol ?? 0 );
    const tituloConfirmacion = idRol === 2 ? "¿Desasignar tarea?" : "¿Eliminar tarea?";
    
    const mensajeConfirmacion = idRol === 2
        ? "¿Desea desasignar esta tarea de su equipo? Quedará disponible para el Administrador."
        : "¿Desea eliminar esta tarea del sistema?";

    const confirmado = await showConfirm(tituloConfirmacion, mensajeConfirmacion);

    if (!confirmado) {
        return;
    }

    try {
        const response = await tareaService.delete(id);

        if (!response.ok && !response.success) {
            throw new Error(
                response.mensaje ||
                response.message ||
                "No se pudo completar la operación."
            );
        }

        const mensajeExito = idRol === 2
            ? "Tarea desasignada correctamente."
            : "Tarea eliminada exitosamente.";
        
        showSuccess(mensajeExito);

        const selectFiltro = document.getElementById("selectFiltroEstado");
        await getTareas(selectFiltro ? Number(selectFiltro.value) : 0);

    } catch (error) {
        console.error("Error al eliminar o desasignar tarea:", error);
        showError(error.message || "Error al eliminar o desasignar tarea");
    }
};

    // Escuchador global instantáneo (se ejecuta solos en cuanto se importa la vista)
    document.addEventListener("click", async (e) => {
        const btnEliminar = e.target.closest(".btn-eliminar-tarea");

        if (!btnEliminar) return;

        const id = btnEliminar.dataset.id;

        if (!id || id === "undefined") {
            console.warn("El botón no tiene un ID válido en dataset.id:", id);
            return;
        }

        await deleteTarea(id);
    });

export const initDeleteTarea = () => {
    // Mantenemos la exportación por compatibilidad con dashboard.js
};