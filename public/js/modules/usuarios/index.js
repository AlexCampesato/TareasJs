import { renderAdminLayout , initAdminLayout} from "../../templates/layout.js";
import { getUsuarios, filtrarUsuariosLocal } from "./getUsuarios.js";
import { initCreateUsuario } from "./createUsuario.js";
import { viewUsuario } from "./viewUsuario.js";
import { prepareEditUsuario } from "./updateUsuario.js";
import { deleteUsuario, toggleEstadoUsuario } from "./deleteUsuario.js";

export const renderUsuarios = async(container) => {
   
    const vistaUsuariosHTML = `
        <div class="container-fluid px-4 py-4 animation-fade-in">
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 class="h3 mb-0 text-gray-800 fw-bold">Gestión de Usuarios</h1>
                    <p class="text-muted small mb-0">Administración de usuarios, roles y estados</p>
                </div>

            </div>

            <!-- Tarjetas de Resumen (KPIs calculados dinámicamente) -->
            <div class="row g-3 mb-4" id="resumenUsuarios"></div>


            <div class="row mb-3 align-items-center">
                    <!-- Buscador  -->
                    <div class="col-md-5 mb-2 mb-md-0">
                        <div class="input-group input-group-sm shadow-sm">
                            <span class="input-group-text bg-white border-end-0">
                                <i class="fas fa-search text-muted"></i>
                            </span>
                            <input type="text" id="inputBuscarUsuario" class="form-control border-start-0" placeholder="Buscar usuario por nombre, email...">
                        </div>
                    </div>

                    <!-- Filtros Checkboxes acumulativos -->
                    <div class="col-md-7 d-flex flex-wrap gap-3">
                        <div class="form-check">
                            <input class="form-check-input filtro-checkbox" type="checkbox" value="inactivos" id="checkInactivos">
                            <label class="form-check-label small fw-bold text-muted" for="checkInactivos">
                                Inactivos
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input filtro-checkbox" type="checkbox" value="sin_equipo" id="checkSinEquipo">
                            <label class="form-check-label small fw-bold text-muted" for="checkSinEquipo">
                                Sin equipo
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input filtro-checkbox" type="checkbox" value="sin_rol" id="checkSinRol">
                            <label class="form-check-label small fw-bold text-muted" for="checkSinRol">
                                Sin rol
                            </label>
                        </div>
                    </div>
                </div>


            <div class="card shadow-sm border-0 mb-4">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <!-- ANTES ERA UNA TABLA, AHORA ES UNA FILA (ROW) DE BOOTSTRAP -->
                        <div class="row" id="tablaUsuariosBody">
                            <div class="col-12 text-center py-4 text-muted">
                                <i class="fas fa-spinner fa-spin me-2"></i> Cargando...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--  Paginación -->
            <div class="card-footer bg-white py-3 border-0">
                <div id="paginacionUsuarios"></div>
            </div>

        <!-- Modal Admin: Editar Rol y Equipo del Usuario -->
        <div class="modal fade" id="modalUsuario" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold" id="modalUsuarioTitulo">Asignar Rol y Equipo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <form id="formUsuario" novalidate>
                        <input type="hidden" name="id_usuario" id="id_usuario">
                        <div class="modal-body">
                            <!-- Resumen informativo del usuario que se está editando -->
                            <div class="bloque-info-card p-3 mb-3">
                                <p class="fw-bold mb-0" id="editUsuarioNombreInfo">-</p>
                                <small class="text-muted" id="editUsuarioEmailInfo">-</small>
                            </div>

                            <div class="mb-3">
                                <label for="usuarioRol" class="form-label small text-muted fw-semibold">Rol</label>
                                <select name="fk_id_rol" id="usuarioRol" class="form-select" required>
                                    <option value="">Seleccione un rol...</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioEquipo" class="form-label small text-muted fw-semibold">Equipo</label>
                                <select name="fk_id_equipo" id="usuarioEquipo" class="form-select">
                                    <option value="">Sin equipo asignado</option>
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
                        <div class="mb-3">
                            <p class="small text-muted fw-bold mb-1">Estado</p>
                            <p id="verUsuarioEstado" class="fs-6">-</p>
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
    container.innerHTML = renderAdminLayout(vistaUsuariosHTML);

    // Validación global 
    const isAuth = await initAdminLayout(null, 'usuarios.ver');
    if (!isAuth) return;

    //  Seleccionamos el cuerpo de la tabla 
    const tablaBody = document.getElementById("tablaUsuariosBody");
    if (!tablaBody) return;

    //  Ejecutamos la carga de datos a la API y el listener del modal
    getUsuarios();
    initCreateUsuario();

    // Buscador de usuarios en tiempo real
    const inputBuscar = document.getElementById("inputBuscarUsuario");
    if (inputBuscar) {
        inputBuscar.addEventListener("input", (e) => {
            filtrarUsuariosLocal(e.target.value);
        });
    }

    //Escuchamos de forma delegada los botones de acción de la tabla
    tablaBody.addEventListener("click", (e) => {
        const btnView = e.target.closest(".btn-ver-usuario");
        const btnEdit = e.target.closest(".btn-editar-usuario");
        const btnEstado = e.target.closest(".btn-estado-usuario");
        const btnDelete = e.target.closest(".btn-eliminar-usuario");

        if (btnView) viewUsuario(btnView.dataset.id);
        if (btnEdit) prepareEditUsuario(btnEdit.dataset.id);
        if (btnEstado) toggleEstadoUsuario(btnEstado.dataset.id, btnEstado.dataset.activo, btnEstado.dataset.nombre);
        if (btnDelete) deleteUsuario(btnDelete.dataset.id, btnDelete.dataset.nombre);
    });
};