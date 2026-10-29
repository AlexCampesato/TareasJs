import { getTareas } from "./getTareas.js";
import { initFilterTarea } from "./filterTareas.js";
import { initCreateTarea } from "./createTarea.js";
import { initUpdateTarea, prepareEditTarea } from "./updateTarea.js";
import { deleteTarea } from "./deleteTarea.js";
import { authService } from "../services/authService.js";

export const initTareaModule = async() => {
  const tablaBody = document.getElementById("tablaTareasBody");
  if (!tablaBody) return; // Si la vista actual no tiene la tabla, no arranca nada

  // Obtener la sesión actual para verificar el rol
  const session = await authService.checkSession();
  if (!session.success || !session.user) return;

  const user = session.user;
  // ID 1 es Admin y ID 2 es Líder
  const puedeCrearYEditar = user.id_rol === 1 || user.id_rol === 2;

  // Carga inicial 
  getTareas();

  // Inicializar escuchadores de eventos
  initFilterTarea();

  // Condicionar la vista y los eventos según el rol
  if (puedeCrearYEditar) {
      // Habilitamos creación y actualización solo para admins/líderes
      initCreateTarea();
      initUpdateTarea();
  } else {
     // Forzamos la búsqueda del botón con un pequeño retardo por si el DOM aún se está construyendo
      setTimeout(() => {
          const btnNuevaTarea = document.getElementById("btnNuevaTarea");
          if (btnNuevaTarea) { 
              btnNuevaTarea.style.display = "none";
          }
      }, 100);
  }

  // Eventos delegados de la tabla (Editar / Eliminar)
  tablaBody.addEventListener("click", (e) => {
    const btnEdit = e.target.closest(".btn-editar-tarea");
    const btnDelete = e.target.closest(".btn-eliminar-tarea");

    if (btnEdit) prepareEditTarea(btnEdit.dataset.id);
    if (btnDelete) deleteTarea(btnDelete.dataset.id);
  });
};
