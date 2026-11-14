export const asignarEquipoTemplate = () => {
    return `
        <div class="modal fade" id="modalAsignarEquipo" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form id="formAsignarEquipo">
                        <div class="modal-header">
                            <h5 class="modal-title">Asignar Equipo a Tarea</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" id="idTareaAsignar" name="id_tarea">
                            <div class="mb-3">
                                <label for="selectEquipoAsignar" class="form-label">Seleccionar Equipo</label>
                                <select class="form-select" id="selectEquipoAsignar" name="id_equipo" required>
                                    <option value="">Cargando equipos...</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-success">Guardar asignación</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
};