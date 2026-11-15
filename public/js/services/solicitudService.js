import { httpClient } from "../utils/httpClient.js"; 
import { prepareEditTarea } from "../modules/tareas/updateTarea.js";

export const solicitudService = {
    async getPendientes() {
        return await httpClient("/api/solicitudes/pendientes");
    }
};

export const actualizarContadorSolicitudes = async () => {
    try {
        // Podemos usar el service en lugar de fetch directo para mantener la arquitectura prolija
        const data = await solicitudService.getPendientes();

        const badge = document.getElementById("badgeSolicitudesCount");
        if (!badge) return;

        const cantidad = Array.isArray(data.solicitudes) ? data.solicitudes.length : (data.count || 0);

        if (cantidad > 0) {
            badge.textContent = cantidad;
            badge.style.display = "inline-block"; // Muestra el número rojo si hay pendientes
        } else {
            badge.style.display = "none"; // Lo oculta si está en 0
        }
    } catch (error) {
        console.error("Error al actualizar el contador de solicitudes:", error);
    }
};

export const initModalSolicitudes = () => {
    const modalSolicitudesEl = document.getElementById("modalSolicitudes");
    if (!modalSolicitudesEl) return;

    if (!modalSolicitudesEl.dataset.listenerModal) {
        modalSolicitudesEl.dataset.listenerModal = "true";

        modalSolicitudesEl.addEventListener("show.bs.modal", async () => {
            const listaHtml = document.getElementById("listaSolicitudes");
            if (!listaHtml) return;

            listaHtml.innerHTML = `<li class="list-group-item text-center py-4 text-muted"><i class="fas fa-spinner fa-spin me-2"></i> Cargando solicitudes...</li>`;

            try {
                const data = await solicitudService.getPendientes();

                if (data.ok && data.solicitudes && data.solicitudes.length > 0) {
                    listaHtml.innerHTML = data.solicitudes.map(sol => `
                        <li class="list-group-item py-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="badge bg-danger mb-1">Extensión de fecha</span>
                                    <h6 class="mb-0 fw-bold">Tarea: ${sol.tarea_titulo}</h6>
                                    <small class="text-muted">Solicitado por: ${sol.usuario_nombre} ${sol.usuario_apellido}</small>
                                </div>
                                <button 
                                    type="button" 
                                    class="btn btn-sm btn-outline-dark btn-revisar-solicitud" 
                                    data-bs-dismiss="modal" 
                                    data-id-tarea="${sol.id_tarea}"
                                    title="Ir a editar tarea">
                                    <i class="fas fa-edit"></i> Revisar
                                </button>
                            </div>
                        </li>
                    `).join("");
                } else {
                    listaHtml.innerHTML = `<li class="list-group-item text-center py-4 text-muted fst-italic">No hay solicitudes pendientes.</li>`;
                }
            } catch (error) {
                console.error("Error al cargar solicitudes:", error);
                listaHtml.innerHTML = `<li class="list-group-item text-center py-4 text-danger">Error de conexión.</li>`;
            }
        });
    }

    // Evento global para el botón "Revisar" dentro de la lista de solicitudes
    if (!document.dataset) document.dataset = {};
    if (!document.dataset.listenerRevisarSolicitud) {
        document.dataset.listenerRevisarSolicitud = "true";
        
        document.addEventListener("click", async (e) => {
            const btnRevisar = e.target.closest(".btn-revisar-solicitud");
            if (!btnRevisar) return;
            
            const idTarea = btnRevisar.dataset.idTarea;
            if (!idTarea) return;

            try {
                await prepareEditTarea(idTarea);
            } catch (error) {
                console.error("Error al abrir la edición de la tarea desde la solicitud:", error);
            }
        });
    }
};