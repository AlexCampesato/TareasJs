import { equipoService } from "../../services/equipoService.js";
import { getEquipos } from "./getEquipos.js";
import { showError, showSuccess} from "../../ui/alert.js";

export const initCreateEquipo = () => {
    const formEquipo = document.getElementById("formEquipo");
    const modalEquipoEl = document.getElementById("modalEquipo");

    if (!formEquipo || !modalEquipoEl) return;

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEquipoEl);

    // Evitamos duplicar eventos si la función se llama varias veces
    formEquipo.onsubmit = async (e) => {
        e.preventDefault();

        const idEquipo = document.getElementById("id_equipo").value;
        const nombre = document.getElementById("equipoNombre").value.trim();
        const descripcion = document.getElementById("equipoDescripcion").value.trim();

         if (nombre.length < 4) {
            showError("El nombre es obligatorio y debe tener al menos 4 caracteres.");
            return;
        }

        if (descripcion === "" || descripcion.length < 10) {
            showError("La descripción del equipo debe ser mas larga y explicativa.");
            return;
        }

        try {
            if (!idEquipo) {
                // === MODO CREAR ===
                const response = await equipoService.create({ nombre, descripcion });
                if (response.success || response.ok) {
                    cerrarYRecargar(formEquipo, modalInstance);
                } else {
                    showError(response.message || "Error al crear el equipo");
                }
            } else {
                // === MODO EDITAR ===
                // Llama al método de actualizar en el servicio
                const response = await equipoService.update(idEquipo, { nombre, descripcion });
                if (response.success || response.ok) {
                    cerrarYRecargar(formEquipo, modalInstance);
                    showSuccess("Equipo actualizado con éxito");
                } else {
                    showError(response.message || "Error al actualizar el equipo");
                }
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            showError("Ocurrió un error de conexión con el servidor.");
        }
    };

    // Limpiar al cerrar el modal
    modalEquipoEl.addEventListener('hidden.bs.modal', () => {
        formEquipo.reset();
        document.getElementById("id_equipo").value = "";
        document.getElementById("modalEquipoTitulo").innerText = "Nuevo Equipo";
    });
};

// Función auxiliar para no repetir código
const cerrarYRecargar = (form, modal) => {
    form.reset();
    document.getElementById("id_equipo").value = "";
    modal.hide();
    getEquipos(); // Refresca la tabla automáticamente
};