export const tableTareaTemplate = (tareas, user = null) => {
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

    // Lectura de rol
    const idRol = user ? Number(user.id_rol ?? user.fk_id_rol ?? 0) : 0;
    const esAdmin = idRol === 1;
    const esLider = idRol === 2;
    const esMiembro = idRol === 3;

    // Lectura del ID de usuario autenticado
    const idUsuarioActual = user ? String(user.id ?? user.id_usuario ?? user.fk_id_usuario ?? "") : "";

    const esVencida = (fechaVencimiento) => {
        if (!fechaVencimiento) return false;
        // Tomamos solo la parte YYYY-MM-DD si viene con hora
        const fechaSolo = fechaVencimiento.split(" ")[0];
        const hoy = new Date().toISOString().split("T")[0];
        return fechaSolo < hoy;
    };

    return tareas
        .map((tarea, index) => {
            
            const idTareaReal = tarea.id || tarea.id_tarea;

            // 1. Lógica de botones de delegación (Admin / Líder)
            let btnDelegacion = "";

            if (esAdmin) {
                if (!tarea.fk_id_equipo) {
                    btnDelegacion = `
                        <button
                            type="button"
                            class="btn btn-sm btn-success fw-semibold shadow-sm btn-asignar-equipo px-3"
                            data-id="${idTareaReal}"
                            title="Asignar Equipo"
                        >
                            <i class="fas fa-users me-1" style="pointer-events: none;"></i> Asignar Equipo
                        </button>
                    `;
                } else {
                    btnDelegacion = `
                        <button
                            type="button"
                            class="btn btn-sm btn-warning text-dark fw-bold shadow-sm btn-asignar-equipo px-3"
                            data-id="${idTareaReal}"
                            data-equipo="${tarea.fk_id_equipo}"
                            title="Reasignar Equipo"
                        >
                            <i class="fas fa-sync-alt me-1" style="pointer-events: none;"></i> Reasignar Equipo
                        </button>
                    `;
                }
            } else if (esLider && tarea.fk_id_equipo) {
                const textoBoton = tarea.fk_id_usuario_asignado ? "Reasignar Miembro" : "Asignar Miembro";
                
                const claseBoton = tarea.fk_id_usuario_asignado 
                    ? "btn-warning text-dark fw-bold" 
                    : "btn-info text-white fw-bold";

                btnDelegacion = `
                    <button
                        type="button"
                        class="btn btn-sm ${claseBoton} shadow-sm btn-asignar-usuario px-3"
                        data-id="${idTareaReal}"
                        data-equipo="${tarea.fk_id_equipo}"
                        data-usuario="${tarea.fk_id_usuario_asignado || ''}"
                        title="${textoBoton}"
                    >
                        <i class="fas fa-user-plus me-1" style="pointer-events: none;"></i> ${textoBoton}
                    </button>
                `;
            }

            // 2. Botón de cambio de Prioridad (Admin / Líder)
            let btnPrioridad = "";
            if (esAdmin || esLider) {
                btnPrioridad = `
                    <button
                        type="button"
                        class="btn btn-sm btn-primary text-white fw-semibold btn-cambiar-prioridad px-2.5"
                        data-id="${idTareaReal}"
                        data-prioridad="${tarea.fk_id_prioridad || 2}"
                        title="Establecer Prioridad"
                    >
                        <i class="fas fa-flag me-1" style="pointer-events: none;"></i> Prioridad
                    </button>
                `;
            }

            // 3. Botón de cambio de estado (Miembro asignado)
            let btnCambiarEstadoMiembro = "";
            const idAsignado = String(tarea.fk_id_usuario_asignado ?? "");

            if (esMiembro && idAsignado !== "" && idAsignado === idUsuarioActual) {
                btnCambiarEstadoMiembro = `
                    <button
                        type="button"
                        class="btn btn-sm btn-dark fw-semibold shadow-sm btn-cambiar-estado px-3"
                        data-id="${idTareaReal}"
                        data-estado="${tarea.fk_id_estado}"
                        title="Cambiar Estado"
                    >
                        <i class="fas fa-tasks me-1" style="pointer-events: none;"></i> Cambiar Estado
                    </button>
                `;
            }

            return `
            <div class="col-sm-6 col-xl-3 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body d-flex flex-column">
                        
                        <!-- Cabecera de la Card (Índice/Título, Prioridad y Estado) -->
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <span class="small text-muted fw-bold">#${index + 1}</span>
                                <h5 class="card-title fw-bold text-dark mb-1">${tarea.titulo}</h5>
                            </div>
                            <div class="d-flex align-items-center gap-1">
                                <!-- Badge de Prioridad -->
                                <span 
                                    class="badge rounded-pill fw-bold me-1 shadow-sm text-dark"
                                    style="background-color: ${tarea.color_prioridad || "#0dcaf0"}; font-size: 0.75rem;"
                                >
                                    <i class="fas fa-exclamation-circle me-1"></i>Prioridad: ${tarea.nombre_prioridad || "Media"}
                                </span>
                                <!-- Badge de Estado -->
                                <span
                                    class="badge rounded-pill px-3 py-1.5 fw-bold text-white shadow-sm"
                                    style="background-color: ${tarea.color || "#4e73df"}; font-size: 0.8rem;"
                                >
                                    ${tarea.tipoEstado || "Pendiente"}
                                </span>
                            </div>
                        </div>

                        <!-- Descripción -->
                        <p class="card-text text-muted mb-3" style="font-size: 0.9rem;">
                            ${
                                tarea.descripcion ||
                                '<em class="text-black-50">Sin descripción</em>'
                            }
                        </p>

                        <!-- Información de Equipo y Usuario Asignado -->
                        <div class="d-flex flex-wrap gap-2 mb-2">
                            ${
                                tarea.nombre_equipo
                                    ? `<span class="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle px-2.5 py-1.5" style="font-size: 0.82rem;">
                                        <i class="fas fa-users me-1 text-primary"></i> Equipo: <strong>${tarea.nombre_equipo}</strong>
                                       </span>`
                                    : `<span class="badge bg-body-secondary text-secondary-emphasis border px-2.5 py-1.5" style="font-size: 0.82rem;">
                                        <i class="fas fa-users me-1"></i> Sin equipo
                                       </span>`
                            }

                            ${
                                tarea.nombre_usuario_asignado
                                    ? `<span class="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2.5 py-1.5" style="font-size: 0.82rem;">
                                        <i class="fas fa-user me-1 text-info"></i> Asignado: <strong>${tarea.nombre_usuario_asignado} ${tarea.apellido_usuario_asignado || ''}</strong>
                                       </span>`
                                    : `<span class="badge bg-body-secondary text-secondary-emphasis border px-2.5 py-1.5" style="font-size: 0.82rem;">
                                        <i class="fas fa-user-slash me-1"></i> Sin asignar
                                       </span>`
                            }
                        </div>

                        <!-- Fechas (Alta y Vencimiento) -->
                            <div class="my-3 mt-auto bg-body-tertiary p-3 rounded border-start border-3 ${esVencida(tarea.expired_at) ? 'border-danger' : 'border-secondary-subtle'}" style="font-size: 0.85rem;">
                                <div class="text-secondary fw-medium">
                                    <i class="fas fa-calendar-alt me-1"></i> Alta: <strong>${tarea.created_at || "-"}</strong>
                                </div>
                                <div class="${esVencida(tarea.expired_at) ? 'text-danger fw-bold' : 'text-secondary fw-medium'} mt-1">
                                    <i class="fas fa-clock me-1"></i> Vencimiento: 
                                    <strong>${tarea.expired_at || "Sin fecha"}</strong>
                                    ${
                                        esVencida(tarea.expired_at) 
                                            ? `<span class="badge bg-danger ms-1" style="font-size: 0.7rem;">¡Vencida!</span>` 
                                            : ''
                                    }
                                </div>
                            </div>

                        <!-- Botones de Acción  -->
                        <div class="d-flex justify-content-center align-items-center gap-2 pt-3 border-top">
                            ${btnCambiarEstadoMiembro}
                            ${btnDelegacion}
                            ${btnPrioridad}

                            ${(esAdmin || esLider) ? `
                                <!-- Botón Editar -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-primary btn-editar-tarea px-2.5"
                                    data-id="${idTareaReal}"
                                    title="Editar Tarea"
                                >
                                    <i class="fas fa-edit" style="pointer-events: none;"></i>
                                </button>

                                <!-- Botón Eliminar / Desasignar -->
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-danger btn-eliminar-tarea px-2.5"
                                    data-id="${idTareaReal}"
                                    title="${esLider ? 'Desasignar de equipo' : 'Eliminar Tarea'}"
                                >
                                    <i class="fas fa-trash" style="pointer-events: none;"></i>
                                </button>
                            ` : ''}
                        </div>

                    </div>
                </div>
            </div>
            `;
        })
        .join("");
};