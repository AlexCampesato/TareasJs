import { permisoService } from "../../services/permisoService.js";

export const prepareEditPermiso = async (id) => {
    const modalPermisoEl = document.getElementById("modalPermiso");
    if (!modalPermisoEl) return;

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalPermisoEl);
    
    // Cambiamos el título del modal para que el usuario sepa que está editando
    document.getElementById("modalPermisoTitulo").innerText = "Editar Permiso";
    
    // Mostramos el modal
    modalInstance.show();

    try {
        // Buscamos los datos actuales del permiso a traves del service
        const response = await permisoService.getById(id);
        
        if (response.success || response.ok) {
            const permiso = response.permiso || response.data;
            
            // Rellenamos el formulario (incluyendo el input oculto)
            document.getElementById("id_permiso").value = permiso.id;
            document.getElementById("permisoNombre").value = permiso.nombre;
            document.getElementById("permisoDescripcion").value = permiso.descripcion || "";
        } else {
            alert("No se pudo cargar la información del permiso.");
            modalInstance.hide();
        }
    } catch (error) {
        console.error("Error al cargar para editar:", error);
        alert("Error de conexión al cargar datos.");
        modalInstance.hide();
    }
};