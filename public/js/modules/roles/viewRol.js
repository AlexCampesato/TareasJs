import { rolService } from "../../services/rolService.js";

export const viewRol = async (id) => {
    const modalVerEl = document.getElementById("modalVerRol");
    if (!modalVerEl) return;

    // Instanciamos el modal de Bootstrap y lo mostramos
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalVerEl);
    
    // Ponemos estado de carga mientras esperamos la respuesta del backend
    document.getElementById("verRolId").innerText = id;
    document.getElementById("verRolNombre").innerHTML = '<i class="fas fa-spinner fa-spin text-muted"></i> Cargando...';
    document.getElementById("verRolDescripcion").innerHTML = '<i class="fas fa-spinner fa-spin text-muted"></i> Cargando...';
   

    modalInstance.show();

    try {
        // Pedimos los datos específicos de este rol al servidor
        const response = await rolService.getById(id);
        

        if (response.success || response.ok) {
            const rol = response.rol || response.data;
            
            document.getElementById("verRolNombre").innerText = rol.nombre;
            document.getElementById("verRolDescripcion").innerText = rol.descripcion || "Sin descripción";

        } else {
            document.getElementById("verRolNombre").innerText = "Error";
            document.getElementById("verRolDescripcion").innerText = response.message || "No se pudo cargar la información.";
        }
    } catch (error) {
        console.error("Error al cargar detalles:", error);
        document.getElementById("verRolNombre").innerText = "Error de conexión";
        document.getElementById("verRolDescripcion").innerText = "No se pudo conectar con el servidor.";
    }
};