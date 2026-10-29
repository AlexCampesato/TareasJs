import { tareaService } from "../../services/tareaService.js";
import { getTareas } from "./getTareas.js";

export const deleteTarea = async (id) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const idRol = Number(user.id_rol ?? user.fk_id_rol ?? 0);

    const mensajeConfirmacion = idRol === 2
        ? "¿Desea desasignar esta tarea de su equipo? Quedará disponible para el Administrador."
        : "¿Desea eliminar esta tarea del sistema?";

    if (!confirm(mensajeConfirmacion)) {
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

        const selectFiltro = document.getElementById("selectFiltroEstado");
        await getTareas(selectFiltro ? Number(selectFiltro.value) : 0);

    } catch (error) {
        console.error("Error al eliminar o desasignar tarea:", error);
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