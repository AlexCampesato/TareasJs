export const tableUsuarioTemplate = (usuarios) => {
    if (!usuarios || usuarios.length === 0) {
        return `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    <i class="fas fa-users-slash fa-2x mb-2 d-block text-gray-300"></i>
                    No se encontraron usuarios registrados
                </td>
            </tr>
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
                <tr class="${!esActivo ? 'table-light text-muted' : ''}">
                    <td class="ps-4 fw-bold text-muted">${usuario.id}</td>
                    <td class="fw-bold text-dark">${usuario.nombre} ${usuario.apellido || ''}</td>
                    <td class="text-dark">${usuario.email}</td>
                    <td class="fw-bold text-dark">
                        ${usuario.rol_nombre ? `<span class="badge bg-primary">${usuario.rol_nombre}</span>` : '<span class="badge bg-secondary">Sin rol</span>'}
                    </td>
                    <td class="fw-bold text-dark">
                        ${usuario.equipo_nombre || '<span class="badge bg-light text-dark border">Sin equipo</span>'}
                    </td>
                    <td>${badgeEstado}</td>
                    <td class="text-center pe-4">
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-info me-1 btn-ver-usuario btn-accion-ver"
                            data-id="${usuario.id}"
                            title="Ver Detalles"
                        >
                            <i class="fas fa-eye"></i>
                        </button>

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary me-1 btn-editar-usuario btn-accion-editar"
                            data-id="${usuario.id}"
                            title="Editar Usuario"
                        >
                            <i class="fas fa-edit"></i>
                        </button>

                        <button
                            type="button"
                            class="btn btn-sm ${btnEstadoClass} me-1 btn-estado-usuario btn-accion-estado"
                            data-id="${usuario.id}"
                            data-activo="${esActivo ? 1 : 0}"
                            title="${btnEstadoTitle}"
                        >
                            <i class="fas ${btnEstadoIcon}"></i>
                        </button>

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger btn-eliminar-usuario btn-accion-eliminar"
                            data-id="${usuario.id}"
                            title="Eliminar Usuario"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        })
        .join("");
};
