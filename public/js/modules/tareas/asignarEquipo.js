import { getTareas } from "./getTareas.js";
import {showSuccess, showError} from "../../ui/alert.js";

// Carga los equipos y marca como seleccionado el idEquipoActual si existe
const cargarEquipos = async (idEquipoActual = null) => {
    const selectEquipo = document.getElementById("selectEquipoAsignar");
    if (!selectEquipo) return;

    try {
        const response = await fetch("/proyecto-tareas/api/equipos");
        const data = await response.json();

        const esValido = data.success === true || data.ok === true;
        const listaEquipos = Array.isArray(data.equipos) ? data.equipos : [];

        if (esValido && listaEquipos.length > 0) {
            selectEquipo.innerHTML = `
                <option value="">-- Sin equipo (Desasignar) --</option>
                ${listaEquipos
                    .map((equipo) => {
                        const esSeleccionado = String(equipo.id) === String(idEquipoActual) ? "selected" : "";
                        return `<option value="${equipo.id}" ${esSeleccionado}>${equipo.nombre}</option>`;
                    })
                    .join("")}
            `;
        } else {
            selectEquipo.innerHTML = `<option value="">No hay equipos registrados</option>`;
        }
    } catch (error) {
        console.error("Error al cargar equipos:", error);
        selectEquipo.innerHTML = `<option value="">Error al cargar equipos</option>`;
    }
};

let listenerGlobalRegistrado = false;

export const initAsignarEquipo = () => {
    const formAsignar = document.getElementById("formAsignarEquipo");
    if (!formAsignar) return;

    // para el envío del formulario
    if (!formAsignar.dataset.listener) {
        formAsignar.dataset.listener = "true";

        formAsignar.addEventListener("submit", async (e) => {
            e.preventDefault();

            const idTarea = document.getElementById("idTareaAsignar").value;
            const idEquipo = document.getElementById("selectEquipoAsignar").value;

            try {
                const response = await fetch("/proyecto-tareas/api/tareas/asignar-equipo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id_tarea: idTarea,
                        id_equipo: idEquipo,
                    }),
                });

                const data = await response.json();

                if (data.ok || data.success) {
                    const modalElement = document.getElementById("modalAsignarEquipo");
                    const bsModal = bootstrap.Modal.getInstance(modalElement);
                    if (bsModal) {
                        bsModal.hide();
                    }
                    showSuccess(data.message || data.mensaje || "Equipo actualizado correctamente.");
                    await getTareas();
                } else {
                    showError(data.message || data.mensaje || "Error al actualizar el equipo.");
                }
            } catch (error) {
                console.error("Error en la petición de asignación:", error);
                showError("Ocurrió un error al intentar actualizar el equipo.");
            }
        });
    }

    // Delegación en document instanciando el modal al momento del clic
    if (!listenerGlobalRegistrado) {
        listenerGlobalRegistrado = true;

        document.addEventListener("click", async (e) => {
            const btnAsignar = e.target.closest(".btn-asignar-equipo");
            if (!btnAsignar) return;

            e.preventDefault();

            const modalElement = document.getElementById("modalAsignarEquipo");
            if (!modalElement) return;

            // Obtenemos la instancia del modal en el momento del clic
            let bsModal = bootstrap.Modal.getInstance(modalElement);
            if (!bsModal) {
                bsModal = new bootstrap.Modal(modalElement);
            }

            const idTarea = btnAsignar.dataset.id;
            const idEquipoActual = btnAsignar.dataset.equipo;

            document.getElementById("idTareaAsignar").value = idTarea;

            await cargarEquipos(idEquipoActual);
            bsModal.show();
        });
    }
};