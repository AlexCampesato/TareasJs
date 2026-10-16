export const tablePermisoTemplate = (permisos) => {
    if (!permisos || permisos.length === 0) {
        return `
            <tr>
                <td colspan="4" class="text-center py-4 text-muted">
                    <i class="fas fa-users-slash fa-2x mb-2 d-block text-gray-300"></i>
                    No se encontraron permisos registrados
                </td>
            </tr>
        `;
    }

    return permisos
        .map(
            (permiso) => `
                <tr>
                    <td class="ps-4 fw-bold text-muted">
                        ${permiso.id}
                    </td>

                    <td class="fw-bold text-dark">
                        ${permiso.nombre}
                    </td>

                    <td class="text-muted small">
                        ${
                            permiso.descripcion ||
                            '<em class="text-black-50">Sin descripción</em>'
                        }
                    </td>

                    <td class="text-center pe-4">
                        <!-- Botón Ver Detalles -->
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-info me-1 btn-ver-permiso"
                            data-id="${permiso.id}"
                            title="Ver Detalles"
                        >
                            <i class="fas fa-eye"></i>
                        </button>

                        <!-- Botón Editar -->
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary me-1 btn-editar-permiso"
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
                    </td>
                </tr>
            `,
        )
        .join("");
};