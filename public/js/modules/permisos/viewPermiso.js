import { permisoService } from "../../services/permisoService.js";

export const viewPermiso = async (id) => {
    const modalVerEl = document.getElementById("modalVerPermiso");
    if (!modalVerEl) return;

    // Instanciamos el modal de Bootstrap y lo mostramos
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalVerEl);
    
    // Ponemos estado de carga mientras esperamos la respuesta del backend
    document.getElementById("verPermisoId").innerText = id;
    document.getElementById("verPermisoNombre").innerHTML = '<i class="fas fa-spinner fa-spin text-muted"></i> Cargando...';
    document.getElementById("verPermisoDescripcion").innerHTML = '<i class="fas fa-spinner fa-spin text-muted"></i> Cargando...';
   

    modalInstance.show();

    try {
        // Pedimos los datos específicos de este permiso al servidor
        const response = await permisoService.getById(id);
        

        if (response.success || response.ok) {
            const permiso = response.permiso || response.data;
            
            document.getElementById("verPermisoNombre").innerText = permiso.nombre;
            document.getElementById("verPermisoDescripcion").innerText = permiso.descripcion || "Sin descripción";

        } else {
            document.getElementById("verPermisoNombre").innerText = "Error";
            document.getElementById("verPermisoDescripcion").innerText = response.message || "No se pudo cargar la información.";
        }
    } catch (error) {
        console.error("Error al cargar detalles:", error);
        document.getElementById("verPermisoNombre").innerText = "Error de conexión";
        document.getElementById("verPermisoDescripcion").innerText = "No se pudo conectar con el servidor.";
    }
};