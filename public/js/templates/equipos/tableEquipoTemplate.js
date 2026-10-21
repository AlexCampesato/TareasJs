export const tableEquipoTemplate = (equipos) => {
    if (!equipos || equipos.length === 0) {
        return `
            <tr>
                <td colspan="4" class="text-center py-4 text-muted">
                    <i class="fas fa-users-slash fa-2x mb-2 d-block text-gray-300"></i>
                    No se encontraron equipos registrados
                </td>
            </tr>
        `;
    }

    return equipos
        .map(
            (equipo) => `
                <tr>
                    <td class="ps-4 fw-bold text-muted">
                        ${equipo.id}
                    </td>

                    <td class="fw-bold text-dark">
                        ${equipo.nombre}
                    </td>

                    <td class="text-muted small">
                        ${
                            equipo.descripcion ||
                            '<em class="text-black-50">Sin descripción</em>'
                        }
                    </td>

                    <td class="text-center pe-4">
                        <!-- Botón Ver Detalles -->
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-info me-1 btn-ver-equipo"
                            data-id="${equipo.id}"
                            title="Ver Detalles"
                        >
                            <i class="fas fa-eye"></i>
                        </button>

                        <!-- Botón Editar -->
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary me-1 btn-editar-equipo"
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
                    </td>
                </tr>
            `,
        )
        .join("");
};