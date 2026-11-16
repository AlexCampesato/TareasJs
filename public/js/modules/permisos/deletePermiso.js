import { permisoService } from "../../services/permisoService.js";
import { showError, showSuccess, showConfirm } from "../../ui/alert.js";
import { getPermisos } from "./getPermisos.js";

export const deletePermiso = async (id, nombre = "") => {
  // Pedimos confirmación
  const identificador = nombre ? `"${nombre}"` : `con ID ${id}`;
  const result = await showConfirm(
    "¿Eliminar permiso?",
    `¿Estás seguro de que deseas eliminar el permiso ${identificador}? Esta acción no se puede deshacer.`,
  );

  const isConfirmed =
    typeof result === "boolean" ? result : result?.isConfirmed;

  if (!isConfirmed) {
    return; // Si cancela, no hacemos nada
  }

  try {
    //  Llamamos al servicio
    const response = await permisoService.delete(id);

    // Evaluamos la respuesta
    if (response.success || response.ok) {
      showSuccess("Permiso eliminado con éxito.");
      getPermisos(); // Recargamos la tabla dinámicamente
    } else {
      showError(response.message || "Error al eliminar el permiso.");
    }
  } catch (error) {
    console.error("Error al eliminar permiso:", error);
    showError(error.message || "Ocurrió un error de conexión al intentar eliminar.");
  }
};