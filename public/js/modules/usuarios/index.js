import { getUsuarios } from "./getUsuarios.js";
import { initCreateUsuario } from "./createUsuario.js";
import { viewUsuario } from "./viewUsuario.js";
import { prepareEditUsuario } from "./updateUsuario.js";
import { deleteUsuario } from "./deleteUsuario.js";

export const renderUsuarios = (container) => {
    // Inyectamos el diseño completo de la tabla y los Modales en el contenedor principal
    container.innerHTML = `
        <div class="container-fluid px-4 py-4 animation-fade-in">
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 class="h3 mb-0 text-gray-800 fw-bold">Gestión de Usuarios</h1>
                    <p class="text-muted small mb-0">Administración de usuarios</p>
                </div>

                <div>
                    <a class="btn btn-primary btn-sm" href="/equipos" data-link>EQUIPOS</a> 
                    <a class="btn btn-primary btn-sm" href="/permisos" data-link>PERMISOS</a>
                    <a class="btn btn-primary btn-sm" href="/roles" data-link>ROLES</a>
                    <a class="btn btn-primary btn-sm" href="/dashboard" data-link>TAREAS</a>
                </div>

               
            </div>

            <div class="card shadow-sm border-0 mb-4">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0" width="100%" cellspacing="0">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4">ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Equipo</th>
                                    <th class="text-center pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaUsuariosBody">
                                <tr><td colspan="6" class="text-center py-4 text-muted"><i class="fas fa-spinner fa-spin me-2"></i> Cargando...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Unificado: Crear / Editar Usuario -->
        <div class="modal fade" id="modalUsuario" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold" id="modalUsuarioTitulo">Nuevo Usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <form id="formUsuario" novalidate>
                        <input type="hidden" name="id_usuario" id="id_usuario">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="usuarioNombre" class="form-label small text-muted">Nombre</label>
                                <input type="text" name="nombre" id="usuarioNombre" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioApellido" class="form-label small text-muted">Apellido</label>
                                <input type="text" name="apellido" id="usuarioApellido" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioEmail" class="form-label small text-muted">Email</label>
                                <input type="email" name="email" id="usuarioEmail" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioRol" class="form-label small text-muted">Rol</label>
                                <select name="fk_id_rol" id="usuarioRol" class="form-select" required>
                                    <option value="">Seleccione un rol...</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioEquipo" class="form-label small text-muted">Equipo</label>
                                <select name="fk_id_equipo" id="usuarioEquipo" class="form-select" required>
                                    <option value="">Seleccione un equipo...</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-success fw-bold">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Modal para Ver Detalles del Usuario -->
        <div class="modal fade" id="modalVerUsuario" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-light">
                        <h5 class="modal-title fw-bold text-info">
                            <i class="fas fa-info-circle me-2"></i>Detalles del Usuario
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">ID del Usuario</p>
                            <p id="verUsuarioId" class="fs-6">-</p>
                        </div>
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Nombre Completo</p>
                            <p id="verUsuarioNombre" class="fs-5 fw-bold text-dark">-</p>
                        </div>
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Email</p>
                            <p id="verUsuarioEmail" class="fs-6 text-dark">-</p>
                        </div>
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Rol</p>
                            <p id="verUsuarioRol" class="fs-6 text-dark">-</p>
                        </div>
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Equipo</p>
                            <p id="verUsuarioEquipo" class="fs-6 text-dark">-</p>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const tablaBody = document.getElementById("tablaUsuariosBody");
    if (!tablaBody) return;

    // Ejecutamos la carga de datos a la API y el listener del modal
    getUsuarios();
    initCreateUsuario();

    // Escuchamos de forma delegada los botones de acción de la tabla
    tablaBody.addEventListener("click", (e) => {
        const btnView = e.target.closest(".btn-ver-usuario");
        const btnEdit = e.target.closest(".btn-editar-usuario");
        const btnDelete = e.target.closest(".btn-eliminar-usuario");

        if (btnView) viewUsuario(btnView.dataset.id);
        if (btnEdit) prepareEditUsuario(btnEdit.dataset.id);
        if (btnDelete) deleteUsuario(btnDelete.dataset.id);
    });
};