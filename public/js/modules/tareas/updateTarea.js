import { tareaService } from "../../services/tareaService.js";
import { getTareas } from "./getTareas.js";
import { editTareaTemplate } from "../../templates/tareas/editTareaTemplate.js";
import { showError, showSuccess } from "../../ui/alert.js";

export const prepareEditTarea = async (id) => {
    let components = document.getElementById("dashboardComponents");

    if (!components) {
        components = document.createElement("div");
        components.id = "dashboardComponents";
        document.body.appendChild(components);
    }

    let modalEl = document.getElementById("modalTarea");

    if (!modalEl) {
        components.insertAdjacentHTML("beforeend", editTareaTemplate());
        modalEl = document.getElementById("modalTarea");
    }

    if (!modalEl) return;

    const selectEstado = document.getElementById("tareaIdEstado");

    try {
        const estadosResponse = await tareaService.getEstados();

        if (estadosResponse.ok && estadosResponse.estados && selectEstado) {
            selectEstado.innerHTML = `
                <option value="">Seleccione un estado</option>
                ${estadosResponse.estados
                    .filter(estado => {
                        const tipo = (estado.tipoEstado || "").toLowerCase();
                        return tipo !== 'expired' && tipo !== 'expirada';
                    })
                    .map(
                        (estado) => `
                            <option
                                value="${estado.id_estado}"
                                style="color: ${estado.color}; font-weight: 600;"
                            >
                                ${estado.tipoEstado}
                            </option>
                        `
                    )
                    .join("")}
            `;
        }

        const response = await tareaService.getById(id);

        if (!response.ok || !response.tarea) {
            throw new Error("No se pudo obtener el detalle de la tarea.");
        }

        const tarea = response.tarea;

        const inputId = document.getElementById("id_tarea") || document.getElementById("tareaId");
        const inputTitulo = document.getElementById("tareaTitulo");
        const inputDesc = document.getElementById("tareaDescripcion");
        const inputExpired = document.getElementById("tareaExpiredAt");
        const inputEstado = document.getElementById("tareaIdEstado");

        if (inputId) inputId.value = tarea.id || tarea.id_tarea || id;
        if (inputTitulo) inputTitulo.value = tarea.titulo || "";
        if (inputDesc) inputDesc.value = tarea.descripcion || "";
        
        if (inputExpired) {
            const hoy = new Date().toISOString().split('T')[0];
            inputExpired.min = hoy;
            inputExpired.value = tarea.expired_at ? tarea.expired_at.substring(0, 10) : "";
        }

        if (inputEstado) {
            inputEstado.value = tarea.fk_id_estado || tarea.id_estado || "";
        }

        initSubmitUpdateTarea();

        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();

    } catch (error) {
        console.error("Error al preparar edición de tarea:", error);
    }
};

export const initUpdateTarea = () => {
    if (!document.dataset) document.dataset = {};

    if (!document.dataset.listenerCambiarEstadoGlobal) {
        document.dataset.listenerCambiarEstadoGlobal = "true";

        document.addEventListener("click", async (e) => {
            const btnCambiarEstado = e.target.closest(".btn-cambiar-estado");
            if (!btnCambiarEstado) return;

            const idTarea = btnCambiarEstado.dataset.id;
            const estadoActual = Number(btnCambiarEstado.dataset.estado);

            const modalEl = document.getElementById("modalCambiarEstado");
            const selectEstado = document.getElementById("selectNuevoEstado");
            const inputId = document.getElementById("idTareaCambiarEstado");

            if (!modalEl || !selectEstado || !inputId) return;

            inputId.value = idTarea;

            try {
                const response = await tareaService.getEstados();
                if (response.ok && response.estados) {
                    selectEstado.innerHTML = response.estados
                      .filter((est) => {
                        const tipo = (est.tipoEstado || est.nombre || "").toLowerCase();
                        return tipo !== "expired" && tipo !== "expirada" && tipo !== "vencida"; 
                      })
                      .map(
                        (est) => `
                            <option 
                                value="${est.id_estado || est.id}" 
                                ${Number(est.id_estado || est.id) === estadoActual ? "selected" : ""}
                            >
                                ${est.tipoEstado || est.nombre}
                            </option>
                        `,
                      )
                      .join("");
                }
            } catch (err) {
                console.error("Error al cargar estados:", err);
            }

            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
            modalInstance.show();
        });

        initSubmitCambiarEstado();
    }

    //  Listener de Edición y Prioridad (Admin / Líder)
    if (!document.dataset.listenerEditGlobal) {
        document.dataset.listenerEditGlobal = "true";

        document.addEventListener("click", async (e) => {
            // Editar Tarea
            const btnEditar = e.target.closest(".btn-editar-tarea");
            if (btnEditar) {
                const id = btnEditar.dataset.id;
                if (id) await prepareEditTarea(id);
                return;
            }

            // Cambiar Prioridad
            const btnCambiarPrioridad = e.target.closest(".btn-cambiar-prioridad");
            if (btnCambiarPrioridad) {
                const idTarea = btnCambiarPrioridad.dataset.id;
                const prioridadActual = Number(btnCambiarPrioridad.dataset.prioridad || 2);

                const modalEl = document.getElementById("modalCambiarPrioridad");
                const selectPrioridad = document.getElementById("selectPrioridad");
                const inputId = document.getElementById("idTareaPrioridad");

                if (!modalEl || !selectPrioridad || !inputId) return;

                inputId.value = idTarea;

                try {
                    const response = await tareaService.getPrioridades();
                    if (response.ok && response.prioridades) {
                        selectPrioridad.innerHTML = response.prioridades
                            .map(
                                (prio) => `
                                <option 
                                    value="${prio.id}" 
                                    ${Number(prio.id) === prioridadActual ? "selected" : ""}
                                >
                                    ${prio.nombre}
                                </option>
                            `
                            )
                            .join("");
                    }
                } catch (err) {
                    console.error("Error al cargar prioridades:", err);
                }

                const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
                modalInstance.show();
                return;
            }
        });

        initSubmitCambiarPrioridad();
        initSubmitUpdateTarea();
    }
};

export const initSubmitCambiarEstado = () => {
    const form = document.getElementById("formCambiarEstado");
    const modalEl = document.getElementById("modalCambiarEstado");
    if (!form || !modalEl) return;

    if (!form.dataset.listenerSubmit) {
        form.dataset.listenerSubmit = "true";

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const idTarea = document.getElementById("idTareaCambiarEstado").value;
            const nuevoEstado = document.getElementById("selectNuevoEstado").value;

            if (!idTarea || !nuevoEstado) return;

            try {
                const response = await tareaService.update(idTarea, {
                    id_estado: nuevoEstado,
                    fk_id_estado: nuevoEstado
                });

                if (response.ok || response.success) {
                    const modalInstance = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
                    if (modalInstance) modalInstance.hide();

                    showSuccess("Estado actualizado correctamente");

                    const selectFiltro = document.getElementById("selectFiltroEstado");
                    await getTareas(selectFiltro ? Number(selectFiltro.value) : 0);
                } else {
                   const errorMsg = response.mensaje || response.message || "Error al actualizar estado";
                    console.error("Error al actualizar estado:", errorMsg);
                    showError(errorMsg);
                }
            } catch (error) {
                console.error("Error en la petición de cambiar estado:", error);
                showError(error.message || "Error al actualizar el estado");
            }
        });
    }
};

export const initSubmitCambiarPrioridad = () => {
    const form = document.getElementById("formCambiarPrioridad");
    const modalEl = document.getElementById("modalCambiarPrioridad");
    if (!form || !modalEl) return;

    if (!form.dataset.listenerSubmit) {
        form.dataset.listenerSubmit = "true";

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const idTarea = document.getElementById("idTareaPrioridad").value;
            const nuevaPrioridad = document.getElementById("selectPrioridad").value;

            if (!idTarea || !nuevaPrioridad) return;

            try {
                const response = await tareaService.actualizarPrioridad(idTarea, nuevaPrioridad);

                if (response.ok || response.success) {
                    const modalInstance = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
                    if (modalInstance) modalInstance.hide();

                    showSuccess("Prioridad actualizada correctamente");

                    const selectFiltro = document.getElementById("selectFiltroEstado");
                    await getTareas(selectFiltro ? Number(selectFiltro.value) : 0);
                } else {
                    const errorMsg = response.mensaje || response.message || "Error al actualizar prioridad";
                    console.error("Error al actualizar prioridad:", errorMsg);
                    showError(errorMsg);
                }
            } catch (error) {
                console.error("Error en la petición de cambiar prioridad:", error);
                showError(error.message || "Error al actualizar la prioridad");
            }
        });
    }
};

export const initSubmitUpdateTarea = () => {
    const formTarea = document.getElementById("formTarea");
    const modalEl = document.getElementById("modalTarea");

    if (!formTarea || !modalEl) return;

    if (!formTarea.dataset.listenerSubmit) {
        formTarea.dataset.listenerSubmit = "true";

        formTarea.addEventListener("submit", async (e) => {
            e.preventDefault();

            const inputId = document.getElementById("id_tarea") || document.getElementById("tareaId");
            const idTarea = inputId ? inputId.value : null;

            if (!idTarea) return;

            const formData = new FormData(formTarea);
            const data = Object.fromEntries(formData.entries());

            delete data.id_tarea;
            delete data.tareaId;

            try {
                const response = await tareaService.update(idTarea, data);

                if (!response.ok && !response.success) {
                    throw new Error(
                        response.mensaje || response.message || "No se pudo actualizar la tarea."
                    );
                }

                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) modalInstance.hide();

                formTarea.reset();

                showSuccess("Tarea actualizada correctamente.");

                const selectFiltro = document.getElementById("selectFiltroEstado");
                await getTareas(selectFiltro ? Number(selectFiltro.value) : 0);

            } catch (error) {
                console.error("Error al actualizar tarea:", error);
                showError(error.message || "Error al actualizar la tarea");
            }
        });
    }
};