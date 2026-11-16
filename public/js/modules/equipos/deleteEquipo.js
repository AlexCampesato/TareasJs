import { equipoService } from "../../services/equipoService.js";
import { getEquipos } from "./getEquipos.js";
import { showError, showSuccess, showConfirm} from "../../ui/alert.js";

export const deleteEquipo = async (id, nombre = "") => {
    // Pedimos confirmación 
    const identificador = nombre ? `"${nombre}"` : `con ID ${id}`;
    const result = await showConfirm(
        "¿Eliminar equipo?",
        `¿Estás seguro de que deseas eliminar el equipo ${identificador}? Esta acción no se puede deshacer.`
    );

    const isConfirmed = typeof result === "boolean" ? result : result?.isConfirmed;

    if (!isConfirmed) {
        return; // Si cancela, no hacemos nada
    }

    try {
        //  Llamamos al servicio
        const response = await equipoService.delete(id);

        // Evaluamos la respuesta
        if (response.success || response.ok) {
            showSuccess("Equipo eliminado con éxito.");
            getEquipos(); // Recargamos la tabla dinámicamente
        } else {
            showError(response.message || "Error al eliminar el equipo.");
        }
    } catch (error) {
        console.error("Error al eliminar equipo:", error);
        showError("Ocurrió un error de conexión al intentar eliminar.");
    }
};