export const tableTareaTemplate = (tareas) => {
    if (!tareas || tareas.length === 0) {
        return `
            <div class="col-12">
                <div class="text-center py-5 text-muted">
                    <i class="fas fa-inbox fa-3x mb-3 d-block text-gray-300"></i>
                    <h5>No se encontraron tareas registradas</h5>
                </div>
            </div>
        `;
    }

    return tareas
        .map(
            (tarea, index) => `
                <div class="col-sm-6 col-xl-4 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-body d-flex flex-column">
                            
                            <!-- Cabecera de la Card (Índice/Título y Estado) -->
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span class="small text-muted fw-bold">#${index + 1}</span>
                                    <h5 class="card-title fw-bold text-dark mb-1">${tarea.titulo}</h5>
                                </div>
                                <div>
                                    <span
                                        class="badge rounded-pill px-2 py-1"
                                        style="background-color: ${tarea.color || "#6c757d"};"
                                    >
                                        ${tarea.tipoEstado || "Pendiente"}
                                    </span>
                                </div>
                            </div>

                            <!-- Descripción -->
                            <p class="card-text text-muted small mb-3">
                                ${
                                    tarea.descripcion ||
                                    '<em class="text-black-50">Sin descripción</em>'
                                }
                            </p>

                            <!-- Fechas (Alta y Vencimiento) -->
                            <div class="mb-3 mt-auto bg-light p-2 rounded small">
                                <div class="text-muted">
                                    <i class="fas fa-calendar-alt me-1 text-secondary"></i> Alta: <strong>${tarea.created_at || "-"}</strong>
                                </div>
                                <div class="text-muted mt-1">
                                    <i class="fas fa-clock me-1 text-secondary"></i> Vencimiento: <strong>${tarea.expired_at || "Sin fecha"}</strong>
                                </div>
                            </div>

                            <!-- Botones de Acción -->
                            <div class="d-flex justify-content-center gap-1 pt-3 border-top">
                                <!-- Botón Editar -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-primary btn-editar-tarea"
                                    data-id="${tarea.id_tarea}"
                                    title="Editar Tarea"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>

                                <!-- Botón Eliminar -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-danger btn-eliminar-tarea"
                                    data-id="${tarea.id_tarea}"
                                    title="Eliminar Tarea"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            `,
        )
        .join("");
};