import { renderSinRegistros } from "../../utils/CardHelpers.js";

export const tablePermisoTemplate = (permisos) => {
  if (!permisos || permisos.length === 0) {
    return renderSinRegistros(
      "No se encontraron permisos registrados",
      "fa-key"
    );
  }

  return permisos
    .map((permiso) => {
      const descripcion = permiso.descripcion
        ? permiso.descripcion
        : '<em class="text-muted">Sin descripción</em>';

      return `
        <div class="col-12 col-md-6 col-lg-3 mb-4">
          <div class="card card-item borde-admin h-100 shadow-sm">
            <div class="card-body d-flex flex-column justify-content-between p-3">

              <div>
                <!-- Cabecera de la Card (ID, Nombre del Permiso y Badge) -->
                <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <div class="overflow-hidden">
                    <span class="small text-muted fw-bold d-block">ID: ${permiso.id}</span>
                    <h6 class="card-title fw-bold mb-0 text-truncate" title="${permiso.nombre}">
                      ${permiso.nombre}
                    </h6>
                  </div>
                  <span class="badge rounded-pill bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle px-2 py-1">
                    <i class="fas fa-key me-1"></i>Permiso
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
                  class="btn btn-sm btn-info flex-fill btn-ver-permiso"
                  data-id="${permiso.id}"
                  title="Ver Detalles"
                >
                  <i class="fas fa-eye me-1"></i>Ver
                </button>

                <!-- Botón Editar -->
                <button
                  type="button"
                  class="btn btn-sm btn-warning flex-fill btn-editar-permiso"
                  data-id="${permiso.id}"
                  title="Editar Permiso"
                >
                  <i class="fas fa-edit me-1"></i>Editar
                </button>

                <!-- Botón Eliminar -->
                <button
                  type="button"
                  class="btn btn-sm btn-danger btn-eliminar-permiso"
                  data-id="${permiso.id}"
                  data-nombre="${permiso.nombre}"
                  title="Eliminar Permiso"
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
