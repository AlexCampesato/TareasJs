import { equipoService } from "../../services/equipoService.js";
import { getEquipos } from "./getEquipos.js";

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

        if (!nombre) {
            alert("El nombre es obligatorio");
            return;
        }

        try {
            if (!idEquipo) {
                // === MODO CREAR ===
                const response = await equipoService.create({ nombre, descripcion });
                if (response.success || response.ok) {
                    cerrarYRecargar(formEquipo, modalInstance);
                } else {
                    alert(response.message || "Error al crear el equipo");
                }
            } else {
                // === MODO EDITAR ===
                // Llama al método de actualizar en el servicio
                const response = await equipoService.update(idEquipo, { nombre, descripcion });
                if (response.success || response.ok) {
                    cerrarYRecargar(formEquipo, modalInstance);
                    alert("Equipo actualizado con éxito");
                } else {
                    alert(response.message || "Error al actualizar el equipo");
                }
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Ocurrió un error de conexión con el servidor.");
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