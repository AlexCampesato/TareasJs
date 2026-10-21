import { renderAdminLayout , initAdminLayout} from "../../templates/layout.js";
import { getRoles } from "./getRoles.js";
import { initCreateRol } from "./createRol.js";
import { viewRol } from "./viewRol.js";
import { prepareEditRol } from "./updateRol.js";
import { deleteRol } from "./deleteRol.js";


export const renderRoles = (container) => {
    // Inyectamos el diseño completo de la tabla y el Modal en el contenedor principal
     const vistaRolesHTML = `
        <div class="container-fluid px-4 py-4 animation-fade-in">
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 class="h3 mb-0 text-gray-800 fw-bold">Gestión de Roles</h1>
                    <p class="text-muted small mb-0">Administración de roles</p>
                    
                </div>

                <button class="btn btn-success btn-sm shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalRol">
                    <i class="fas fa-plus-circle fa-sm text-white-50 me-1"></i> Nuevo Rol
                </button>
            </div>

            <div class="card shadow-sm border-0 mb-4">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0" width="100%" cellspacing="0">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4">ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th class="text-center pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaRolesBody">
                                <tr><td colspan="4" class="text-center py-4 text-muted"><i class="fas fa-spinner fa-spin me-2"></i> Cargando...</td></tr>
                            </tbody>
                        </table>
                         <!-- Contenedor para la paginación de roles -->
                        <div class="card-footer bg-white py-3 border-0">
                            <div id="paginacionRoles"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Unificado: Crear / Editar Rol -->
        <div class="modal fade" id="modalRol" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold" id="modalRolTitulo">Nuevo Rol</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <form id="formRol" novalidate>
                        <input type="hidden" name="id_rol" id="id_rol">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="rolNombre" class="form-label small text-muted">Nombre</label>
                                <input type="text" name="nombre" id="rolNombre" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="rolDescripcion" class="form-label small text-muted">Descripción</label>
                                <textarea name="descripcion" id="rolDescripcion" class="form-control" rows="2"></textarea>
                            </div>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <label class="form-label small text-muted fw-bold mb-0">Permisos Asignados</label>
                                    <div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-outline-secondary py-0 px-2" id="btnMarcarTodosPermisos" style="font-size: 11px;">Marcar todos</button>
                                        <button type="button" class="btn btn-outline-secondary py-0 px-2" id="btnDesmarcarTodosPermisos" style="font-size: 11px;">Desmarcar</button>
                                    </div>
                                </div>
                                <div id="contenedorPermisosRol" class="border rounded p-2 bg-light" style="max-height: 220px; overflow-y: auto;">
                                    <p class="text-muted small mb-0 text-center py-2"><i class="fas fa-spinner fa-spin me-1"></i> Cargando permisos...</p>
                                </div>
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

        <!-- Modal para Ver Detalles del Rol -->
        <div class="modal fade" id="modalVerRol" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-light">
                        <h5 class="modal-title fw-bold text-info">
                            <i class="fas fa-info-circle me-2"></i>Detalles del Rol
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">ID del Rol</p>
                            <p id="verRolId" class="fs-6">-</p>
                        </div>
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Nombre</p>
                            <p id="verRolNombre" class="fs-5 fw-bold text-dark">-</p>
                        </div>
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Descripción</p>
                            <p id="verRolDescripcion" class="fs-6">-</p>
                        </div>
                        <hr class="text-muted">
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-2">Permisos de este Rol</p>
                            <ul id="verRolPermisos" class="list-group list-group-flush small" style="max-height: 200px; overflow-y: auto;">
                                <!-- Se llena dinámicamente con JS -->
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

       // Inyectamos la vista de usuarios envuelta en el Layout Principal
    container.innerHTML = renderAdminLayout(vistaRolesHTML);

    //  Ejecutamos la validación global.
    const isAuth = initAdminLayout();
    if (!isAuth) return;

    const tablaBody = document.getElementById("tablaRolesBody");
    if (!tablaBody) return;

    // Ejecutamos la carga de datos a la API y el listener del modal
    getRoles();
    initCreateRol();

    // Escuchamos de forma delegada los botones de acción de la tabla
    tablaBody.addEventListener("click", (e) => {
        const btnView = e.target.closest(".btn-ver-rol");
        const btnEdit = e.target.closest(".btn-editar-rol");
        const btnDelete = e.target.closest(".btn-eliminar-rol");

        if (btnView)viewRol(btnView.dataset.id);
        if (btnEdit)prepareEditRol(btnEdit.dataset.id);
        if (btnDelete)deleteRol(btnDelete.dataset.id);
    });
};