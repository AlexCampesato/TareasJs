export const actualizarContadorSolicitudes = async () => {
    try {
        const res = await fetch("/proyecto-tareas/api/solicitudes/pendientes");
        const data = await res.json();

        const badge = document.getElementById("badgeSolicitudesCount");
        if (!badge) return;

        const cantidad = Array.isArray(data.solicitudes) ? data.solicitudes.length : (data.count || 0);

        if (cantidad > 0) {
            badge.textContent = cantidad;
            badge.style.display = "inline-block"; // Muestra el número rojo si hay pendientes
        } else {
            badge.style.display = "none"; // Lo oculta si está en 0
        }
    } catch (error) {
        console.error("Error al actualizar el contador de solicitudes:", error);
    }
};

export const dashboardTemplate = (user = null) => {
    // Evaluamos el rol del usuario
    const idRol = user ? Number(user.id_rol ?? user.fk_id_rol) : null;
    const esAdmin = idRol === 1;
    const esLider = idRol === 2;

   return `
    <div class="container-fluid px-4 py-3">

        <!-- Encabezado de la Sección -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
                <h1 class="h3 mb-0 fw-bold" id="tituloTareas">Tus tareas</h1>
                <p class="text-muted small mb-0">Gestión dinámica de actividades</p>
            </div>

            <!-- Botones de Acción Superiores -->
            <div class="d-flex gap-2">
                <!-- Botón Solicitudes Pendientes (Solo visible para Líder) -->
                ${
                    esLider
                        ? `
                        <button id="btnVerSolicitudes" type="button" class="btn btn-warning btn-sm shadow-sm fw-bold position-relative" data-bs-toggle="modal" data-bs-target="#modalSolicitudes">
                            <i class="fas fa-bell me-1"></i> Solicitudes Pendientes
                            
                            <!-- Badge posicionado exactamente sobre la campana -->
                            <span id="badgeSolicitudesCount" class="position-absolute top-0 start-0 badge rounded-pill bg-danger" style="display: none; margin-top: -10px; margin-left: 5px;">
                                0
                            </span>
                        </button>
                    `
                        : ""
                }

                <!-- Botón Nueva Tarea (Solo visible para Admin) -->
                ${
                    esAdmin
                        ? `
                        <button id="btnNuevaTarea" type="button" class="btn btn-success btn-sm shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalCrearTarea">
                            <i class="bi bi-plus-circle me-1"></i> Nueva Tarea
                        </button>
                    `
                        : ""
                }
            </div>
        </div>

        <!-- Filtros y Buscador de Tareas -->
            <div class="row mb-4 g-3 align-items-center">
                <div class="col-md-5">
                    <label for="inputBuscarTarea" class="form-label small text-muted mb-1">Buscar tareas</label>
                    <div class="input-group input-group-sm shadow-sm">
                        <span class="input-group-text bg-white border-end-0">
                            <i class="fas fa-search text-muted"></i>
                        </span>
                        <input 
                            type="text" 
                            id="inputBuscarTarea" 
                            class="form-select-sm form-control border-start-0" 
                            placeholder="Buscar por título, descripción, equipo o asignado..."
                        >
                    </div>
                </div>
                <div class="col-md-3">
                    <label for="selectFiltroEstado" class="form-label small text-muted mb-1">Estado</label>
                    <select id="selectFiltroEstado" class="form-select form-select-sm shadow-sm">
                        <option value="0">Todos los estados</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="selectFiltroPrioridad" class="form-label small text-muted mb-1">Prioridad</label>
                    <select id="selectFiltroPrioridad" class="form-select form-select-sm shadow-sm">
                        <option value="0">Todas las prioridades</option>
                    </select>
                </div>
            </div>

        <!-- CARDS / TAREAS -->
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body p-0">
                <div class="table-responsive p-3">
                    <div class="row" id="tablaTareasBody">
                        <div class="col-12 text-center py-4 text-muted">
                            <i class="fas fa-spinner fa-spin me-2"></i> Cargando...
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contenedor de Modales Persistentes -->
        <div id="dashboardComponents">
          <!-- Modal Asignar Equipo -->
                    
            <!-- Modal Asignar Miembro (Para Líderes) -->
            <div class="modal fade" id="modalAsignarMiembro" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title"><i class="fas fa-user-plus me-2"></i>Asignar Miembro de Equipo</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formAsignarMiembro">
                                <input type="hidden" id="idTareaAsignarMiembro">
                                <div class="mb-3">
                                    <label for="selectUsuarioAsignar" class="form-label fw-bold">Seleccionar Integrante</label>
                                    <select id="selectUsuarioAsignar" class="form-select" required>
                                        <option value="">Cargando miembros...</option>
                                    </select>
                                </div>
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-info text-white btn-sm">Asignar Tarea</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Cambiar Estado para Miembro -->
           

            <!-- Modal Cambiar Prioridad (Líder / Admin) -->
           

            <!-- Modal Solicitudes Pendientes (Líder) -->
            <div class="modal fade" id="modalSolicitudes" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-warning text-dark py-2">
                            <h6 class="modal-title fw-bold m-0"><i class="fas fa-inbox me-2"></i>Solicitudes Pendientes</h6>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <ul class="list-group list-group-flush" id="listaSolicitudes">
                                <li class="list-group-item text-center py-4 text-muted">
                                    <i class="fas fa-spinner fa-spin me-2"></i> Cargando solicitudes...
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `;
};

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorSolicitudes();
    
    // Opcional: Actualizar automáticamente cada 5 segundos
    setInterval(actualizarContadorSolicitudes, 5000);
});