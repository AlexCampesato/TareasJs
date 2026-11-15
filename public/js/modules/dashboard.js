import { renderAdminLayout, initAdminLayout } from "../templates/layout.js";
import { dashboardTemplate } from "../templates/dashboardTemplate.js";
import { asignarEquipoTemplate } from "../templates/tareas/asignarEquipoTemplate.js";
import { prioridadTemplate } from "../templates/tareas/prioridadTemplate.js";
import { cambiarEstadoTemplate } from "../templates/tareas/cambiarEstadoTemplate.js";
import { asignarMiembroTemplate} from "../templates/tareas/asignarMiembroTemplate.js";
import { solicitudesTemplate} from "../templates/tareas/solicitudesTemplate.js";

import { getTareas } from "./tareas/getTareas.js";
import { initCreateTarea } from "./tareas/createTarea.js";
import { initFilterTarea } from "./tareas/filterTareas.js";
import { initUpdateTarea } from "./tareas/updateTarea.js";
import { initDeleteTarea } from "./tareas/deleteTarea.js";
import { initAsignarEquipo } from "./tareas/asignarEquipo.js";
import { initAsignarMiembro } from "./tareas/asignarMiembro.js";
import { initModalSolicitudes, actualizarContadorSolicitudes } from "../services/solicitudService.js";

import { authService } from "../services/authService.js";
import { tienePermiso } from "../utils/permissions.js";

export const renderDashboard = async (container) => {
    try {
       // Verificamos primero la sesión con la API para obtener el usuario real
        const response = await authService.checkSession();

        if (!response.success || !response.user) {
            window.location.href = "/proyecto-tareas/login";
            return;
        }

        const user = response.user;
       
        // Renderizamos la estructura del Layout con el Dashboard adentro
        container.innerHTML = renderAdminLayout(dashboardTemplate(user)) 
                             + asignarEquipoTemplate()
                             + prioridadTemplate()
                             + cambiarEstadoTemplate()
                             + asignarMiembroTemplate()
                             + solicitudesTemplate();

        // Inicializamos los datos del layout 
        initAdminLayout(user);
       
        const idRol = Number(user.id_rol ?? user.fk_id_rol ?? 0);

        // Inicializamos el filtro de tareas y cambiar estado
        initFilterTarea();
        initUpdateTarea();

        //Inicializamos los listeners de acciones de forma modular basándonos en PERMISOS
        if (tienePermiso("tareas.crear")) {
            initCreateTarea();
        }

        if (tienePermiso("tareas.eliminar")) {
            initDeleteTarea();
        }

        if (tienePermiso("tareas.asignar_equipo")) {
            initAsignarEquipo();
        }

        if (tienePermiso("tareas.asignar_miembro")) {
            initAsignarMiembro();
        }

        if (tienePermiso("solicitudes.ver")) {
            initModalSolicitudes();
            actualizarContadorSolicitudes();
            const intervaloSolicitudes = setInterval(actualizarContadorSolicitudes, 5000);
        }

        // Cargamos las tareas 
        await getTareas();

    } catch (error) {
        console.error("Error al renderizar el Dashboard con Layout:", error);
    }
};