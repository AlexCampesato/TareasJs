export const tableUsuarioTemplate = (usuarios) => {
    if (!usuarios || usuarios.length === 0) {
        return `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    <i class="fas fa-users-slash fa-2x mb-2 d-block text-gray-300"></i>
                    No se encontraron usuarios registrados
                </td>
            </tr>
        `;
    }

    return usuarios
        .map(
            (usuario) => `
                <tr>
                    <td class="ps-4 fw-bold text-muted">
                        ${usuario.id}
                    </td>

                    <td class="fw-bold text-dark">
                        ${usuario.nombre} 
                        ${usuario.apellido}
                    </td>

                    <td class="fw-bold text-dark">
                        ${usuario.email}
                    </td>
                    
                    <td class="fw-bold text-dark">
                        ${usuario.rol_nombre || '<span class="badge bg-secondary">Sin rol</span>'}
                    </td>
                    
                    <td class="fw-bold text-dark">
                        ${usuario.equipo_nombre || '<span class="badge bg-light text-dark border">Sin equipo</span>'}
                    </td>

                    <td class="text-center pe-4">
                        <!-- Botón Ver Detalles -->
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-info me-1 btn-ver-usuario"
                            data-id="${usuario.id}"
                            title="Ver Detalles"
                        >
                            <i class="fas fa-eye"></i>
                        </button>

                        <!-- Botón Editar -->
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary me-1 btn-editar-usuario"
                            data-id="${usuario.id}"
                            title="Editar Usuario"
                        >
                            <i class="fas fa-edit"></i>
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
                    </td>
                </tr>
            `
        )
        .join("");
};