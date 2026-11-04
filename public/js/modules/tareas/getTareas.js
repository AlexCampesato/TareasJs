
import { tareaService } from "../../services/tareaService.js";
import { tableTareaTemplate } from "../../templates/tareas/tableTareaTemplate.js";
import { authService } from "../../services/authService.js";
import { initAsignarEquipo } from "./asignarEquipo.js"; 
import { initAsignarMiembro } from "./asignarMiembro.js"; 

export const getTareas = async (idEstado = 0, idPrioridad = 0) => {
    const tablaBody = document.getElementById("tablaTareasBody");
    
    if (!tablaBody) return;

    try {

      // Obtenemos el usuario en sesión para saber su rol
      const session = await authService.checkSession();
      const user = session.success ? session.user : null;

      // Obtenemos las tareas
      const response = await tareaService.getAll(idEstado, idPrioridad);
      
      console.log("ID ESTADO:", idEstado);
      console.log("RESPUESTA TAREAS:", response);


        if (!response.ok) {
            throw new Error("No se pudieron obtener las tareas.");
        }
        // Le enviamos tanto el listado de tareas como los datos del usuario al template
        tablaBody.innerHTML = tableTareaTemplate(
            response.tareas || [], 
            user
        );

        // Volvemos a vincular los eventos de asignación sobre las nuevas cards
        const idRol = user ? Number(user.id_rol) : null;
        if (idRol === 1) {
            initAsignarEquipo();
            initAsignarMiembro();
        } else if (idRol === 2) {
            initAsignarMiembro();
        }
        
    } catch (error) {
        console.error("Error al obtener tareas:", error);

        tablaBody.innerHTML = `
           <div class="col-12 text-center py-4 text-danger">
                Error al cargar las tareas.
            </div>
        `;
    }
};

