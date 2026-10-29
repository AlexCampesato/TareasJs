import { rolService } from "../../services/rolService.js";
import { tableRolTemplate } from "../../templates/roles/tableRolTemplate.js";
import { Pagination } from "../../utils/Pagination.js";

// Exportamos la variable para usar el buscador en tiempo real
export let paginadorRoles; 

export const getRoles = async () => {
    const tablaBody = document.getElementById("tablaRolesBody");

    // Buscamos el contenedor donde irán los botones (1, 2, 3, Siguiente...)
    const paginationContainer = document.getElementById("paginacionRoles");
    // Si no existen los contenedores en el HTML, detenemos la ejecución
    if (!tablaBody || !paginationContainer) return; 

    try {
        const response = await rolService.getAll();

        if (response.ok === false || response.success === false) {
            throw new Error("No se pudieron obtener los roles.");
        }

        const rolesData = response.data || [];
        
                // Le pasamos toda la responsabilidad a la clase Pagination
                paginadorRoles = new Pagination(
                    rolesData,          // El array con todos los datos que llegaron de PHP
                    3,                     // Cantidad de filas por cada página
                    tablaBody,             // El elemento HTML <tbody> donde van las filas
                    paginationContainer,   // El elemento HTML <div> donde van los botones
                    tableRolTemplate   // La función template que arma los <tr>
                );
        
                // Le decimos a la clase que haga los cálculos y dibuje la primera página
                paginadorRoles.render();
        
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