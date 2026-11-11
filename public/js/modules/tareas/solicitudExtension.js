export const initSolicitudExtension = () => {

    //Evitar que el evento se registre más de una vez
    if (window.solicitudExtensionIniciada) return;
    window.solicitudExtensionIniciada = true;

    document.addEventListener("click", async (e) => {
        const btn = e.target.closest(".btn-solicitar-extension");
        if (!btn) return;

        const idTarea = btn.dataset.id;

        if (!confirm("¿Deseas solicitar al líder una extensión de fecha para esta tarea?")) {
            return;
        }

        // Bloquear el botón temporalmente para evitar doble clic
        const contenidoOriginal = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Enviando...`;
        btn.style.pointerEvents = "none";

        const formData = new FormData();
        formData.append("id_tarea", idTarea);
        formData.append("tipo", "extension_fecha");

        try {
            const res = await fetch("/proyecto-tareas/api/solicitudes/crear", {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.ok) {
                
                btn.classList.replace("btn-danger", "btn-secondary");
                btn.innerHTML = `<i class="fas fa-check"></i> Solicitud enviada`;
            } else {
                alert(data.message || "Error al enviar la solicitud.");
              
                btn.innerHTML = contenidoOriginal;
                btn.style.pointerEvents = "auto";
            }
        } catch (error) {
            console.error("Error solicitando extensión:", error);
            alert("Error de conexión con el servidor.");
            btn.innerHTML = contenidoOriginal;
            btn.style.pointerEvents = "auto";
        }
    });
};