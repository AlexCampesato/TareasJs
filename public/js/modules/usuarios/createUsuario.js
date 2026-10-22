import { usuarioService } from "../../services/usuarioService.js";
import { getUsuarios } from "./getUsuarios.js";
import { rolService } from "../../services/rolService.js";
import { equipoService } from "../../services/equipoService.js";

export const initCreateUsuario = () => {
    const form = document.getElementById("formUsuario");
    const modalEl = document.getElementById("modalUsuario");

    if (!form || !modalEl) return;

    // Escuchamos el envío del formulario del modal
    form.onsubmit = async (e) => {
        e.preventDefault();

        const id = document.getElementById("id_usuario").value;
        const nombre = document.getElementById("usuarioNombre").value.trim();
        const apellido = document.getElementById("usuarioApellido").value.trim();
        const email = document.getElementById("usuarioEmail").value.trim();
        const passInput = document.getElementById("usuarioPass");
        const pass = passInput ? passInput.value.trim() : "";

        // Atrapamos los valores seleccionados (¡Esto evita el error en PHP!)
        const fk_id_rol = document.getElementById("usuarioRol").value;
        const fk_id_equipo = document.getElementById("usuarioEquipo").value;

        // Validación básica
        if (!nombre || !apellido || !email || !fk_id_rol) {
            alert("Por favor, completa todos los campos requeridos (incluyendo el rol).");
            return;
        }

        if (!id && !pass) {
            alert("Por favor, ingresá una contraseña para el nuevo usuario.");
            return;
        }

        const data = {
            nombre,
            apellido,
            email,
            fk_id_rol,    
            fk_id_equipo
        };

        if (pass) {
            data.pass = pass;
        }

        try {
            let response;

            if (id) {
                // Si el formulario contiene un ID, estamos EDITANDO
                response = await usuarioService.update(id, data);
            } else {
                // Si el ID está vacío, el ADMIN está CREANDO un nuevo usuario
                response = await usuarioService.create(data);
            }

            if (response.success || response.ok) {
                if (typeof toastr !== "undefined") {
                    toastr.success(id ? "Usuario actualizado con éxito." : "Usuario creado exitosamente.");
                } else {
                    alert(id ? "Usuario actualizado con éxito." : "Usuario creado exitosamente.");
                }

                // Ocultamos el modal de Bootstrap
                const modalInstance = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
                modalInstance.hide();

                // Limpiamos el formulario y reseteamos el ID
                form.reset();
                document.getElementById("id_usuario").value = "";
                
                const titulo = document.getElementById("modalUsuarioTitulo");
                if (titulo) titulo.innerText = "Nuevo Usuario";

                // Recargamos la tabla de usuarios dinámicamente
                getUsuarios();
            } else {
                alert(response.message || "Ocurrió un error al procesar la solicitud.");
            }
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
            alert(error.message || "Ocurrió un error al intentar guardar.");
        }
    };

    // Evento para limpiar el formulario cuando el admin abre el modal haciendo clic en "+ Nuevo Usuario"
    modalEl.addEventListener("show.bs.modal", async (e) => {
        const button = e.relatedTarget;
        // Si el botón que abrió el modal fue "+ Nuevo Usuario" (no el de editar)
        if (button && button.getAttribute("data-bs-target") === "#modalUsuario") {
            form.reset();
            document.getElementById("id_usuario").value = "";
            const titulo = document.getElementById("modalUsuarioTitulo");
            if (titulo) titulo.innerText = "Nuevo Usuario";

            const ayudaPass = document.getElementById("ayudaUsuarioPass");
            if (ayudaPass) ayudaPass.style.display = "none";

            // Cargamos los roles y equipos desde la BD
            try {
                const [rolesRes, equiposRes] = await Promise.all([
                    rolService.getAll(),
                    equipoService.getAll()
                ]);

                const selectRol = document.getElementById("usuarioRol");
                if (selectRol && (rolesRes.success || rolesRes.ok)) {
                    const roles = rolesRes.data || rolesRes.roles || [];
                    selectRol.innerHTML = '<option value="">Sin rol</option>';
                    roles.forEach(rol => selectRol.innerHTML += `<option value="${rol.id}">${rol.nombre}</option>`);
                }

                const selectEquipo = document.getElementById("usuarioEquipo");
                if (selectEquipo && (equiposRes.success || equiposRes.ok)) {
                    const equipos = equiposRes.data || equiposRes.equipos || [];
                    selectEquipo.innerHTML = '<option value="">Sin equipo asignado</option>';
                    equipos.forEach(equipo => selectEquipo.innerHTML += `<option value="${equipo.id}">${equipo.nombre}</option>`);
                }
            } catch (error) {
                console.error("Error cargando roles/equipos:", error);
            }
        }
    });
};