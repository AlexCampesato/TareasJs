export const dashboardTemplate = (user = null) => {

    // Extraemos los permisos del usuario de forma segura
    const permisos = user?.permisos || [];
    
    // Definimos banderas basadas en permisos
    const puedeVerSolicitudes = permisos.includes('solicitudes.ver');
    const puedeCrearTarea = permisos.includes('tareas.crear');

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
                  puedeVerSolicitudes
                    ? `
                        <button id="btnVerSolicitudes" type="button" class="btn btn-warning btn-sm shadow-sm fw-bold position-relative" data-bs-toggle="modal" data-bs-target="#modalSolicitudes">
                            <i class="fas fa-bell me-1"></i> Solicitudes Pendientes
                            
                            <!-- Badge posicionado exactamente sobre la campana -->
                            <span id="badgeSolicitudesCount" class="position-absolute top-0 start-0 badge rounded-pill bg-danger" style="display: none; margin-top: -10px; margin-left: 5px;">
                                0
                            </span>
                        </button>  `
                    : ""
                }

                <!-- Botón Nueva Tarea (Solo visible para Admin) -->
                ${
                  puedeCrearTarea
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
        </div>
    </div>
    `;
};
