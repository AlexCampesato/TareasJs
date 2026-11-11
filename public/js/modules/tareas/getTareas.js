import { tareaService } from "../../services/tareaService.js";
import { tableTareaTemplate } from "../../templates/tareas/tableTareaTemplate.js";
import { authService } from "../../services/authService.js";
import { initAsignarEquipo } from "./asignarEquipo.js"; 
import { initAsignarMiembro } from "./asignarMiembro.js"; 
import { setTareasCache } from "./filterTareas.js";
import { initSolicitudExtension } from "./solicitudExtension.js";
import { initModalSolicitudes } from "../../services/solicitudService.js";

export const getTareas = async (idEstado = 0, idPrioridad = 0) => {
    const tablaBody = document.getElementById("tablaTareasBody");
    
    if (!tablaBody) return;

    try {
        // Obtenemos el usuario en sesión para conocer su rol
        const session = await authService.checkSession();
        const user = session.success ? session.user : null;

        // Obtenemos las tareas desde el servicio
        const response = await tareaService.getAll(idEstado, idPrioridad);
        
        console.log("ID ESTADO:", idEstado);
        console.log("RESPUESTA TAREAS:", response);

        if (!response.ok) {
            throw new Error("No se pudieron obtener las tareas.");
        }

        const tareas = response.tareas || [];

        //Guardamos en el caché de filtro el listado y el objeto usuario actual
        setTareasCache(tareas, user);

        // Renderizamos el template inicial
        tablaBody.innerHTML = tableTareaTemplate(tareas, user);

        // Re-vinculamos eventos de modales según jerarquía
        const idRol = user ? Number(user.id_rol ?? user.fk_id_rol) : null;
        if (idRol === 1) {
            initAsignarEquipo();
            
            initAsignarMiembro();
        } else if (idRol === 2) {
            
            initModalSolicitudes();
            initAsignarMiembro();
        }
        initSolicitudExtension();
    } catch (error) {
        console.error("Error al obtener tareas:", error);

        tablaBody.innerHTML = `
           <div class="col-12 text-center py-4 text-danger">
                Error al cargar las tareas.
            </div>
        `;
    }
};