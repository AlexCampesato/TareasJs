import { equipoService } from "../../services/equipoService.js";

export const viewEquipo = async (id) => {
    const modalVerEl = document.getElementById("modalVerEquipo");
    if (!modalVerEl) return;

    // Instanciamos el modal de Bootstrap y lo mostramos
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalVerEl);
    
    // Ponemos estado de carga mientras esperamos la respuesta del backend
    document.getElementById("verEquipoId").innerText = id;
    document.getElementById("verEquipoNombre").innerHTML = '<i class="fas fa-spinner fa-spin text-muted"></i> Cargando...';
    document.getElementById("verEquipoDescripcion").innerHTML = '<i class="fas fa-spinner fa-spin text-muted"></i> Cargando...';
    document.getElementById("verEquipoIntegrantes").innerHTML = '<li class="list-group-item text-muted">Cargando integrantes...</li>';

    modalInstance.show();

    try {
        // Pedimos los datos específicos de este equipo al servidor
        const response = await equipoService.getById(id);
        const integrantes = response.integrantes || [];

        if (response.success || response.ok) {
            const equipo = response.equipo || response.data;
            
            document.getElementById("verEquipoNombre").innerText = equipo.nombre;
            document.getElementById("verEquipoDescripcion").innerText = equipo.descripcion || "Sin descripción";

            // Llenamos la lista de integrantes
            const listaHtml = document.getElementById("verEquipoIntegrantes");
            listaHtml.innerHTML = ""; // Limpiamos el "Cargando..."

            if (integrantes.length > 0) {
                integrantes.forEach(persona => {

                    // Evaluamos si la persona es Líder (Rol 2 o por nombre_rol)
                    const esLider = Number(persona.fk_id_rol || persona.id_rol) === 2 || 
                                    (persona.nombre_rol && persona.nombre_rol.toLowerCase() === 'líder');

                    const badgeRol = esLider
                        ? `<span class="badge bg-warning text-dark fw-bold ms-auto px-2 py-1"><i class="fas fa-user-shield me-1"></i>Líder</span>`
                        : `<span class="badge bg-secondary text-white ms-auto px-2 py-1">Miembro</span>`;


                    listaHtml.innerHTML += `
                        <li class="list-group-item px-0 d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-user-circle fa-lg text-secondary me-2"></i> 
                                <span class="fw-medium">${persona.nombre} ${persona.apellido || ''}</span>
                            </div>
                            ${badgeRol}
                        </li>`;
                });
            } else {
                listaHtml.innerHTML = '<li class="list-group-item px-0 text-muted fst-italic">No hay integrantes asignados.</li>';
            }

        } else {
            document.getElementById("verEquipoNombre").innerText = "Error";
            document.getElementById("verEquipoDescripcion").innerText = response.message || "No se pudo cargar la información.";
        }
    } catch (error) {
        console.error("Error al cargar detalles:", error);
        document.getElementById("verEquipoNombre").innerText = "Error de conexión";
        document.getElementById("verEquipoDescripcion").innerText = "No se pudo conectar con el servidor.";
    }
};