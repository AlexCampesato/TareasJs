import { permisoService } from "../../services/permisoService.js";
import { getPermisos } from "./getPermisos.js";
import { showError, showSuccess} from "../../ui/alert.js";

export const initCreatePermiso = () => {
    const formPermiso = document.getElementById("formPermiso");
    const modalPermisoEl = document.getElementById("modalPermiso");

    if (!formPermiso || !modalPermisoEl) return;

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalPermisoEl);

    // Evitamos duplicar eventos si la función se llama varias veces
    formPermiso.onsubmit = async (e) => {
        e.preventDefault();

        const idPermiso = document.getElementById("id_permiso").value;
        const nombre = document.getElementById("permisoNombre").value.trim();
        const descripcion = document.getElementById("permisoDescripcion").value.trim();

          if (nombre.length < 4) {
            showError("El nombre es obligatorio y debe tener al menos 4 caracteres.");
            return;
        }

        if (descripcion === "" || descripcion.length < 10) {
            showError("La descripción del permiso debe ser mas larga y explicativa.");
            return;
        }

        try {
            if (!idPermiso) {
                // === MODO CREAR ===
                const response = await permisoService.create({ nombre, descripcion });
                if (response.success || response.ok) {
                    cerrarYRecargar(formPermiso, modalInstance);
                    showSuccess("Permiso creado con éxito");
                } else {
                    showError(response.message || "Error al crear el permiso");
                }
            } else {
                // === MODO EDITAR ===
                // Llama al método de actualizar en el servicio
                const response = await permisoService.update(idPermiso, { nombre, descripcion });
                if (response.success || response.ok) {
                    cerrarYRecargar(formPermiso, modalInstance);
                    showSuccess("Permiso actualizado con éxito");
                } else {
                    showError(response.message || "Error al actualizar el permiso");
                }
            }
        } catch (error) {
            console.error("Error al guardar:", error);
           showError("Ocurrió un error de conexión con el servidor.");
        }
    };

    // Limpiar al cerrar el modal
    modalPermisoEl.addEventListener('hidden.bs.modal', () => {
        formPermiso.reset();
        document.getElementById("id_permiso").value = "";
        document.getElementById("modalPermisoTitulo").innerText = "Nuevo Permiso";
    });
};

// Función auxiliar para no repetir código
const cerrarYRecargar = (form, modal) => {
    form.reset();
    document.getElementById("id_permiso").value = "";
    modal.hide();
    getPermisos(); // Refresca la tabla automáticamente
};