import {
  obtenerIniciales,
  obtenerClaseBordeRol,
  renderSinRegistros,
} from "../../utils/CardHelpers.js";

export const tableRolTemplate = (roles) => {
  if (!roles || roles.length === 0) {
    return renderSinRegistros(
      "No se encontraron roles registrados",
      "fa-user-shield"
    );
  }

  return roles
    .map((rol) => {
      const iniciales = obtenerIniciales(rol.nombre);
      const claseBorde = obtenerClaseBordeRol(rol.nombre);
      const descripcion = rol.descripcion
        ? rol.descripcion
        : '<em class="text-muted">Sin descripción</em>';

      return `
        <div class="col-sm-6 col-xl-4 mb-4">
          <div class="card card-item ${claseBorde} h-100 shadow-sm">
            <div class="card-body d-flex flex-column justify-content-between p-3">

              <div>
                <!-- Cabecera de la Card (Avatar, ID y Nombre del Rol) -->
                <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <div class="avatar-iniciales">${iniciales}</div>
                    <div class="overflow-hidden">
                      <span class="small text-muted fw-bold d-block">ID: ${rol.id}</span>
                      <h6 class="card-title fw-bold mb-0 text-truncate" title="${rol.nombre}">
                        ${rol.nombre}
                      </h6>
                    </div>
                  </div>
                  <span class="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                    <i class="fas fa-user-shield me-1"></i>Rol
                  </span>
                </div>

                <!-- Bloque de Descripción -->
                <div class="bloque-info-card p-2 mb-3">
                  <span class="small text-muted fw-semibold d-block mb-1">Descripción:</span>
                  <p class="card-text small mb-0 text-body">
                    ${descripcion}
                  </p>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="d-flex justify-content-between align-items-center gap-1 pt-3 border-top mt-auto">
                <!-- Botón Ver Detalles -->
                <button
                  type="button"
                  class="btn btn-sm btn-info flex-fill btn-ver-rol"
                  data-id="${rol.id}"
                  title="Ver Detalles"
                >
                  <i class="fas fa-eye me-1"></i>Ver
                </button>

                <!-- Botón Editar -->
                <button
                  type="button"
                  class="btn btn-sm btn-warning flex-fill btn-editar-rol"
                  data-id="${rol.id}"
                  title="Editar Rol"
                >
                  <i class="fas fa-edit me-1"></i>Editar
                </button>

                <!-- Botón Eliminar -->
                <button
                  type="button"
                  class="btn btn-sm btn-danger btn-eliminar-rol"
                  data-id="${rol.id}"
                  title="Eliminar Rol"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>

            </div>
          </div>
        </div>
      `;
    })
    .join("");
};
