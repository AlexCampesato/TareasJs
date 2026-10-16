import { equipoService } from "../../services/equipoService.js";

export const prepareEditEquipo = async (id) => {
    const modalEquipoEl = document.getElementById("modalEquipo");
    if (!modalEquipoEl) return;

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEquipoEl);
    
    // Cambiamos el título del modal para que el usuario sepa que está editando
    document.getElementById("modalEquipoTitulo").innerText = "Editar Equipo";
    
    // Mostramos el modal
    modalInstance.show();

    try {
        // Buscamos los datos actuales del equipo a traves del service
        const response = await equipoService.getById(id);
        
        if (response.success || response.ok) {
            const equipo = response.equipo || response.data;
            
            // Rellenamos el formulario (incluyendo el input oculto)
            document.getElementById("id_equipo").value = equipo.id;
            document.getElementById("equipoNombre").value = equipo.nombre;
            document.getElementById("equipoDescripcion").value = equipo.descripcion || "";
        } else {
            alert("No se pudo cargar la información del equipo.");
            modalInstance.hide();
        }
    } catch (error) {
        console.error("Error al cargar para editar:", error);
        alert("Error de conexión al cargar datos.");
        modalInstance.hide();
    }
};