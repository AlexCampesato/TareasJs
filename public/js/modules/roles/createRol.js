import { rolService } from "../../services/rolService.js";
import { getRoles } from "./getRoles.js";
import { cargarPermisosParaCrear } from "./updateRol.js";

export const initCreateRol = () => {
    const formRol = document.getElementById("formRol");
    const modalRolEl = document.getElementById("modalRol");

    if (!formRol || !modalRolEl) return;

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalRolEl);

    // Botones para marcar y desmarcar todos los checkboxes
    const btnMarcar = document.getElementById("btnMarcarTodosPermisos");
    const btnDesmarcar = document.getElementById("btnDesmarcarTodosPermisos");

    if (btnMarcar) {
        btnMarcar.onclick = () => {
            modalRolEl.querySelectorAll(".check-permiso").forEach(chk => chk.checked = true);
        };
    }

    if (btnDesmarcar) {
        btnDesmarcar.onclick = () => {
            modalRolEl.querySelectorAll(".check-permiso").forEach(chk => chk.checked = false);
        };
    }

    // Botón "Nuevo Rol" de la página principal: cargar catálogo de permisos limpios
    const btnNuevoRol = document.querySelector('[data-bs-target="#modalRol"]');
    if (btnNuevoRol) {
        btnNuevoRol.addEventListener("click", () => {
            document.getElementById("id_rol").value = "";
            document.getElementById("modalRolTitulo").innerText = "Nuevo Rol";
            formRol.reset();
            cargarPermisosParaCrear();
        });
    }

    // Guardado del formulario (Crear o Editar)
    formRol.onsubmit = async (e) => {
        e.preventDefault();

        const idRol = document.getElementById("id_rol").value;
        const nombre = document.getElementById("rolNombre").value.trim();
        const descripcion = document.getElementById("rolDescripcion").value.trim();

        if (!nombre) {
            alert("El nombre es obligatorio");
            return;
        }

        // Obtener los IDs de permisos seleccionados
        const permisosSeleccionados = Array.from(
            modalRolEl.querySelectorAll(".check-permiso:checked")
        ).map(chk => parseInt(chk.value));

        const payload = {
            nombre,
            descripcion,
            permisos: permisosSeleccionados
        };

        try {
            if (!idRol) {
                // === MODO CREAR ===
                const response = await rolService.create(payload);
                if (response.success || response.ok) {
                    cerrarYRecargar(formRol, modalInstance);
                    if (typeof toastr !== "undefined") {
                        toastr.success("Rol creado con éxito");
                    } else {
                        alert("Rol creado con éxito");
                    }
                } else {
                    alert(response.message || "Error al crear el rol");
                }
            } else {
                // === MODO EDITAR ===
                const response = await rolService.update(idRol, payload);
                if (response.success || response.ok) {
                    cerrarYRecargar(formRol, modalInstance);
                    if (typeof toastr !== "undefined") {
                        toastr.success("Rol y permisos actualizados con éxito");
                    } else {
                        alert("Rol y permisos actualizados con éxito");
                    }
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