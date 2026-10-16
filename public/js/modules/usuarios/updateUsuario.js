import { usuarioService } from "../../services/usuarioService.js";
// Asegúrate de que las rutas a los servicios coincidan con tu proyecto
import { rolService } from "../../services/rolService.js";
import { equipoService } from "../../services/equipoService.js";

export const prepareEditUsuario = async (id) => {
    const modalEl = document.getElementById("modalUsuario");
    const form = document.getElementById("formUsuario");
    const titulo = document.getElementById("modalUsuarioTitulo");

    if (!modalEl || !form) return;

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);

    if (titulo) titulo.innerText = "Editar Usuario";

    try {
        // Pedimos los datos del usuario, roles y equipos EN PARALELO
        const [userRes, rolesRes, equiposRes] = await Promise.all([
            usuarioService.getById(id),
            rolService.getAll(),
            equipoService.getAll()
        ]);

        // Llenamos las opciones del <select> de Rol
        const selectRol = document.getElementById("usuarioRol");
        if (selectRol && (rolesRes.success || rolesRes.ok)) {
            const roles = rolesRes.data || rolesRes.roles || [];
            selectRol.innerHTML = '<option value="">Seleccione un rol...</option>';
            roles.forEach(rol => {
                selectRol.innerHTML += `<option value="${rol.id}">${rol.nombre}</option>`;
            });
        }

        // Llenamos las opciones del <select> de Equipo
        const selectEquipo = document.getElementById("usuarioEquipo");
        if (selectEquipo && (equiposRes.success || equiposRes.ok)) {
            const equipos = equiposRes.data || equiposRes.equipos || [];
            selectEquipo.innerHTML = '<option value="">Seleccione un equipo...</option>';
            equipos.forEach(equipo => {
                selectEquipo.innerHTML += `<option value="${equipo.id}">${equipo.nombre}</option>`;
            });
        }

        // Finalmente, cargamos los datos del usuario en los inputs y seleccionamos las opciones correctas
        if (userRes.success || userRes.ok) {
            const usuario = userRes.usuario || userRes.data || userRes;

            document.getElementById("id_usuario").value = usuario.id || id;
            document.getElementById("usuarioNombre").value = usuario.nombre || "";
            document.getElementById("usuarioApellido").value = usuario.apellido || "";
            document.getElementById("usuarioEmail").value = usuario.email || "";

            // Como los select ya tienen las opciones generadas, ahora sí podemos asignarle el valor que tiene el usuario
            if (selectRol) selectRol.value = usuario.fk_id_rol || usuario.id_rol || "";
            if (selectEquipo) selectEquipo.value = usuario.fk_id_equipo || usuario.id_equipo || "";

            modalInstance.show();
        } else {
            console.error("Error al obtener datos del usuario:", userRes.message);
        }
    } catch (error) {
        console.error("Error al preparar la edición del usuario:", error);
    }
};