import { usuarioService } from "../../services/usuarioService.js";

export const viewUsuario = async (id) => {
    const modalVerEl = document.getElementById("modalVerUsuario");
    if (!modalVerEl) return;

    // Instanciamos el modal de Bootstrap y lo mostramos
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalVerEl);
    
    // Ponemos estado de carga en los elementos del modal de Usuarios
    document.getElementById("verUsuarioId").innerText = id;
    document.getElementById("verUsuarioNombre").innerHTML = '<i class="fas fa-spinner fa-spin text-muted"></i> Cargando...';
    document.getElementById("verUsuarioEmail").innerHTML = '<i class="fas fa-spinner fa-spin text-muted"></i> Cargando...';
    document.getElementById("verUsuarioRol").innerHTML = '<i class="fas fa-spinner fa-spin text-muted"></i> Cargando rol...';
    document.getElementById("verUsuarioEquipo").innerHTML = '<i class="fas fa-spinner fa-spin text-muted"></i> Cargando equipo...';

    modalInstance.show();

    try {
        // Pedimos los datos específicos de este usuario al servidor
        const response = await usuarioService.getById(id);

        if (response.success || response.ok) {
            const usuario = response.data || response.usuario;
            const esActivo = usuario.activo === undefined || parseInt(usuario.activo) === 1;
            
            // Asignamos los datos reales del usuario a los IDs del modal
            document.getElementById("verUsuarioNombre").innerText = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || "-";
            document.getElementById("verUsuarioEmail").innerText = usuario.email || "-";
            document.getElementById("verUsuarioRol").innerText = usuario.rol_nombre || "Sin rol";
            document.getElementById("verUsuarioEquipo").innerText = usuario.equipo_nombre || "Sin equipo";

            const elEstado = document.getElementById("verUsuarioEstado");
            if (elEstado) {
                elEstado.innerHTML = esActivo
                    ? '<span class="badge bg-success">Activo</span>'
                    : '<span class="badge bg-danger">Inactivo</span>';
            }

        } else {
            document.getElementById("verUsuarioNombre").innerText = "Error";
            document.getElementById("verUsuarioEmail").innerText = response.message || "No se pudo cargar la información.";
            document.getElementById("verUsuarioRol").innerText = "-";
            document.getElementById("verUsuarioEquipo").innerText = "-";
        }
    } catch (error) {
        console.error("Error al cargar detalles del usuario:", error);
        document.getElementById("verUsuarioNombre").innerText = "Error de conexión";
        document.getElementById("verUsuarioEmail").innerText = "No se pudo conectar con el servidor.";
        document.getElementById("verUsuarioRol").innerText = "-";
        document.getElementById("verUsuarioEquipo").innerText = "-";
    }
};