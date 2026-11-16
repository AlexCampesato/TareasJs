import { renderAdminLayout , initAdminLayout} from "../../templates/layout.js";
import { getEquipos } from "./getEquipos.js";
import { initCreateEquipo } from "./createEquipo.js";
import { viewEquipo } from "./viewEquipo.js";
import { prepareEditEquipo } from "./updateEquipo.js";
import { deleteEquipo } from "./deleteEquipo.js";

export const renderEquipos = async(container) => {
    // Inyectamos el diseño completo de la tabla y el Modal en el contenedor principal
    const vistaEquiposHTML = `
        <div class="container-fluid px-4 py-4 animation-fade-in">
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 class="h3 mb-0 text-gray-800 fw-bold">Gestión de Equipos</h1>
                    <p class="text-muted small mb-0">Administración de equipos de trabajo</p>
                    
                </div>

                <button class="btn btn-success btn-sm shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalEquipo">
                    <i class="fas fa-plus-circle fa-sm text-white-50 me-1"></i> Nuevo Equipo
                </button>
            </div>

            <div class="card shadow-sm border-0 mb-4">
                <div class="card-body p-0">
                    <div class="table-responsive">
                    <div class="row" id="tablaEquiposBody">
                    <div class="col-12 text-center py-4 text-muted">
                        <i class="fas fa-spinner fa-spin me-2"></i> Cargando...
                    </div>
                </div>
                </div>
                </div>
            </div>
        </div>

        <!-- Modal Unificado: Crear / Editar Equipo -->
        <div class="modal fade" id="modalEquipo" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold" id="modalEquipoTitulo">Nuevo Equipo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <form id="formEquipo" novalidate>
                        <input type="hidden" name="id_equipo" id="id_equipo">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="equipoNombre" class="form-label small text-muted">Nombre</label>
                                <input type="text" name="nombre" id="equipoNombre" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="equipoDescripcion" class="form-label small text-muted">Descripción</label>
                                <textarea name="descripcion" id="equipoDescripcion" class="form-control" rows="3"></textarea>
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

        <!-- Modal para Ver Detalles del Equipo -->
        <div class="modal fade" id="modalVerEquipo" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-light">
                        <h5 class="modal-title fw-bold text-info">
                            <i class="fas fa-info-circle me-2"></i>Detalles del Equipo
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">ID del Equipo</p>
                            <p id="verEquipoId" class="fs-6">-</p>
                        </div>
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Nombre</p>
                            <p id="verEquipoNombre" class="fs-5 fw-bold text-dark">-</p>
                        </div>
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Descripción</p>
                            <p id="verEquipoDescripcion" class="fs-6">-</p>
                        </div>
                        <hr class="text-muted">
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-2">Integrantes del Equipo</p>
                            <ul id="verEquipoIntegrantes" class="list-group list-group-flush small">
                                <!-- JavaScript llenará esto con <li> -->
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

     //  Inyectamos la vista de usuarios envuelta en el Layout Principal
    container.innerHTML = renderAdminLayout(vistaEquiposHTML);

    const isAuth = await initAdminLayout(null, 'equipos.ver');
    if (!isAuth) return;
   
    const tablaBody = document.getElementById("tablaEquiposBody");
    if (!tablaBody) return;

    // Ejecutamos la carga de datos a la API y el listener del modal
    getEquipos();
    initCreateEquipo();

    // Escuchamos de forma delegada los botones de acción de la tabla
    tablaBody.addEventListener("click", (e) => {
        const btnView = e.target.closest(".btn-ver-equipo");
        const btnEdit = e.target.closest(".btn-editar-equipo");
        const btnDelete = e.target.closest(".btn-eliminar-equipo");

        if (btnView)viewEquipo(btnView.dataset.id);
        if (btnEdit)prepareEditEquipo(btnEdit.dataset.id);
        if (btnDelete)deleteEquipo(btnDelete.dataset.id);
    });
};