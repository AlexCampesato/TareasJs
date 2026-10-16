import { rolService } from "../../services/rolService.js";
import { getRoles } from "./getRoles.js";

export const initCreateRol = () => {
    const formRol = document.getElementById("formRol");
    const modalRolEl = document.getElementById("modalRol");

    if (!formRol || !modalRolEl) return;

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalRolEl);

    // Evitamos duplicar eventos si la función se llama varias veces
    formRol.onsubmit = async (e) => {
        e.preventDefault();

        const idRol = document.getElementById("id_rol").value;
        const nombre = document.getElementById("rolNombre").value.trim();
        const descripcion = document.getElementById("rolDescripcion").value.trim();

        if (!nombre) {
            alert("El nombre es obligatorio");
            return;
        }

        try {
            if (!idRol) {
                // === MODO CREAR ===
                const response = await rolService.create({ nombre, descripcion });
                if (response.success || response.ok) {
                    cerrarYRecargar(formRol, modalInstance);
                } else {
                    alert(response.message || "Error al crear el rol");
                }
            } else {
                // === MODO EDITAR ===
                // Llama al método de actualizar en el servicio
                const response = await rolService.update(idRol, { nombre, descripcion });
                if (response.success || response.ok) {
                    cerrarYRecargar(formRol, modalInstance);
                    alert("Rol actualizado con éxito");
                } else {
                    alert(response.message || "Error al actualizar el rol");
                }
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Ocurrió un error de conexión con el servidor.");
        }
    };

    // Limpiar al cerrar el modal
    modalRolEl.addEventListener('hidden.bs.modal', () => {
        formRol.reset();
        document.getElementById("id_rol").value = "";
        document.getElementById("modalRolTitulo").innerText = "Nuevo Rol";
    });
};

// Función auxiliar para no repetir código
const cerrarYRecargar = (form, modal) => {
    form.reset();
    document.getElementById("id_rol").value = "";
    modal.hide();
    getRoles(); // Refresca la tabla automáticamente
};