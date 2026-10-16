import { usuarioService } from "../../services/usuarioService.js";
import { tableUsuarioTemplate } from "../../templates/usuarios/tableUsuarioTemplate.js";

export const getUsuarios = async () => {
    const tablaBody = document.getElementById("tablaUsuariosBody");

    if (!tablaBody) return;

    try {
        const response = await usuarioService.getAll();
        
        console.log("RESPUESTA USUARIOS:", response);

        if (response.ok === false || response.success === false) {
            throw new Error("No se pudieron obtener los usuarios.");
        }

        tablaBody.innerHTML = tableUsuarioTemplate(
            response.data ||  []
        );
        
    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        tablaBody.innerHTML = `
            <tr>
                
                <td colspan="6" class="text-center py-4 text-danger fw-bold">
                    <i class="fas fa-exclamation-triangle mb-2 d-block fa-2x"></i>
                    Error al cargar los usuarios.
                </td>
            </tr>
        `;
    }
};