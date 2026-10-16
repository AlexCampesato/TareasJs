import { permisoService } from "../../services/permisoService.js";
import { getPermisos } from "./getPermisos.js";

export const deletePermiso = async (id) => {
    //  Pedimos confirmación al usuario
    if (!confirm(`¿Estás seguro de que deseas eliminar el permiso con ID ${id}? Esta acción no se puede deshacer.`)) {
        return; // Si cancela, no hacemos nada
    }

    try {
        //  Llamamos al servicio
        const response = await permisoService.delete(id);

        // Evaluamos la respuesta
        if (response.success || response.ok) {
            alert("Permiso eliminado con éxito.");
            getPermisos(); // Recargamos la tabla dinámicamente
        } else {
            alert(response.message || "Error al eliminar el permiso.");
        }
    } catch (error) {
        console.error("Error al eliminar permiso:", error);
        alert("Ocurrió un error de conexión al intentar eliminar.");
    }
};