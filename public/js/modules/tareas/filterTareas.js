
import { tareaService } from "../../services/tareaService.js";
import { getTareas } from "./getTareas.js";

export const initFilterTarea = async () => {
    const selectFiltroEstado = document.getElementById("selectFiltroEstado");

    const selectFiltroPrioridad = document.getElementById("selectFiltroPrioridad");

    if (!selectFiltroEstado && !selectFiltroPrioridad) return;

    // Helper para ejecutar la búsqueda combinando los dos valores
    const aplicarFiltros = async () => {
        const idEstado = selectFiltroEstado ? Number(selectFiltroEstado.value) : 0;
        const idPrioridad = selectFiltroPrioridad ? Number(selectFiltroPrioridad.value) : 0;
        
        await getTareas(idEstado, idPrioridad);
    };

   try {
        //  Cargar Estados
        if (selectFiltroEstado) {
            const responseEstados = await tareaService.getEstados();
            if (responseEstados.ok && responseEstados.estados) {
                selectFiltroEstado.innerHTML = `
                    <option value="0">Todos los estados</option>
                    ${responseEstados.estados
                        .map(
                            (estado) => `
                                <option value="${estado.id_estado}" style="color: ${estado.color}; font-weight: 600;">
                                    ${estado.tipoEstado}
                                </option>
                            `
                        )
                        .join("")}
                `;
            }

            selectFiltroEstado.addEventListener("change", aplicarFiltros);
        }

        //  Cargar Prioridades
        if (selectFiltroPrioridad) {
            const responsePrioridades = await tareaService.getPrioridades();
            if (responsePrioridades.ok && responsePrioridades.prioridades) {
                selectFiltroPrioridad.innerHTML = `
                    <option value="0">Todas las prioridades</option>
                    ${responsePrioridades.prioridades
                        .map(
                            (prio) => `
                                <option value="${prio.id}">
                                    ${prio.nombre}
                                </option>
                            `
                        )
                        .join("")}
                `;
            }

            selectFiltroPrioridad.addEventListener("change", aplicarFiltros);
        }

    } catch (error) {
        console.error("Error al inicializar los filtros:", error);
    }
};