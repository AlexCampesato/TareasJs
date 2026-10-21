import { usuarioService } from "../../services/usuarioService.js";
import { tableUsuarioTemplate } from "../../templates/usuarios/tableUsuarioTemplate.js";

let usuariosCache = [];

export const filtrarUsuariosLocal = (termino = "") => {
    const tablaBody = document.getElementById("tablaUsuariosBody");
    if (!tablaBody) return;

    const q = termino.trim().toLowerCase();
    if (!q) {
        tablaBody.innerHTML = tableUsuarioTemplate(usuariosCache);
        return;
    }

    const filtrados = usuariosCache.filter((u) => {
        const nombreCompleto = `${u.nombre || ''} ${u.apellido || ''}`.toLowerCase();
        const email = (u.email || '').toLowerCase();
        const rol = (u.rol_nombre || '').toLowerCase();
        const equipo = (u.equipo_nombre || '').toLowerCase();
        return (
            nombreCompleto.includes(q) ||
            email.includes(q) ||
            rol.includes(q) ||
            equipo.includes(q)
        );
    });

    tablaBody.innerHTML = tableUsuarioTemplate(filtrados);
};

export const getUsuarios = async () => {
    const tablaBody = document.getElementById("tablaUsuariosBody");

    if (!tablaBody) return;

    try {
        const response = await usuarioService.getAll();
        
        if (response.ok === false || response.success === false) {
            throw new Error("No se pudieron obtener los usuarios.");
        }

        usuariosCache = response.data || [];
        const inputBuscar = document.getElementById("inputBuscarUsuario");
        if (inputBuscar && inputBuscar.value.trim() !== "") {
            filtrarUsuariosLocal(inputBuscar.value);
        } else {
            tablaBody.innerHTML = tableUsuarioTemplate(usuariosCache);
        }
        
    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        tablaBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-danger fw-bold">
                    <i class="fas fa-exclamation-triangle mb-2 d-block fa-2x"></i>
                    Error al cargar los usuarios.
                </td>
            </tr>
        `;
    }
};