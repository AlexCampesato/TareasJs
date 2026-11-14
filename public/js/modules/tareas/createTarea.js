import { tareaService } from "../../services/tareaService.js";
import { getTareas } from "./getTareas.js";
import { createTareaTemplate } from "../../templates/tareas/createTareaTemplate.js";
import {showSuccess, showError} from "../../ui/alert.js";

export const initCreateTarea = () => {
    const btnNueva = document.getElementById("btnNuevaTarea");

    if (!btnNueva) return;

    btnNueva.addEventListener("click", async () => {
        const components = document.getElementById("dashboardComponents");

        if (!components) return;

        // Renderizar el componente del modal
        components.innerHTML = createTareaTemplate();

        const modalEl = document.getElementById("modalNuevaTarea");
        const formTarea = document.getElementById("formNuevaTarea");
        const selectEstado = document.getElementById("estadoTarea");
        const inputExpired = document.getElementById("expired_at");
        
        if (!modalEl || !formTarea || !selectEstado) return;

        if (inputExpired) {
            const hoy = new Date().toISOString().split('T')[0];
            inputExpired.min = hoy;
        }

        try {
            // Obtener estados desde el backend
            const response = await tareaService.getEstados();

      if (response.ok && response.estados) {
        selectEstado.innerHTML = `
        <option value="">Seleccione un estado</option>

        ${response.estados
            .filter(estado => {
                        const tipo = (estado.tipoEstado || "").toLowerCase();
                        return tipo !== 'expired' && tipo !== 'expirada'; // 🟢 Excluimos el estado automático
                    })
            .map(
               (estado) => `
                    <option
                        value="${estado.id_estado}"
                        style="color: ${estado.color};"
                    >
                        ${estado.tipoEstado}
                    </option>
                `
          )
          .join("")}
    `;
      }

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();

    if (!formTarea.dataset.listenerSubmit) {
                formTarea.dataset.listenerSubmit = "true";
    formTarea.addEventListener("submit", async (e) => {
                e.preventDefault();

        const formData = new FormData(formTarea);
        const data = Object.fromEntries(formData.entries());

        const titulo = (data.titulo || "").trim();
        const descripcion = (data.descripcion || "").trim();
        const expiredAt = data.expired_at || "";

        if (titulo.length < 3) {
                        showError("El título es obligatorio y debe tener al menos 3 caracteres.");
                        return;
                    }

                    if (descripcion === "") {
                        showError("La descripción de la tarea es obligatoria.");
                        return;
                    }

                    if (!expiredAt) {
                        showError("Debe seleccionar una fecha de vencimiento.");
                        return;
                    }

            try {
                    const apiResponse = await tareaService.create(data);

                    // Validar si el backend respondió con un error 
                    if (apiResponse && (!apiResponse.ok && !apiResponse.success)) {
                            throw new Error(apiResponse.mensaje || apiResponse.message || "No se pudo crear la tarea.");
                        }

                    modalInstance.hide();
                    formTarea.reset();

                    showSuccess("Tarea creada exitosamente.");

                    const selectFiltro =
                        document.getElementById("selectFiltroEstado");

                    await getTareas(
                        selectFiltro ? selectFiltro.value : 0,
                    );
                } catch (error) {
                    console.error(
                        "Error al crear tarea:",
                        error,
                    );
                    showError(error.message || "Error al crear la tarea.");
                }
            });
        }
        } catch (error) {
            console.error("Error al cargar los estados:", error,);
        }
    });
};