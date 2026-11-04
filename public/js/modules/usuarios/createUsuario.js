import { usuarioService } from "../../services/usuarioService.js";
import { getUsuarios } from "./getUsuarios.js";
import { showToast } from "../../ui/alert.js";

export const initCreateUsuario = () => {
    const form = document.getElementById("formUsuario");
    const modalEl = document.getElementById("modalUsuario");

    if (!form || !modalEl) return;

    // Escuchamos el envío del formulario del modal (Admin edita solo Rol y Equipo)
    form.onsubmit = async (e) => {
        e.preventDefault();

        const id = document.getElementById("id_usuario").value;
        const fk_id_rol = document.getElementById("usuarioRol").value;
        const fk_id_equipo = document.getElementById("usuarioEquipo").value;

        if (!id) return;

        if (!fk_id_rol) {
            showToast("Por favor, seleccioná un rol para el usuario.", "warning");
            return;
        }

        const data = {
            fk_id_rol,
            fk_id_equipo,
        };

        try {
            const response = await usuarioService.update(id, data);

            if (response.success || response.ok) {
                showToast("Rol y equipo actualizados con éxito.", "success");

                const modalInstance =
                    bootstrap.Modal.getInstance(modalEl) ||
                    bootstrap.Modal.getOrCreateInstance(modalEl);
                modalInstance.hide();

                form.reset();
                document.getElementById("id_usuario").value = "";

                getUsuarios();
            } else {
                showToast(response.message || "Ocurrió un error al procesar la solicitud.", "error");
            }
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
            showToast(error.message || "Ocurrió un error al intentar guardar.", "error");
        }
    };
};