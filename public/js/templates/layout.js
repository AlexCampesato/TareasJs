import { authService } from "../services/authService.js";
import { RUTA_AVATAR } from "../config.js";

export const renderAdminLayout = (contenidoInterno = "") => {
    return `
        <div id="wrapper">
            <!-- CONTENT WRAPPER -->
            <div id="content-wrapper" class="d-flex flex-column w-100 min-vh-100">
                <div id="content" class="flex-grow-1">
                    
                    <!-- TOPBAR -->
                    <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow-sm px-4">
                        
                        <!-- Contenedor accesos de Administración (Controlado dinámicamente por Rol) -->
                        <div id="navSeccionesAdmin">
                            <a class="btn btn-primary btn-sm btn-atajo" href="/usuarios" data-link>USUARIOS</a> 
                            <a class="btn btn-primary btn-sm btn-atajo" href="/equipos" data-link>EQUIPOS</a> 
                            <a class="btn btn-primary btn-sm btn-atajo" href="/permisos" data-link>PERMISOS</a>
                            <a class="btn btn-primary btn-sm btn-atajo" href="/roles" data-link>ROLES</a>
                            <a class="btn btn-primary btn-sm btn-atajo" href="/dashboard" data-link>TAREAS</a>
                        </div>

                        <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle me-3">
                            <i class="fa fa-bars"></i>
                        </button>

                        <ul class="navbar-nav ms-auto align-items-center">
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
                                <div class="dropdown-menu dropdown-menu-end shadow animated--grow-in" aria-labelledby="userDropdown">
                                    <a class="dropdown-item" href="#">
                                        <i class="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i> Perfil
                                    </a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="#" id="btnCerrarSesionGlobal">
                                        <i class="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i> Cerrar Sesión
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>

                    <!-- CONTENIDO DINÁMICO -->
                    <div id="layoutMainContent">
                        ${contenidoInterno}
                    </div>

                </div>

                <!-- FOOTER -->
                <footer class="sticky-footer bg-white mt-auto py-3 border-top">
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
export const initAdminLayout = async (userParam = null) => {
    try {
        let user = userParam;
        const response = await authService.checkSession();

        /// Solo consulta a la API si no le pasamos el usuario directamente
        if (!user) {
            const response = await authService.checkSession();
            if (!response.success || !response.user) {
                window.location.href = "/proyecto-tareas/login";
                return false;
            }
            user = response.user;
        }

        
        const idRol = Number(user.id_rol ?? user.fk_id_rol ?? 0);

        // 1. Visibilidad de Secciones Admin según el Rol (Solo visible para Admin - Rol 1)
        const navSeccionesAdmin = document.getElementById("navSeccionesAdmin");
        if (navSeccionesAdmin) {
            navSeccionesAdmin.style.display = (idRol === 1) ? "block" : "none";
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

        // 4. Activar botón de cerrar sesión global
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

        // 5. Ocultar la pestaña de la ruta actual (Solo si es Admin)
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