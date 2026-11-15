export const homeTemplate = () => `
<!-- Navegación -->
<nav class="navbar navbar-expand-lg bg-body border-bottom">
    <div class="container">
        <a class="navbar-brand fw-bold" href="/" data-link>
            Gestiona tu trabajo
        </a>
        
        <div class="ms-auto d-flex align-items-center gap-2">
            
            <button id="btn-cambiar-tema" class="btn btn-outline-secondary" title="Cambiar Modo">
                <i class="fas fa-moon"></i>
            </button>
            
            <a class="btn btn-outline-primary" href="/proyecto-tareas/login" data-link>
                Ingresar
            </a>
        </div>
    </div>
</nav>

<!-- Presentación -->
<main>
    <section class="hero py-5">
        <div class="container">
            <div class="row align-items-center justify-content-between mb-5 g-4">
                <!-- Texto -->
                <div class="col-lg-8">
                    <span class="badge text-bg-primary mb-3">
                        Organiza tus tareas
                    </span>
                    <h1 class="display-4 fw-bold mb-3">
                        Bienvenidos
                    </h1>
                    <p class="lead mb-0">
                        Nuestro sistema te ayudará a organizarte,
                        administrar tus tareas, ver las de tus
                        compañeros y ser mas productivo.
                    </p>
                </div>
                <div class="col-lg-4 text-lg-end">
                    <a class="btn btn-primary btn-lg" href="/login" data-link>
                        Comenzar
                    </a>
                </div>
            </div>

            <div class="row align-items-stretch g-4">
                <div class="col-lg-5">
                    <div class="nav flex-column nav-pills gap-3 trello-tabs" id="landing-tabs" role="tablist" aria-orientation="vertical">
                        
                        <button class="nav-link active text-start p-4 rounded-3 trello-tab-item" id="tab-tareas-btn" data-bs-toggle="pill" data-bs-target="#tab-tareas" type="button" role="tab" aria-controls="tab-tareas" aria-selected="true">
                            <h2 class="h5 fw-bold mb-2">
                                Agiliza tu trabajo organizandolo.
                            </h2>
                            <p class="small mb-0 text-secondary">
                                Organizá tus pendientes, establecé prioridades
                                y mantené tus tareas bajo control.
                            </p>
                        </button>

                        <button class="nav-link text-start p-4 rounded-3 trello-tab-item" id="tab-equipos-btn" data-bs-toggle="pill" data-bs-target="#tab-equipos" type="button" role="tab" aria-controls="tab-equipos" aria-selected="false">
                            <h2 class="h5 fw-bold mb-2">
                                Equipos de Trabajo
                            </h2>
                            <p class="small mb-0 text-secondary">
                                Coordiná tus actividades y mantené el seguimiento de cada integrante.
                            </p>
                        </button>

                        <button class="nav-link text-start p-4 rounded-3 trello-tab-item" id="tab-roles-btn" data-bs-toggle="pill" data-bs-target="#tab-roles" type="button" role="tab" aria-controls="tab-roles" aria-selected="false">
                            <h2 class="h5 fw-bold mb-2">
                                Roles y Control
                            </h2>
                            <p class="small mb-0 text-secondary">
                                Administrá los roles y el equipo al que pertenecera cada usuario.
                            </p>
                        </button>

                    </div>
                </div>
                <!-- Imagen -->
                <div class="col-lg-7">
                    <div class="tab-content h-100 p-4 rounded-4 bg-body-tertiary border shadow-sm d-flex align-items-center" id="landing-tabsContent">
                        
                        <div class="tab-pane fade show active w-100" id="tab-tareas" role="tabpanel" aria-labelledby="tab-tareas-btn">
                            <div class="row align-items-center g-4">
                                <div class="col-md-5 text-start">
                                    <h5 class="fw-bold mb-2">Organización visual y prioridades</h5>
                                    <p class="small text-secondary mb-0">
                                        Creá tareas con fechas límite, asigná niveles de prioridad y visualizá el estado de cada pendiente sin perder el foco.
                                    </p>
                                </div>
                                <div class="col-md-7 text-center">
                                    <img 
                                        src="/proyecto-tareas/public/img/Gestion_de_tareas.webp" 
                                        class="img-fluid rounded-3 shadow-sm" 
                                        style="max-height: 250px; object-fit: cover;" 
                                        alt="Gestión de tareas"
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade w-100" id="tab-equipos" role="tabpanel" aria-labelledby="tab-equipos-btn">
                            <div class="row align-items-center g-4">
                                <div class="col-md-5 text-start">
                                    <h5 class="fw-bold mb-2">Coordinación por áreas y líderes</h5>
                                    <p class="small text-secondary mb-0">
                                        Agrupá a los usuarios en equipos de trabajo, designá responsables y mantené a todos alineados con los objetivos.
                                    </p>
                                </div>
                                <div class="col-md-7 text-center">
                                    <img 
                                        src="/proyecto-tareas/public/img/Equipos_de_trabajo.avif" 
                                        class="img-fluid rounded-3 shadow-sm" 
                                        style="max-height: 250px; object-fit: cover;" 
                                        alt="Equipos de trabajo"
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade w-100" id="tab-roles" role="tabpanel" aria-labelledby="tab-roles-btn">
                            <div class="row align-items-center g-4">
                                <div class="col-md-5 text-start">
                                    <h5 class="fw-bold mb-2">Roles y control de equipos</h5>
                                    <p class="small text-secondary mb-0">
                                        Definí a qué tareas puede ingresar cada integrante mediante un sistema flexible de roles y equipos.
                                    </p>
                                </div>
                                <div class="col-md-7 text-center">
                                    <img 
                                        src="/proyecto-tareas/public/img/Roles_y_permisos.jpg" 
                                        class="img-fluid rounded-3 shadow-sm" 
                                        style="max-height: 250px; object-fit: cover;" 
                                        alt="Roles y permisos"
                                    >
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
`;




