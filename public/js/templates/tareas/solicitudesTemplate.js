export const solicitudesTemplate = () => {
    return `
        <div class="modal fade" id="modalSolicitudes" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-warning text-dark py-2">
                        <h6 class="modal-title fw-bold m-0"><i class="fas fa-inbox me-2"></i>Solicitudes Pendientes</h6>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0">
                        <ul class="list-group list-group-flush" id="listaSolicitudes">
                            <li class="list-group-item text-center py-4 text-muted">
                                <i class="fas fa-spinner fa-spin me-2"></i> Cargando solicitudes...
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
};