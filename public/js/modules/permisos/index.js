import { renderAdminLayout , initAdminLayout} from "../../templates/layout.js";
import { getPermisos } from "./getPermisos.js";
import { initCreatePermiso } from "./createPermiso.js";
import { viewPermiso } from "./viewPermiso.js";
import { prepareEditPermiso } from "./updatePermiso.js";
import { deletePermiso } from "./deletePermiso.js";


export const renderPermisos = (container) => {
    // Inyectamos el diseño completo de la tabla y el Modal en el contenedor principal
    const vistaPermisosHTML = `
        <div class="container-fluid px-4 py-4 animation-fade-in">
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 class="h3 mb-0 text-gray-800 fw-bold">Gestión de Permisos</h1>
                    <p class="text-muted small mb-0">Administración de permisos</p>
                    
                </div>

                <button class="btn btn-success btn-sm shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalPermiso">
                    <i class="fas fa-plus-circle fa-sm text-white-50 me-1"></i> Nuevo Permiso
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
                            <tbody id="tablaPermisosBody">
                                <tr><td colspan="4" class="text-center py-4 text-muted"><i class="fas fa-spinner fa-spin me-2"></i> Cargando...</td></tr>
                            </tbody>
                        </table>
                        <!-- Contenedor para la paginación de permisos -->
                            <div class="card-footer bg-white py-3 border-0">
                                <div id="paginacionPermisos"></div>
                            </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Unificado: Crear / Editar Permiso -->
        <div class="modal fade" id="modalPermiso" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold" id="modalPermisoTitulo">Nuevo Permiso</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <form id="formPermiso" novalidate>
                        <input type="hidden" name="id_permiso" id="id_permiso">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="permisoNombre" class="form-label small text-muted">Nombre</label>
                                <input type="text" name="nombre" id="permisoNombre" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="permisoDescripcion" class="form-label small text-muted">Descripción</label>
                                <textarea name="descripcion" id="permisoDescripcion" class="form-control" rows="3"></textarea>
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

        <!-- Modal para Ver Detalles del Permiso -->
        <div class="modal fade" id="modalVerPermiso" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-light">
                        <h5 class="modal-title fw-bold text-info">
                            <i class="fas fa-info-circle me-2"></i>Detalles del Permiso
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">ID del Permiso</p>
                            <p id="verPermisoId" class="fs-6">-</p>
                        </div>
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Nombre</p>
                            <p id="verPermisoNombre" class="fs-5 fw-bold text-dark">-</p>
                        </div>
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Descripción</p>
                            <p id="verPermisoDescripcion" class="fs-6">-</p>
                        </div>
                       
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;


    //  Inyectamos la vista de usuarios envuelta en el Layout Principal
    container.innerHTML = renderAdminLayout(vistaPermisosHTML);

    // Ejecutamos la validación global.
    const isAuth = initAdminLayout();
    if (!isAuth) return;    

    const tablaBody = document.getElementById("tablaPermisosBody");
    if (!tablaBody) return;

    // Ejecutamos la carga de datos a la API y el listener del modal
    getPermisos();
    initCreatePermiso();

    // Escuchamos de forma delegada los botones de acción de la tabla
    tablaBody.addEventListener("click", (e) => {
        const btnView = e.target.closest(".btn-ver-permiso");
        const btnEdit = e.target.closest(".btn-editar-permiso");
        const btnDelete = e.target.closest(".btn-eliminar-permiso");

        if (btnView)viewPermiso(btnView.dataset.id);
        if (btnEdit)prepareEditPermiso(btnEdit.dataset.id);
        if (btnDelete)deletePermiso(btnDelete.dataset.id);
    });
};