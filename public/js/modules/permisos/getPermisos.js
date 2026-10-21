import { permisoService } from "../../services/permisoService.js";
import { tablePermisoTemplate } from "../../templates/permisos/tablePermisoTemplate.js";


export const getPermisos = async () => {
    const tablaBody = document.getElementById("tablaPermisosBody");

    if (!tablaBody) return;

    try {
        const response = await permisoService.getAll();
        
        console.log("RESPUESTA PERMISOS:", response);

        if (response.ok === false || response.success === false) {
            throw new Error("No se pudieron obtener los permisos.");
        }

        tablaBody.innerHTML = tablePermisoTemplate(
            response.data ||  []
        );
        
    } catch (error) {
        console.error("Error al obtener permisos:", error);

        tablaBody.innerHTML = `
            <tr>
                
                <td colspan="4" class="text-center py-4 text-danger fw-bold">
                    <i class="fas fa-exclamation-triangle mb-2 d-block fa-2x"></i>
                    Error al cargar los permisos.
                </td>
            </tr>
        `;
    }
};