import { tareaService } from "../../services/tareaService.js";
import { tableTareaTemplate } from "../../templates/tareas/tableTareaTemplate.js";
import { initAsignarEquipo } from "./asignarEquipo.js";


let tareasCache = [];
let textoBusquedaTarea = "";
let usuarioActualCache = null;
let idEstadoActual = 0;
let idPrioridadActual = 0;

/**
 * Función centralizada que aplica búsqueda por texto + filtros de dropdowns
 */
const aplicarFiltrosYBusquedaTareas = () => {
    let resultado = [...tareasCache];

    // Filtrar por Estado 
    if (idEstadoActual > 0) {
        resultado = resultado.filter(t => Number(t.fk_id_estado) === idEstadoActual);
    }

    // Filtrar por Prioridad 
    if (idPrioridadActual > 0) {
        resultado = resultado.filter(t => Number(t.fk_id_prioridad) === idPrioridadActual);
    }

    // Filtrar por texto de búsqueda 
    if (textoBusquedaTarea.trim() !== "") {
        const q = textoBusquedaTarea.trim().toLowerCase();
        resultado = resultado.filter((t) => {
            const titulo = (t.titulo || '').toLowerCase();
            const descripcion = (t.descripcion || '').toLowerCase();
            const equipo = (t.nombre_equipo || '').toLowerCase();
            const asignado = `${t.nombre_usuario_asignado || ''} ${t.apellido_usuario_asignado || ''}`.toLowerCase();

            return (
                titulo.includes(q) ||
                descripcion.includes(q) ||
                equipo.includes(q) ||
                asignado.includes(q)
            );
        });
    }

 // Renderizado en el contenedor principal
    const contenedor = document.getElementById("tablaTareasBody");
    if (contenedor) {
        contenedor.innerHTML = tableTareaTemplate(resultado, usuarioActualCache);

        // Re-vinculamos los eventos de los modales según el rol
        const idRol = usuarioActualCache ? Number(usuarioActualCache.id_rol ?? usuarioActualCache.fk_id_rol) : null;
        if (idRol === 1) {
            initAsignarEquipo();
            initAsignarMiembro();
        } else if (idRol === 2) {
            initAsignarMiembro();
        }
    }
};

/**
 * Guarda el dataset completo devuelto por la API
 */
export const setTareasCache = (tareas = [], user = null) => {
    tareasCache = tareas;
    usuarioActualCache = user;
};

export const initFilterTarea = async () => {
    const inputBuscar = document.getElementById("inputBuscarTarea");
    const selectFiltroEstado = document.getElementById("selectFiltroEstado");
    const selectFiltroPrioridad = document.getElementById("selectFiltroPrioridad");

    // Buscador por texto (Búsqueda en tiempo real)
    if (inputBuscar && !inputBuscar.dataset.listener) {
        inputBuscar.dataset.listener = "true";
        inputBuscar.addEventListener("input", (e) => {
            textoBusquedaTarea = e.target.value;
            aplicarFiltrosYBusquedaTareas();
        });
    }

    try {
        if (selectFiltroEstado) {
            const resEst = await tareaService.getEstados();
            if (resEst.ok && resEst.estados) {
                selectFiltroEstado.innerHTML = `
                    <option value="0">Todos los estados</option>
                    ${resEst.estados.map(est => `
                        <option value="${est.id_estado}">${est.tipoEstado}</option>
                    `).join("")}
                `;
            }
            selectFiltroEstado.addEventListener("change", (e) => {
                idEstadoActual = Number(e.target.value);
                aplicarFiltrosYBusquedaTareas();
            });
        }

        if (selectFiltroPrioridad) {
            const resPrio = await tareaService.getPrioridades();
            if (resPrio.ok && resPrio.prioridades) {
                selectFiltroPrioridad.innerHTML = `
                    <option value="0">Todas las prioridades</option>
                    ${resPrio.prioridades.map(prio => `
                        <option value="${prio.id}">${prio.nombre}</option>
                    `).join("")}
                `;
            }
            selectFiltroPrioridad.addEventListener("change", (e) => {
                idPrioridadActual = Number(e.target.value);
                aplicarFiltrosYBusquedaTareas();
            });
        }
    } catch (err) {
        console.error("Error inicializando los filtros de tareas:", err);
    }
};