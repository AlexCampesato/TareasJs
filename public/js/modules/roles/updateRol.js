import { rolService } from "../../services/rolService.js";

export const prepareEditRol = async (id) => {
    const modalRolEl = document.getElementById("modalRol");
    if (!modalRolEl) return;

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalRolEl);
    
    // Cambiamos el título del modal para que el usuario sepa que está editando
    document.getElementById("modalRolTitulo").innerText = "Editar Rol";
    
    // Mostramos el modal
    modalInstance.show();

    try {
        // Buscamos los datos actuales del permiso a traves del service
        const response = await rolService.getById(id);
        
        if (response.success || response.ok) {
            const rol = response.rol || response.data;
            
            // Rellenamos el formulario (incluyendo el input oculto)
            document.getElementById("id_rol").value = rol.id;
            document.getElementById("rolNombre").value = rol.nombre;
            document.getElementById("rolDescripcion").value = rol.descripcion || "";
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