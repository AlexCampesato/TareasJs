export const asignarMiembroTemplate = () => {
    return `
        <div class="modal fade" id="modalAsignarMiembro" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title"><i class="fas fa-user-plus me-2"></i>Asignar Miembro de Equipo</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formAsignarMiembro">
                            <input type="hidden" id="idTareaAsignarMiembro">
                            <div class="mb-3">
                                <label for="selectUsuarioAsignar" class="form-label fw-bold">Seleccionar Integrante</label>
                                <select id="selectUsuarioAsignar" class="form-select" required>
                                    <option value="">Cargando miembros...</option>
                                </select>
                            </div>
                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-info text-white btn-sm">Asignar Tarea</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};