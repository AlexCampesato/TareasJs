import {
  obtenerIniciales,
  obtenerClaseBordeUsuario,
  renderSinRegistros,
} from "../../utils/CardHelpers.js";

export const tableUsuarioTemplate = (usuarios) => {
  if (!usuarios || usuarios.length === 0) {
    return renderSinRegistros(
      "No se encontraron usuarios registrados",
      "fa-users-slash"
    );
  }

  return usuarios
    .map((usuario) => {
      const esActivo =
        usuario.activo === undefined || parseInt(usuario.activo) === 1;

      const iniciales = obtenerIniciales(usuario.nombre, usuario.apellido);
      const claseBorde = obtenerClaseBordeUsuario(usuario);

      const badgeEstado = esActivo
        ? `<span class="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-1">
             <i class="fas fa-check-circle me-1"></i>Activo
           </span>`
        : `<span class="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
             <i class="fas fa-ban me-1"></i>Inactivo
           </span>`;

      const badgeRol = usuario.rol_nombre
        ? `<span class="badge bg-primary-subtle text-primary border border-primary-subtle">
             <i class="fas fa-user-shield me-1"></i>${usuario.rol_nombre}
           </span>`
        : `<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
             <i class="fas fa-exclamation-triangle me-1"></i>Sin rol
           </span>`;

      const textoEquipo = usuario.equipo_nombre
        ? `<span class="text-body fw-medium small">
             <i class="fas fa-users text-muted me-1"></i>${usuario.equipo_nombre}
           </span>`
        : `<span class="text-danger fw-medium small">
             <i class="fas fa-exclamation-circle me-1"></i>Sin equipo
           </span>`;

      const btnEstadoClass = esActivo
        ? "btn-outline-warning"
        : "btn-outline-success";
      const btnEstadoIcon = esActivo ? "fa-user-slash" : "fa-user-check";
      const btnEstadoTitle = esActivo
        ? "Desactivar Usuario"
        : "Activar Usuario";

      return `
        <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
          <div class="card card-item ${claseBorde} h-100 shadow-sm ${!esActivo ? "opacity-75" : ""}">
            <div class="card-body d-flex flex-column justify-content-between p-3">

              <div>
                <!-- Cabecera de la Card (Avatar, Nombre, Email y Estado) -->
                <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <div class="avatar-iniciales">${iniciales}</div>
                    <div class="overflow-hidden">
                      <span class="small text-muted fw-bold d-block">ID: ${usuario.id}</span>
                      <h6 class="card-title fw-bold mb-0 text-truncate" title="${usuario.nombre} ${usuario.apellido || ""}">
                        ${usuario.nombre} ${usuario.apellido || ""}
                      </h6>
                    </div>
                  </div>
                  ${badgeEstado}
                </div>

                <!-- Email -->
                <p class="card-text text-muted small mb-3 text-truncate" title="${usuario.email}">
                  <i class="fas fa-envelope me-1 text-secondary"></i> ${usuario.email}
                </p>

                <!-- Bloque de Rol y Equipo -->
                <div class="bloque-info-card p-2 mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="small text-muted fw-semibold">Rol:</span>
                    ${badgeRol}
                  </div>
                  <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span class="small text-muted fw-semibold">Equipo:</span>
                    ${textoEquipo}
                  </div>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="d-flex justify-content-between align-items-center gap-1 pt-3 border-top mt-auto">
                <!-- Botón Ver Detalles -->
                <button
                  type="button"
                  class="btn btn-sm btn-outline-info flex-fill btn-ver-usuario"
                  data-id="${usuario.id}"
                  title="Ver Detalles"
                >
                  <i class="fas fa-eye me-1"></i>Ver
                </button>

                <!-- Botón Editar -->
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary flex-fill btn-editar-usuario"
                  data-id="${usuario.id}"
                  title="Editar Usuario"
                >
                  <i class="fas fa-edit me-1"></i>Editar
                </button>

                <!-- Botón Activar / Desactivar -->
                <button
                  type="button"
                  class="btn btn-sm ${btnEstadoClass} btn-estado-usuario"
                  data-id="${usuario.id}"
                  data-activo="${esActivo ? 1 : 0}"
                  title="${btnEstadoTitle}"
                >
                  <i class="fas ${btnEstadoIcon}"></i>
                </button>

                <!-- Botón Eliminar -->
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger btn-eliminar-usuario"
                  data-id="${usuario.id}"
                  title="Eliminar Usuario"
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