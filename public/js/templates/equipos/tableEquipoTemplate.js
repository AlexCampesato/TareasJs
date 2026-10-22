export const tableEquipoTemplate = (equipos) => {
    if (!equipos || equipos.length === 0) {
        return `
            <div class="col-12">
                <div class="text-center py-5 text-muted">
                    <i class="fas fa-users-slash fa-3x mb-3 d-block text-gray-300"></i>
                    <h5>No se encontraron equipos registrados</h5>
                </div>
            </div>
        `;
    }

    return equipos
        .map(
            (equipo) => `
                <div class="col-sm-6 col-xl-4 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-body d-flex flex-column">
                            
                            <!-- Cabecera de la Card (ID y Nombre del Equipo) -->
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span class="small text-muted fw-bold">ID: ${equipo.id}</span>
                                    <h5 class="card-title fw-bold text-dark mb-1">${equipo.nombre}</h5>
                                </div>
                            </div>

                            <!-- Descripción -->
                            <p class="card-text text-muted small mb-4">
                                ${
                                    equipo.descripcion ||
                                    '<em class="text-black-50">Sin descripción</em>'
                                }
                            </p>

                            <!-- Botones de Acción -->
                            <div class="d-flex justify-content-center gap-1 pt-3 border-top mt-auto">
                                <!-- Botón Ver Detalles -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-info btn-ver-equipo"
                                    data-id="${equipo.id}"
                                    title="Ver Detalles"
                                >
                                    <i class="fas fa-eye"></i>
                                </button>

                                <!-- Botón Editar -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-primary btn-editar-equipo"
                                    data-id="${equipo.id}"
                                    title="Editar Equipo"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>

                                <!-- Botón Eliminar -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-danger btn-eliminar-equipo"
                                    data-id="${equipo.id}"
                                    title="Eliminar Equipo"
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