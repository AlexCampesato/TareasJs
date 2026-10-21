export const tableRolTemplate = (roles) => {
    if (!roles || roles.length === 0) {
        return `
            <tr>
                <td colspan="4" class="text-center py-4 text-muted">
                    <i class="fas fa-users-slash fa-2x mb-2 d-block text-gray-300"></i>
                    No se encontraron roles registrados
                </td>
            </tr>
        `;
    }

    return roles
        .map(
            (rol) => `
                <tr>
                    <td class="ps-4 fw-bold text-muted">${rol.id}</td>
                    <td class="fw-bold text-dark">${rol.nombre}</td>
                    <td class="text-muted small">
                        ${rol.descripcion || '<em class="text-black-50">Sin descripción</em>'}
                    </td>
                    <td class="text-center pe-4">
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-info me-1 btn-ver-rol btn-accion-ver"
                            data-id="${rol.id}"
                            title="Ver Detalles"
                        >
                            <i class="fas fa-eye"></i>
                        </button>

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary me-1 btn-editar-rol btn-accion-editar"
                            data-id="${rol.id}"
                            title="Editar Rol"
                        >
                            <i class="fas fa-edit"></i>
                        </button>

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger btn-eliminar-rol btn-accion-eliminar"
                            data-id="${rol.id}"
                            title="Eliminar rol"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `,
        )
        .join("");
};
