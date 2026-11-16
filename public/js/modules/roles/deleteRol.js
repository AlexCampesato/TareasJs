import { rolService } from "../../services/rolService.js";
import { getRoles } from "./getRoles.js";
import { showError, showSuccess, showConfirm} from "../../ui/alert.js";

export const deleteRol = async (id, nombre = "") => {


    const identificador = nombre ? `"${nombre}"` : `con ID ${id}`;
    const result = await showConfirm(
      "¿Eliminar rol?",
      `¿Estás seguro de que deseas eliminar el rol ${identificador}? Esta acción no se puede deshacer.`,
    );

    const isConfirmed =
      typeof result === "boolean" ? result : result?.isConfirmed;

    if (!isConfirmed) {
      return; // Si cancela, no hacemos nada
    }


    try {
        //  Llamamos al servicio
        const response = await rolService.delete(id);

        // Evaluamos la respuesta
        if (response.success || response.ok) {
            showSuccess("Rol eliminado con éxito.");
            getRoles(); // Recargamos la tabla dinámicamente
        } else {
            showError(response.message || "Error al eliminar el rol.");
        }
    } catch (error) {
        console.error("Error al eliminar rol:", error);
        showError(error.message || "Ocurrió un error de conexión al intentar eliminar.");
    }
};