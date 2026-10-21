import { rolService } from "../../services/rolService.js";
import { permisoService } from "../../services/permisoService.js";

// Función auxiliar para renderizar los checkboxes de permisos en el modal
export const renderCheckboxesPermisos = (todosPermisos = [], asignadosIds = []) => {
    const contenedor = document.getElementById("contenedorPermisosRol");
    if (!contenedor) return;

    if (!todosPermisos || todosPermisos.length === 0) {
        contenedor.innerHTML = '<p class="text-muted small mb-0 text-center py-2">No hay permisos registrados en el sistema.</p>';
        return;
    }

    const html = todosPermisos.map(p => {
        const isChecked = asignadosIds.includes(parseInt(p.id)) ? 'checked' : '';
        return `
            <div class="form-check py-1 border-bottom border-light">
                <input class="form-check-input check-permiso" type="checkbox" value="${p.id}" id="permiso_${p.id}" ${isChecked}>
                <label class="form-check-label small d-flex flex-column" for="permiso_${p.id}">
                    <span class="fw-semibold text-dark">${p.nombre}</span>
                    ${p.descripcion ? `<span class="text-muted" style="font-size: 11px;">${p.descripcion}</span>` : ''}
                </label>
            </div>
        `;
    }).join("");

    contenedor.innerHTML = html;
};

// Carga los permisos disponibles cuando se va a crear un nuevo rol
export const cargarPermisosParaCrear = async () => {
    const contenedor = document.getElementById("contenedorPermisosRol");
    if (!contenedor) return;

    contenedor.innerHTML = '<p class="text-muted small mb-0 text-center py-2"><i class="fas fa-spinner fa-spin me-1"></i> Cargando permisos...</p>';

    try {
        const res = await permisoService.getAll();
        const listaPermisos = res.data || res.permisos || [];
        renderCheckboxesPermisos(listaPermisos, []);
    } catch (e) {
        console.error("Error al cargar permisos:", e);
        contenedor.innerHTML = '<p class="text-danger small mb-0 text-center py-2">Error al cargar catálogo de permisos.</p>';
    }
};

export const prepareEditRol = async (id) => {
    const modalRolEl = document.getElementById("modalRol");
    if (!modalRolEl) return;

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalRolEl);
    
    // Cambiamos el título del modal para que el usuario sepa que está editando
    document.getElementById("modalRolTitulo").innerText = "Editar Rol";
    
    // Mostramos el modal
    modalInstance.show();

    const contenedor = document.getElementById("contenedorPermisosRol");
    if (contenedor) {
        contenedor.innerHTML = '<p class="text-muted small mb-0 text-center py-2"><i class="fas fa-spinner fa-spin me-1"></i> Cargando permisos asignados...</p>';
    }

    try {
        // Buscamos los datos actuales del rol y sus permisos
        const response = await rolService.getParaEditar(id);
        
        if (response.success || response.ok) {
            const rol = response.rol || response.data;
            const todosPermisos = response.todos_permisos || [];
            const asignados = (response.permisos_asignados || []).map(x => parseInt(x));
            
            // Rellenamos el formulario (incluyendo el input oculto)
            document.getElementById("id_rol").value = rol.id;
            document.getElementById("rolNombre").value = rol.nombre;
            document.getElementById("rolDescripcion").value = rol.descripcion || "";

            // Renderizamos los checkboxes marcando los que ya tiene asignados
            renderCheckboxesPermisos(todosPermisos, asignados);
        } else {
            alert("No se pudo cargar la información del rol.");
            modalInstance.hide();
        }
    } catch (error) {
        console.error("Error al cargar para editar:", error);
        alert("Error de conexión al cargar datos.");
        modalInstance.hide();
    }
};