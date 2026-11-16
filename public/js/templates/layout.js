import { authService } from "../services/authService.js";
import { usuarioService } from "../services/usuarioService.js";
import { showToast } from "../ui/alert.js";
import { RUTA_AVATAR } from "../config.js";

export const renderAdminLayout = (contenidoInterno = "") => {
    return `
        <div id="wrapper">
            <!-- CONTENT WRAPPER -->
            <div id="content-wrapper" class="d-flex flex-column w-100 min-vh-100">
                <div id="content" class="flex-grow-1">
                    
                    <!-- TOPBAR -->
                    <nav class="navbar navbar-expand-md navbar-light bg-body topbar mb-4 static-top shadow-sm px-3 px-md-4"> 
                        <!-- Botón Hamburguesa (visible solo en celular para Admin) -->
                        <button
                            id="sidebarToggleTop"
                            class="navbar-toggler border-0 p-2 me-2"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#menuAdminCollapse"
                            aria-controls="menuAdminCollapse"
                            aria-expanded="false"
                            aria-label="Abrir menú"
                        >
                            <i class="fa fa-bars"></i>
                        </button>

                        <!-- Perfil y Modo Oscuro (siempre arriba a la derecha) -->
                        <ul class="navbar-nav ms-auto align-items-center flex-row order-md-2">
                            <!-- Botón Modo Oscuro -->
                            <li class="nav-item me-3">
                                <button id="btn-cambiar-tema" class="btn btn-outline-secondary btn-sm" title="Cambiar Modo">
                                    <i class="fas fa-moon"></i>
                                </button>
                            </li>
                            <li class="nav-item dropdown no-arrow">
                                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <div class="me-2 d-none d-lg-flex flex-column text-end lh-sm">
                                        <span class="text-gray-600 small fw-bold layoutUserName">...</span>
                                        <span class="text-gray-500 layoutUserRole" style="font-size: 0.75rem;">Cargando...</span>
                                    </div>
                                    <img class="avatar rounded-circle layoutUserAvatar" src="" alt="Avatar" width="32" height="32" style="display:none;">
                                </a>
                                <div class="dropdown-menu dropdown-menu-end shadow animated--grow-in position-absolute" aria-labelledby="userDropdown">
                                    <a class="dropdown-item" href="#" id="btnMiPerfilGlobal">
                                        <i class="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i> Mi Perfil
                                    </a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="#" id="btnCerrarSesionGlobal">
                                        <i class="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i> Cerrar Sesión
                                    </a>
                                </div>
                            </li>
                        </ul>

                        <!-- Contenedor colapsable para celular / horizontal en escritorio -->
                       <div class="collapse navbar-collapse order-md-1 mt-2 mt-md-0" id="menuAdminCollapse">
                            <!-- Contenedor accesos de Administración (Controlado dinámicamente por Rol) -->
                            <div id="navSeccionesAdmin" class=" flex-column flex-md-row gap-2 py-2 py-md-0">
                                <a class="btn btn-primary btn-sm btn-atajo text-start text-md-center" href="/usuarios" data-link>USUARIOS</a> 
                                <a class="btn btn-primary btn-sm btn-atajo text-start text-md-center" href="/equipos" data-link>EQUIPOS</a> 
                                <a class="btn btn-primary btn-sm btn-atajo text-start text-md-center" href="/permisos" data-link>PERMISOS</a>
                                <a class="btn btn-primary btn-sm btn-atajo text-start text-md-center" href="/roles" data-link>ROLES</a>
                                <a class="btn btn-primary btn-sm btn-atajo text-start text-md-center" href="/dashboard" data-link>TAREAS</a>
                            </div>
                        </div>

                    </nav>

                    <!-- CONTENIDO DINÁMICO -->
                    <div id="layoutMainContent">
                        ${contenidoInterno}
                    </div>

                </div>

                <!-- Modal Mi Perfil (Disponible en la vista de cada usuario) -->
                <div class="modal fade" id="modalMiPerfil" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content border-0 shadow">
                            <div class="modal-header">
                                <h5 class="modal-title fw-bold">
                                    <i class="fas fa-user-edit me-2 text-primary"></i>Editar Mi Perfil
                                </h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                            </div>
                            <form id="formMiPerfil" novalidate>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label for="perfilNombre" class="form-label small text-muted fw-semibold">Nombre</label>
                                        <input type="text" id="perfilNombre" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="perfilApellido" class="form-label small text-muted fw-semibold">Apellido</label>
                                        <input type="text" id="perfilApellido" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="perfilEmail" class="form-label small text-muted fw-semibold">Email</label>
                                        <input type="email" id="perfilEmail" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="perfilPass" class="form-label small text-muted fw-semibold">Nueva Contraseña</label>
                                        <input type="password" id="perfilPass" class="form-control" placeholder="Dejar en blanco para mantener la actual">
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-primary fw-bold">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- FOOTER -->
                <footer class="sticky-footer bg-body mt-auto py-3 border-top">
                    <div class="container my-auto">
                        <div class="copyright text-center my-auto">
                            <span>Copyright &copy; PROYECTO TAREAS 2026</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    `;
};

// LÓGICA GLOBAL DEL LAYOUT
export const initAdminLayout = async (userParam = null, permisoRequerido = null) => {
    try {
        let user = userParam;

        // Solo consulta a la API si no le pasamos el usuario directamente
        if (!user) {
            const response = await authService.checkSession();
            if (!response.success || !response.user) {
                window.location.href = "/proyecto-tareas/login";
                return false;
            }
            user = response.user;
        }

        // Si la vista exige un permiso específico lo validamos 
        if (permisoRequerido) {
            const permisosUsuario = user.permisos || [];
            if (!permisosUsuario.includes(permisoRequerido)) {
                window.location.href = "/proyecto-tareas/dashboard";
                return false;
            }
        }

        const idRol = Number(user.id_rol ?? user.fk_id_rol ?? 0);

        // 1. Visibilidad de Secciones Admin y botón hamburguesa según el Rol (Solo Admin - Rol 1)
        const navSeccionesAdmin = document.getElementById("navSeccionesAdmin");
        const sidebarToggleTop = document.getElementById("sidebarToggleTop");

        if (navSeccionesAdmin) {
            navSeccionesAdmin.style.display = (idRol === 1) ? "flex" : "none";
        }
        if (sidebarToggleTop) {
            sidebarToggleTop.style.display = (idRol === 1) ? "" : "none";
        }

        // 2. Visibilidad del botón "Nueva Tarea" (Visible únicamente para Admin - Rol 1)
        const btnNuevaTarea = document.getElementById("btnNuevaTarea");
        if (btnNuevaTarea) {
            btnNuevaTarea.style.display = (idRol === 1) ? "inline-block" : "none";
        }

        // 3. Cargar Datos de Perfil (Nombre, Rol y Avatar)
        document.querySelectorAll(".layoutUserName").forEach(el => {
            el.textContent = user.nombre || "Usuario";
        });

        document.querySelectorAll(".layoutUserRole").forEach(el => {
            el.textContent = user.rol_nombre || "Sin rol";
        });

        document.querySelectorAll(".layoutUserAvatar").forEach(el => {
            el.src = user.avatar ? RUTA_AVATAR + user.avatar : RUTA_AVATAR + "img_default.png";
            el.style.display = "inline-block";
        });

        // 4. Activar modal "Mi Perfil" para que cada usuario edite su propio nombre, apellido, email y contraseña
        const btnMiPerfil = document.getElementById("btnMiPerfilGlobal");
        const modalPerfilEl = document.getElementById("modalMiPerfil");
        const formMiPerfil = document.getElementById("formMiPerfil");

        if (btnMiPerfil && modalPerfilEl && !btnMiPerfil.dataset.listener) {
            btnMiPerfil.dataset.listener = "true";
            btnMiPerfil.addEventListener("click", async (e) => {
                e.preventDefault();
                try {
                    const res = await usuarioService.getById(user.id);
                    const datos = res.data || res.usuario || user;

                    document.getElementById("perfilNombre").value = datos.nombre || "";
                    document.getElementById("perfilApellido").value = datos.apellido || "";
                    document.getElementById("perfilEmail").value = datos.email || "";
                    document.getElementById("perfilPass").value = "";

                    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalPerfilEl);
                    modalInstance.show();
                } catch (err) {
                    console.error("Error al cargar datos del perfil:", err);
                }
            });
        }

        if (formMiPerfil && modalPerfilEl && !formMiPerfil.dataset.listener) {
            formMiPerfil.dataset.listener = "true";
            formMiPerfil.addEventListener("submit", async (e) => {
                e.preventDefault();

                const nombre = document.getElementById("perfilNombre").value.trim();
                const apellido = document.getElementById("perfilApellido").value.trim();
                const email = document.getElementById("perfilEmail").value.trim();
                const pass = document.getElementById("perfilPass").value.trim();

                if (!nombre || !apellido || !email) {
                    showToast("Por favor, completá Nombre, Apellido y Email.", "warning");
                    return;
                }

                const payload = { nombre, apellido, email };
                if (pass) {
                    payload.pass = pass;
                }

                try {
                    const updateRes = await usuarioService.update(user.id, payload);
                    if (updateRes.success || updateRes.ok) {
                        user.nombre = nombre;
                        user.email = email;

                        document.querySelectorAll(".layoutUserName").forEach(el => {
                            el.textContent = nombre;
                        });

                        const modalInstance = bootstrap.Modal.getInstance(modalPerfilEl);
                        if (modalInstance) modalInstance.hide();

                        showToast("Tus datos personales se actualizaron correctamente.", "success");
                    } else {
                        showToast(updateRes.message || "No se pudieron actualizar tus datos.", "error");
                    }
                } catch (err) {
                    console.error("Error al actualizar perfil:", err);
                    showToast("Ocurrió un error al guardar los cambios.", "error");
                }
            });
        }

        // 5. Activar botón de cerrar sesión global
        const btnCerrarSesion = document.getElementById("btnCerrarSesionGlobal");
        if (btnCerrarSesion && !btnCerrarSesion.dataset.listener) {
            btnCerrarSesion.dataset.listener = "true";
            btnCerrarSesion.addEventListener("click", async (e) => {
                e.preventDefault();
                try {
                    const logoutResponse = await authService.logout();
                    if (logoutResponse.success) {
                        window.location.href = "/proyecto-tareas/login";
                    }
                } catch (error) {
                    console.error("Error al cerrar sesión:", error);
                }
            });
        }

        // 6. Ocultar la pestaña de la ruta actual (Solo si es Admin)
        const rutaActual = window.location.pathname;
        if (idRol === 1) {
            document.querySelectorAll('.btn-atajo').forEach(boton => {
                const enlace = boton.getAttribute('href');
                if (enlace && rutaActual.includes(enlace)) {
                    boton.style.display = 'none'; 
                } else {
                    boton.style.display = 'inline-block';
                }
            });
        }

        return true; 
        
    } catch (error) {
        console.error("Error al cargar la sesión global:", error);
        window.location.href = "/proyecto-tareas/login";
        return false;
    }
};