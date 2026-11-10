import {
  obtenerIniciales,
  renderSinRegistros,
} from "../../utils/CardHelpers.js";

export const tableEquipoTemplate = (equipos) => {
  if (!equipos || equipos.length === 0) {
    return renderSinRegistros(
      "No se encontraron equipos registrados",
      "fa-users-slash"
    );
  }

  return equipos
    .map((equipo) => {
      const iniciales = obtenerIniciales(equipo.nombre);
      const descripcion = equipo.descripcion
        ? equipo.descripcion
        : '<em class="text-muted">Sin descripción</em>';

      return `
        <div class="col-sm-6 col-xl-4 mb-4">
          <div class="card card-item borde-lider h-100 shadow-sm">
            <div class="card-body d-flex flex-column justify-content-between p-3">

              <div>
                <!-- Cabecera de la Card (Avatar, ID y Nombre del Equipo) -->
                <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <div class="avatar-iniciales">${iniciales}</div>
                    <div class="overflow-hidden">
                      <span class="small text-muted fw-bold d-block">ID: ${equipo.id}</span>
                      <h6 class="card-title fw-bold mb-0 text-truncate" title="${equipo.nombre}">
                        ${equipo.nombre}
                      </h6>
                    </div>
                  </div>
                  
                  <!--  Líder Asignado -->
                    <div>
                        ${
                            equipo.nombre_lider 
                                ? `<span class="badge bg-warning-subtle text-dark border border-warning-subtle px-2.5 py-1.5" style="font-size: 0.82rem;">
                                    <i class="fas fa-user-shield me-1 text-warning"></i> Líder: <strong>${equipo.nombre_lider} ${equipo.apellido_lider || ''}</strong>
                                   </span>`
                                : `<span class="badge bg-body-secondary text-secondary-emphasis border px-2.5 py-1.5" style="font-size: 0.82rem;">
                                    <i class="fas fa-user-slash me-1"></i> Sin líder
                                   </span>`
                        }
                          </div>
                          <span class="badge rounded-pill bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1">
                          <i class="fas fa-users me-1"></i>Equipo
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
                  class="btn btn-sm btn-info flex-fill btn-ver-equipo"
                  data-id="${equipo.id}"
                  title="Ver Detalles"
                >
                  <i class="fas fa-eye me-1"></i>Ver
                </button>

                <!-- Botón Editar -->
                <button
                  type="button"
                  class="btn btn-sm btn-warning flex-fill btn-editar-equipo"
                  data-id="${equipo.id}"
                  title="Editar Equipo"
                >
                  <i class="fas fa-edit me-1"></i>Editar
                </button>

                <!-- Botón Eliminar -->
                <button
                  type="button"
                  class="btn btn-sm btn-danger btn-eliminar-equipo"
                  data-id="${equipo.id}"
                  title="Eliminar Equipo"
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
