export const tableUsuarioTemplate = (usuarios) => {
    if (!usuarios || usuarios.length === 0) {
        return `
            <div class="col-12">
                <div class="text-center py-5 text-muted">
                    <i class="fas fa-users-slash fa-3x mb-3 d-block text-gray-300"></i>
                    <h5>No se encontraron usuarios registrados</h5>
                </div>
            </div>
        `;
    }

    return usuarios
        .map((usuario) => {
            const esActivo = usuario.activo === undefined || parseInt(usuario.activo) === 1;
            const badgeEstado = esActivo
                ? '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>Activo</span>'
                : '<span class="badge bg-danger"><i class="fas fa-ban me-1"></i>Inactivo</span>';

            const btnEstadoClass = esActivo ? 'btn-outline-warning' : 'btn-outline-success';
            const btnEstadoIcon = esActivo ? 'fa-user-slash' : 'fa-user-check';
            const btnEstadoTitle = esActivo ? 'Desactivar Usuario' : 'Activar Usuario';

            return `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 shadow-sm border-0 ${!esActivo ? 'bg-light text-muted' : ''}">
                        <div class="card-body d-flex flex-column">
                            
                            <!-- Cabecera de la Card (ID, Nombre y Estado) -->
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span class="small text-muted fw-bold">ID: ${usuario.id}</span>
                                    <h5 class="card-title fw-bold text-dark mb-1">${usuario.nombre} ${usuario.apellido || ''}</h5>
                                </div>
                                <div>
                                    ${badgeEstado}
                                </div>
                            </div>

                            <!-- Email -->
                            <p class="card-text text-muted small mb-3">
                                <i class="fas fa-envelope me-1 text-secondary"></i> ${usuario.email}
                            </p>

                            <!-- Rol y Equipo -->
                            <div class="mb-3 mt-auto">
                                <div class="mb-1">
                                    <span class="small text-muted d-block">Rol:</span>
                                    ${usuario.rol_nombre ? `<span class="badge bg-primary">${usuario.rol_nombre}</span>` : '<span class="badge bg-secondary">Sin rol</span>'}
                                </div>
                                <div class="mt-2">
                                    <span class="small text-muted d-block">Equipo:</span>
                                    ${usuario.equipo_nombre || '<span class="badge bg-light text-dark border">Sin equipo</span>'}
                                </div>
                            </div>

                            <!-- Botones de Acción -->
                            <div class="d-flex justify-content-center gap-1 pt-3 border-top">
                                <!-- Botón Ver Detalles -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-info btn-ver-usuario"
                                    data-id="${usuario.id}"
                                    title="Ver Detalles"
                                >
                                    <i class="fas fa-eye"></i>
                                </button>

                                <!-- Botón Editar -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-primary btn-editar-usuario"
                                    data-id="${usuario.id}"
                                    title="Editar Usuario"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>

                                <!-- Botón Activar / Desactivar -->
                                <button
                                    type="button"
                                    class="btn btn-sm ${btnEstadoClass} btn-estado-usuario"
                                    data-id="${usuario.id}"
                                    data-activo="${esActivo ? 1 : 0}"
                                    title="${btnEstadoTitle}"
                                >
                                    <i class="fas ${btnEstadoIcon}"></i>
                                </button>

                                <!-- Botón Eliminar -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-danger btn-eliminar-usuario"
                                    data-id="${usuario.id}"
                                    title="Eliminar Usuario"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            `;
        })
        .join("");
};