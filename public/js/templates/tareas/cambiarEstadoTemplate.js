export const cambiarEstadoTemplate = () => {
    return `
        <div class="modal fade" id="modalCambiarEstado" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-secondary text-white py-2">
                        <h6 class="modal-title m-0"><i class="fas fa-tasks me-2"></i>Cambiar Estado</h6>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formCambiarEstado">
                            <input type="hidden" id="idTareaCambiarEstado">
                            <div class="mb-3">
                                <label for="selectNuevoEstado" class="form-label small fw-bold">Seleccionar Nuevo Estado</label>
                                <select id="selectNuevoEstado" class="form-select form-select-sm" required>
                                    <option value="">Cargando estados...</option>
                                </select>
                            </div>
                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-sm btn-light border" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-sm btn-primary">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};