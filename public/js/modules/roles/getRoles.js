import { rolService } from "../../services/rolService.js";
import { tableRolTemplate } from "../../templates/roles/tableRolTemplate.js";


export const getRoles = async () => {
    const tablaBody = document.getElementById("tablaRolesBody");

    if (!tablaBody) return;

    try {
        const response = await rolService.getAll();
        
        console.log("RESPUESTA ROLES:", response);

        if (response.ok === false || response.success === false) {
            throw new Error("No se pudieron obtener los roles.");
        }

        tablaBody.innerHTML = tableRolTemplate(
            response.data ||  []
        );
        
    } catch (error) {
        console.error("Error al obtener roles:", error);

        tablaBody.innerHTML = `
            <tr>
                
                <td colspan="4" class="text-center py-4 text-danger fw-bold">
                    <i class="fas fa-exclamation-triangle mb-2 d-block fa-2x"></i>
                    Error al cargar los roles.
                </td>
            </tr>
        `;
    }
};