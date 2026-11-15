import { getTareas } from "./getTareas.js";
import { showSuccess, showError } from "../../ui/alert.js";

// Carga los usuarios pertenecientes al equipo de la tarea
const cargarMiembrosEquipo = async (idEquipo, idUsuarioActual = null) => {
    const selectUsuario = document.getElementById("selectUsuarioAsignar");
    if (!selectUsuario) return;

    try {
        const response = await fetch(`/proyecto-tareas/api/equipos/${idEquipo}/miembros`);
        const data = await response.json();

        const esValido = data.success === true || data.ok === true;
        const listaMiembros = Array.isArray(data.miembros) ? data.miembros : (Array.isArray(data.usuarios) ? data.usuarios : []);

        if (esValido && listaMiembros.length > 0) {
            selectUsuario.innerHTML = `
                <option value="">-- Seleccionar un integrante --</option>
                ${listaMiembros
                    .map((usuario) => {
                        const id = usuario.id_usuario || usuario.id;
                        const nombre = usuario.nombre || usuario.nombre_usuario;
                        const esSeleccionado = String(id) === String(idUsuarioActual) ? "selected" : "";
                        return `<option value="${id}" ${esSeleccionado}>${nombre}</option>`;
                    })
                    .join("")}
            `;
        } else {
            selectUsuario.innerHTML = `<option value="">No hay miembros en este equipo</option>`;
        }
    } catch (error) {
        console.error("Error al cargar miembros del equipo:", error);
        selectUsuario.innerHTML = `<option value="">Error al cargar integrantes</option>`;
    }
};

let listenerGlobalMiembroRegistrado = false;

export const initAsignarMiembro = () => {
    const formAsignar = document.getElementById("formAsignarMiembro");
    if (!formAsignar) return;

    //  para el envío del formulario
    if (!formAsignar.dataset.listener) {
        formAsignar.dataset.listener = "true";

        formAsignar.addEventListener("submit", async (e) => {
            e.preventDefault();

            const idTarea = document.getElementById("idTareaAsignarMiembro").value;
            const idUsuario = document.getElementById("selectUsuarioAsignar").value;

            if (!idUsuario) {
                showError("Por favor selecciona un integrante.");
                return;
            }

            try {
                const response = await fetch("/proyecto-tareas/api/tareas/asignar-usuario", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id_tarea: idTarea,
                        id_usuario: idUsuario,
                    }),
                });

                const data = await response.json();

                if (data.ok || data.success) {
                    const modalElement = document.getElementById("modalAsignarMiembro");
                    const bsModal = bootstrap.Modal.getInstance(modalElement);
                    if (bsModal) {
                        bsModal.hide();
                    }
                    showSuccess(data.message || data.mensaje || "Miembro asignado correctamente.");

                    await getTareas();
                } else {

                   showError(data.message || data.mensaje || "Error al asignar el integrante.");
                }
            } catch (error) {
                console.error("Error en la petición de asignación:", error);
               showError("Ocurrió un error al intentar asignar la tarea.");
            }
        });
    }

    // Delegación en document instanciando el modal al hacer clic
    if (!listenerGlobalMiembroRegistrado) {
        listenerGlobalMiembroRegistrado = true;

        document.addEventListener("click", async (e) => {
            const btnAsignar = e.target.closest(".btn-asignar-usuario");
            if (!btnAsignar) return;

            e.preventDefault();

            const modalElement = document.getElementById("modalAsignarMiembro");
            if (!modalElement) return;

            let bsModal = bootstrap.Modal.getInstance(modalElement);
            if (!bsModal) {
                bsModal = new bootstrap.Modal(modalElement);
            }

            const idTarea = btnAsignar.dataset.id;
            const idEquipo = btnAsignar.dataset.equipo;
            const idUsuarioActual = btnAsignar.dataset.usuario;

            document.getElementById("idTareaAsignarMiembro").value = idTarea;

            await cargarMiembrosEquipo(idEquipo, idUsuarioActual);
            bsModal.show();
        });
    }
};