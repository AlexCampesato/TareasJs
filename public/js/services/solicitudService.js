import { httpClient } from "../utils/httpClient.js"; 

export const solicitudService = {
    async getPendientes() {
        return await httpClient("/api/solicitudes/pendientes");
    }
};

export const initModalSolicitudes = () => {
    const modalSolicitudesEl = document.getElementById("modalSolicitudes");
    if (!modalSolicitudesEl) return;

    modalSolicitudesEl.addEventListener("show.bs.modal", async () => {
        const listaHtml = document.getElementById("listaSolicitudes");
        listaHtml.innerHTML = `<li class="list-group-item text-center py-4 text-muted"><i class="fas fa-spinner fa-spin me-2"></i> Cargando solicitudes...</li>`;

        try {
            
            const data = await solicitudService.getPendientes();

            if (data.ok && data.solicitudes.length > 0) {
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
};


document.addEventListener("click", async (e) => {
    const btnRevisar = e.target.closest(".btn-revisar-solicitud");
    if (!btnRevisar) return;

    const idTarea = btnRevisar.dataset.idTarea;

    if (window.abrirModalEditarTarea) {
        window.abrirModalEditarTarea(idTarea);
    } else {
        const btnEditarEnCard = document.querySelector(`.btn-editar-tarea[data-id="${idTarea}"]`) 
                             || document.querySelector(`tr[data-id="${idTarea}"] .btn-editar`);
        
        if (btnEditarEnCard) {
            btnEditarEnCard.click();
        } else {
            console.log("ID de tarea a revisar:", idTarea);
        }
    }
});