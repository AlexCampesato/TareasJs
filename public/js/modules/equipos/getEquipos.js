import { equipoService } from "../../services/equipoService.js";
import { tableEquipoTemplate } from "../../templates/equipos/tableEquipoTemplate.js";

export const getEquipos = async () => {
    const tablaBody = document.getElementById("tablaEquiposBody");

    if (!tablaBody) return;

    try {
        const response = await equipoService.getAll();
        
        console.log("RESPUESTA EQUIPOS:", response);

        if (response.ok === false || response.success === false) {
            throw new Error("No se pudieron obtener los equipos.");
        }

        tablaBody.innerHTML = tableEquipoTemplate(
            response.equipos ||  []
        );
        
    } catch (error) {
        console.error("Error al obtener equipos:", error);

        tablaBody.innerHTML = `
            <tr>
                <!-- colspan="4" porque la tabla de equipos tiene 4 columnas -->
                <td colspan="4" class="text-center py-4 text-danger fw-bold">
                    <i class="fas fa-exclamation-triangle mb-2 d-block fa-2x"></i>
                    Error al cargar los equipos.
                </td>
            </tr>
        `;
    }
};