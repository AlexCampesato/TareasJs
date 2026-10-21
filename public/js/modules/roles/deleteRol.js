import { rolService } from "../../services/rolService.js";
import { getRoles } from "./getRoles.js";

export const deleteRol = async (id) => {
    //  Pedimos confirmación al usuario
    if (!confirm(`¿Estás seguro de que deseas eliminar el rol con ID ${id}? Esta acción no se puede deshacer.`)) {
        return; // Si cancela, no hacemos nada
    }

    try {
        //  Llamamos al servicio
        const response = await rolService.delete(id);

        // Evaluamos la respuesta
        if (response.success || response.ok) {
            alert("Rol eliminado con éxito.");
            getRoles(); // Recargamos la tabla dinámicamente
        } else {
            alert(response.message || "Error al eliminar el rol.");
        }
    } catch (error) {
        console.error("Error al eliminar rol:", error);
        alert("Ocurrió un error de conexión al intentar eliminar.");
    }
};