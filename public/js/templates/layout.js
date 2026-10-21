import { authService } from "../services/authService.js";
import { RUTA_AVATAR } from "../config.js";

export const renderAdminLayout = (contenidoInterno) => {
    return `
        <div id="wrapper">
            <!-- CONTENT WRAPPER -->
            <div id="content-wrapper" class="d-flex flex-column w-100">
                <div id="content">
                    
                    <!-- TOPBAR -->
                    <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow-sm px-4">
                          <div>
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
                             <!-- Boton modo oscuro -->
                            <li class="nav-item me-3">
                                <button id="btn-cambiar-tema" class="btn btn-outline-secondary btn-sm" title="Cambiar Modo">
                                    <i class="fas fa-moon"></i>
                                </button>
                            </li>
                            <li class="nav-item dropdown no-arrow">
                                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="me-2 d-none d-lg-inline text-gray-600 small fw-bold layoutUserName">...</span>
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
                    ${contenidoInterno}

                </div>

                <!-- FOOTER -->
                <footer class="sticky-footer bg-body mt-auto">
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

// LÓGICA GLOBAL DEL LAYOUT (Extraída de dashboard)
export const initAdminLayout = async () => {
    try {
        const response = await authService.checkSession();

        // Si no hay sesión, redirigimos y devolvemos false
        if (!response.success || !response.user) {
            window.location.href = "/proyecto-tareas/login";
            return false; 
        }

       
        document.querySelectorAll(".layoutUserName").forEach(el => {
            el.textContent = response.user.nombre;
        });

       
        document.querySelectorAll(".layoutUserAvatar").forEach(el => {
            el.src = response.user.avatar ? RUTA_AVATAR + response.user.avatar : RUTA_AVATAR + "img_default.png";
            el.style.display = "inline-block";
        });

        //  Activamos el botón de cerrar sesión
        const btnCerrarSesion = document.getElementById("btnCerrarSesionGlobal");
        if (btnCerrarSesion) {
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

        
        //  DETECTAR RUTA ACTUAL
        const rutaActual = window.location.pathname;

        // ocultamos el de la ruta actual
        document.querySelectorAll('.btn-atajo').forEach(boton => {
            const enlace = boton.getAttribute('href');
            
            if (rutaActual.includes(enlace)) {
                boton.style.display = 'none'; 
            } else {
                boton.style.display = 'inline-block'; // Aseguramos que los demás se vean
            }
        });

        document.querySelectorAll('.sidebar .nav-item').forEach(li => {
            const link = li.querySelector('.nav-link');
            if (link) {
                const enlace = link.getAttribute('href');
                if (rutaActual.includes(enlace) && enlace !== '#') {
                    li.classList.add('active'); // Ilumina el ítem del menú
                } else {
                    li.classList.remove('active'); // Apaga los demás
                }
            }
        });
        
        return true; 
        
    } catch (error) {
        console.error("Error al cargar la sesión global:", error);
        window.location.href = "/proyecto-tareas/login";
        return false;
    }
};