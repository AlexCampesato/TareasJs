import { usuarioService } from "../../services/usuarioService.js";
import { getUsuarios } from "./getUsuarios.js";
import { showSuccess, showError, showConfirm } from "../../ui/alert.js";

export const initCreateUsuario = () => {
    const form = document.getElementById("formUsuario");
    const modalEl = document.getElementById("modalUsuario");

    if (!form || !modalEl) return;

    const finalizarGuardado = () => {
        showSuccess("Rol y equipo actualizados con éxito.");

        const modalInstance =
            bootstrap.Modal.getInstance(modalEl) ||
            bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.hide();

        form.reset();
        document.getElementById("id_usuario").value = "";

        getUsuarios();
    };

    // Escuchamos el envío del formulario del modal (Admin edita solo Rol y Equipo)
    form.onsubmit = async (e) => {
        e.preventDefault();

        const id = document.getElementById("id_usuario").value;
        const fk_id_rol = document.getElementById("usuarioRol").value;
        const fk_id_equipo = document.getElementById("usuarioEquipo").value;

        if (!id) return;

        if (!fk_id_rol) {
            showError("Se debe seleccionar un rol para el usuario");
            return;
        }

        const data = {
            fk_id_rol,
            fk_id_equipo,
        };

        try {
            const response = await usuarioService.update(id, data);

            if (response?.success || response?.ok) {
                finalizarGuardado();
            } else if (response?.requiere_confirmacion) {
                const resConfirm = await showConfirm("Reemplazar Líder de Equipo", response.message);
                const confirmado = typeof resConfirm === "boolean" ? resConfirm : resConfirm?.isConfirmed;

                if (confirmado) {
                    const retryRes = await usuarioService.update(id, { ...data, forzar_reemplazo: true });
                    if (retryRes?.success || retryRes?.ok) {
                        finalizarGuardado();
                    } else {
                        showError(retryRes?.message || "No se pudo reemplazar el líder.");
                    }
                }
            } else {
                showError(response?.message || "Ocurrió un error al procesar la solicitud.");
            }
        } catch (error) {
            // Detectamos si es la confirmación de reemplazo
            if (error.message && error.message.includes("ya tiene un líder asignado")) {
                const resConfirm = await showConfirm("Reemplazar Líder de Equipo", error.message);
                const confirmado = typeof resConfirm === "boolean" ? resConfirm : resConfirm?.isConfirmed;

                if (confirmado) {
                    try {
                        const retryRes = await usuarioService.update(id, { ...data, forzar_reemplazo: true });
                        if (retryRes?.success || retryRes?.ok) {
                            finalizarGuardado();
                        } else {
                            showError(retryRes?.message || "No se pudo reemplazar el líder.");
                        }
                    } catch (retryError) {
                        showError(retryError.message || "Error al reemplazar el líder del equipo.");
                    }
                }
                return;
            }

            console.error("Error al guardar el usuario:", error);
            showError(error.message || "Ocurrió un error al intentar guardar.");
        }
    };
};