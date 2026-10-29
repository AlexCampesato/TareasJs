/**
 * Obtiene las iniciales a partir del nombre y apellido
 */
export function obtenerIniciales(nombre = "", apellido = "") {
  const n = (nombre || "").trim();
  const a = (apellido || "").trim();

  if (!n && !a) return "?";
  if (n.toLowerCase().includes("sin asignar")) return "?";

  if (n && a) {
    return (n.charAt(0) + a.charAt(0)).toUpperCase();
  }

  const partes = n.split(" ").filter(Boolean);
  if (partes.length >= 2) {
    return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
  }

  return n.substring(0, 2).toUpperCase();
}

/**
 * Devuelve la clase CSS del borde superior de la tarjeta según estado, rol y equipo
 */
export function obtenerClaseBordeUsuario(usuario) {
  const esActivo = usuario.activo === undefined || parseInt(usuario.activo) === 1;
  const rolNombre = (usuario.rol_nombre || "").trim();
  const equipoNombre = (usuario.equipo_nombre || "").trim();

  const sinRol = !rolNombre || rolNombre.toLowerCase() === "sin rol";
  const sinEquipo = !equipoNombre || equipoNombre.toLowerCase() === "sin equipo";
  const rolLower = rolNombre.toLowerCase();

  if (!esActivo) return "borde-inactivo";
  if (sinRol || sinEquipo) return "borde-alerta";
  if (rolLower.includes("admin")) return "borde-admin";
  if (rolLower.includes("lider") || rolLower.includes("líder")) {
    return "borde-lider";
  }
  return "borde-miembro";
}

/**
 * Renderiza el bloque vacío cuando una lista o filtro no devuelve resultados
 */
export function renderSinRegistros(mensaje = "No se encontraron registros", icono = "fa-inbox") {
  return `
    <div class="col-12">
      <div class="text-center py-5 text-muted">
        <i class="fas ${icono} fa-3x mb-3 d-block text-secondary opacity-50"></i>
        <h5>${mensaje}</h5>
      </div>
    </div>
  `;
}
