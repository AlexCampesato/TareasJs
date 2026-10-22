export const tablePermisoTemplate = (permisos) => {
    if (!permisos || permisos.length === 0) {
        return `
            <div class="col-12">
                <div class="text-center py-5 text-muted">
                    <i class="fas fa-users-slash fa-3x mb-3 d-block text-gray-300"></i>
                    <h5>No se encontraron permisos registrados</h5>
                </div>
            </div>
        `;
    }

    return permisos
        .map(
            (permiso) => `
                <div class="col-sm-6 col-xl-4 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-body d-flex flex-column">
                            
                            <!-- Cabecera de la Card (ID y Nombre del Permiso) -->
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span class="small text-muted fw-bold">ID: ${permiso.id}</span>
                                    <h5 class="card-title fw-bold text-dark mb-1">${permiso.nombre}</h5>
                                </div>
                            </div>

                            <!-- Descripción -->
                            <p class="card-text text-muted small mb-4">
                                ${
                                    permiso.descripcion ||
                                    '<em class="text-black-50">Sin descripción</em>'
                                }
                            </p>

                            <!-- Botones de Acción -->
                            <div class="d-flex justify-content-center gap-1 pt-3 border-top mt-auto">
                                <!-- Botón Ver Detalles -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-info btn-ver-permiso"
                                    data-id="${permiso.id}"
                                    title="Ver Detalles"
                                >
                                    <i class="fas fa-eye"></i>
                                </button>

                                <!-- Botón Editar -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-primary btn-editar-permiso"
                                    data-id="${permiso.id}"
                                    title="Editar Permiso"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>

                                <!-- Botón Eliminar -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-danger btn-eliminar-permiso"
                                    data-id="${permiso.id}"
                                    title="Eliminar Permiso"
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