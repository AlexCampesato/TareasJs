import { equipoService } from "../../services/equipoService.js";
import { getEquipos } from "./getEquipos.js";

export const deleteEquipo = async (id) => {
    //  Pedimos confirmación al usuario
    if (!confirm(`¿Estás seguro de que deseas eliminar el equipo con ID ${id}? Esta acción no se puede deshacer.`)) {
        return; // Si cancela, no hacemos nada
    }

    try {
        //  Llamamos al servicio
        const response = await equipoService.delete(id);

        // Evaluamos la respuesta
        if (response.success || response.ok) {
            alert("Equipo eliminado con éxito.");
            getEquipos(); // Recargamos la tabla dinámicamente
        } else {
            alert(response.message || "Error al eliminar el equipo.");
        }
    } catch (error) {
        console.error("Error al eliminar equipo:", error);
        alert("Ocurrió un error de conexión al intentar eliminar.");
    }
};