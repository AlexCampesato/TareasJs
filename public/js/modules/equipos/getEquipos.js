import { equipoService } from "../../services/equipoService.js";
import { tableEquipoTemplate } from "../../templates/equipos/tableEquipoTemplate.js";
import { Pagination } from "../../utils/Pagination.js";

export const getEquipos = async () => {
    const tablaBody = document.getElementById("tablaEquiposBody");
    const paginationContainer = document.getElementById("paginacionEquipos");

    if (!tablaBody) return;

    try {
        const response = await equipoService.getAll();

        if (
            response.status === 403 || 
            (response.success === false && response.message?.toLowerCase().includes('no tienes permiso'))
        ) {
            window.location.href = "/proyecto-tareas/dashboard";
            return;
        }

        if (response.ok === false || response.success === false) {
            throw new Error("No se pudieron obtener los equipos.");
        }

        const equiposData = response.equipos || [];

        // Le pasamos toda la responsabilidad a la clase Pagination
        const paginadorEquipos = new Pagination(
          equiposData, // El array con todos los datos que llegaron de PHP
          8, // Cantidad de filas por cada página
          tablaBody, // El elemento HTML <tbody> donde van las filas
          paginationContainer, // El elemento HTML <div> donde van los botones
          tableEquipoTemplate, // La función template que arma los <tr>
        );

        // Le decimos a la clase que haga los cálculos y dibuje la primera página
        paginadorEquipos.render();

       
        
    } catch (error) {
        console.error("Error al obtener equipos:", error);

        if (error.status === 403 || (error.message && error.message.includes('403'))) {
            window.location.href = "/proyecto-tareas/dashboard";
            return;
        }

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