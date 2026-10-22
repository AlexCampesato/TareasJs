export const dashboardTemplate = () => `
    <div id="dashboard" class="d-flex min-vh-100">

        <!-- Menú -->
        <aside id="dashboardMenu">
            <!-- Aquí se renderizará el componente menú -->
        </aside>

        <!-- Contenido principal -->
        <div class="d-flex flex-column flex-grow-1">

            <!-- Topbar -->
            <nav class="navbar navbar-expand navbar-light bg-body shadow-sm px-4">

                <div>
                   <a class="btn btn-primary btn-sm" href="/usuarios" data-link>USUARIOS</a> 

                    <a class="btn btn-primary btn-sm" href="/equipos" data-link>EQUIPOS</a>

                    <a class="btn btn-primary btn-sm" href="/permisos" data-link>PERMISOS</a>

                    <a class="btn btn-primary btn-sm" href="/roles" data-link>ROLES</a>
                </div>
                 
                 
                 <!-- Enlace oculto por defecto -->
                    <a href="/usuarios" id="nav-usuarios" data-link style="display: none;">Gestión de Usuarios</a>
                <button id="btn-logout" style="display: none;">Cerrar Sesión</button>    

                <button
                    id="sidebarToggleTop"
                    class="btn btn-link d-md-none rounded-circle me-3"
                    type="button"
                >
                    <i class="bi bi-list"></i>
                </button>

                <ul class="navbar-nav ms-auto align-items-center">

                    <!-- Boton modo oscuro -->
                    <li class="nav-item me-3">
                        <button id="btn-cambiar-tema" class="btn btn-outline-secondary btn-sm" title="Cambiar Modo">
                            <i class="fas fa-moon"></i>
                        </button>
                    </li>

                    <li class="nav-item dropdown">

                        <a
                            class="nav-link dropdown-toggle d-flex align-items-center"
                            href="#"
                            id="userDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span
                                id="dashboardUserName"
                               class="me-2 text-secondary small fw-bold"
                            >
                                Usuario
                            </span>

                            <img
                                id="dashboardUserAvatar"
                                class="rounded-circle"
                                src=""
                                alt="Avatar"
                                width="32"
                                height="32"
                            >
                        </a>

                        <ul
                            class="dropdown-menu dropdown-menu-end shadow"
                            aria-labelledby="userDropdown"
                        >
                            <li>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-person me-2"></i>
                                    Perfil
                                </a>
                            </li>

                            <li>
                                <hr class="dropdown-divider">
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="dropdown-item"
                                    id="btnCerrarSesion"
                                >
                                    <i class="bi bi-box-arrow-right me-2"></i>
                                    Cerrar Sesión
                                </button>
                            </li>
                        </ul>

                    </li>

                </ul>

            </nav>

            <!-- Contenido -->
            <main id="content" class="flex-grow-1">

                <div class="container-fluid px-4 py-4">

                    <!-- Encabezado -->
                    <div class="d-flex align-items-center justify-content-between mb-4">

                        <div>
                            <h1 class="h3 mb-0 fw-bold">
                                Tus tareas
                            </h1>

                            <p class="text-muted small mb-0">
                                Gestión dinámica de actividades
                            </p>
                        </div>

                        <button
                            id="btnNuevaTarea"
                            type="button"
                            class="btn btn-primary btn-sm shadow-sm fw-bold"
                        >
                            <i class="bi bi-plus-circle me-1"></i>
                            Nueva Tarea
                        </button>

                    </div>

                    <!-- Filtros -->
                    <div class="row mb-4">

                        <div class="col-md-4">

                            <label
                                for="selectFiltroEstado"
                                class="form-label small text-muted"
                            >
                                Filtrar por estado
                            </label>

                            <select
                                id="selectFiltroEstado"
                                class="form-select form-select-sm shadow-sm"
                            >
                                <option value="0">
                                    Todos los estados
                                </option>
                            </select>

                        </div>

                    </div>

                    <!-- CARDS -->
                    <div class="card shadow-sm border-0">

                        <div class="card-body p-0">

                            <div class="table-responsive">

                                <div class="row" id="tablaTareasBody">
                                <div class="col-12 text-center py-4 text-muted">
                                    <i class="fas fa-spinner fa-spin me-2"></i> Cargando...
                                </div>
                            </div>
                      </div>
                     </div>

                    </div>

                </div>

            </main>

        </div>

    </div>

    <!-- Contenedor de componentes -->
    <div id="dashboardComponents"></div>
`;

