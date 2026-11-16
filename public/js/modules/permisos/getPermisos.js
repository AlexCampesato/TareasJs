import { permisoService } from "../../services/permisoService.js";
import { tablePermisoTemplate } from "../../templates/permisos/tablePermisoTemplate.js";
import { Pagination } from "../../utils/Pagination.js";

// Exportamos la variable por si luego necesitas usar el buscador en tiempo real
export let paginadorPermisos; 

export const getPermisos = async () => {
    
    const tablaBody = document.getElementById("tablaPermisosBody");
    const paginationContainer = document.getElementById("paginacionPermisos");
    if (!tablaBody || !paginationContainer) return; 

    try {
        const response = await permisoService.getAll();

        if (response.ok === false || response.success === false) {
            throw new Error("No se pudieron obtener los permisos.");
        }

        const permisosData = response.data || [];

        // Le pasamos toda la responsabilidad a la clase Pagination
        paginadorPermisos = new Pagination(
            permisosData,          // El array con todos los datos que llegaron de PHP
            8,                     // Cantidad de filas por cada página
            tablaBody,             // El elemento HTML <tbody> donde van las filas
            paginationContainer,   // El elemento HTML <div> donde van los botones
            tablePermisoTemplate   // La función template que arma los <tr>
        );

        // Le decimos a la clase que haga los cálculos y dibuje la primera página
        paginadorPermisos.render();
        
    } catch (error) {
        console.error("Error al obtener permisos:", error);
        
        if (error.status === 403 || (error.message && error.message.includes('403'))) {
            window.location.href = "/proyecto-tareas/dashboard";
            return;
        }

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