export const prioridadTemplate = () => {
    return `
         <div class="modal fade" id="modalCambiarPrioridad" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-sm">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-warning text-dark py-2">
                            <h6 class="modal-title fw-bold m-0"><i class="fas fa-flag me-2"></i>Cambiar Prioridad</h6>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formCambiarPrioridad">
                                <input type="hidden" id="idTareaPrioridad">
                                <div class="mb-3">
                                    <label for="selectPrioridad" class="form-label small fw-bold">Nivel de Prioridad</label>
                                    <select id="selectPrioridad" class="form-select form-select-sm" required>
                                        <option value="">Cargando prioridades...</option>
                                    </select>
                                </div>
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="btn btn-sm btn-light border" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-sm btn-warning text-dark fw-bold">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    `;
};