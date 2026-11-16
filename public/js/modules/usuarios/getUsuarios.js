import { usuarioService } from "../../services/usuarioService.js";
import { tableUsuarioTemplate } from "../../templates/usuarios/tableUsuarioTemplate.js";
import { Pagination } from "../../utils/Pagination.js";
import { renderTarjetaResumen } from "../../utils/CardHelpers.js";

let usuariosCache = [];
let paginadorUsuarios = null;
let filtrosActivos = [];
let textoBusquedaActual = "";

// Renderiza las 4 tarjetas superiores de resumen a partir de los datos reales
const renderizarResumenUsuarios = (usuarios = []) => {
    const contenedorResumen = document.getElementById("resumenUsuarios");
    if (!contenedorResumen) return;

    const total = usuarios.length;
    const activos = usuarios.filter(
        (u) => u.activo === undefined || parseInt(u.activo) === 1
    ).length;
    const sinEquipo = usuarios.filter(
        (u) => !u.fk_id_equipo || !u.equipo_nombre
    ).length;
    const sinRol = usuarios.filter(
        (u) => !u.fk_id_rol || !u.rol_nombre
    ).length;

    contenedorResumen.innerHTML = [
        renderTarjetaResumen("Total Usuarios", total, "fa-users", "primary"),
        renderTarjetaResumen("Miembros Activos", activos, "fa-user-shield", "success"),
        renderTarjetaResumen("Sin Asignar Equipo", sinEquipo, "fa-sitemap", "warning"),
        renderTarjetaResumen("Sin Rol Asignado", sinRol, "fa-id-badge", "info"),
    ].join("");
};

// Función centralizada que combina búsqueda por texto y filtros por checkboxes
const aplicarFiltrosYBusqueda = () => {
    let resultado = [...usuariosCache];

    // Filtrar por checkboxes acumulativos
    if (filtrosActivos.length > 0) {
        resultado = resultado.filter(u => {
            let cumple = true;

            if (filtrosActivos.includes("inactivos") && parseInt(u.activo) !== 0) {
                cumple = false;
            }
            if (filtrosActivos.includes("sin_equipo") && (u.fk_id_equipo && u.fk_id_equipo !== null && u.equipo_nombre !== null)) {
                cumple = false;
            }
            if (filtrosActivos.includes("sin_rol") && (u.fk_id_rol && u.fk_id_rol !== null && u.rol_nombre !== null)) {
                cumple = false;
            }

            return cumple;
        });
    }

    // Filtrar por texto de búsqueda
    if (textoBusquedaActual.trim() !== "") {
        const q = textoBusquedaActual.trim().toLowerCase();
        resultado = resultado.filter((u) => {
            const nombreCompleto = `${u.nombre || ''} ${u.apellido || ''}`.toLowerCase();
            const email = (u.email || '').toLowerCase();
            const rol = (u.rol_nombre || '').toLowerCase();
            const equipo = (u.equipo_nombre || '').toLowerCase();
            return (
                nombreCompleto.includes(q) ||
                email.includes(q) ||
                rol.includes(q) ||
                equipo.includes(q)
            );
        });
    }

    // Actualizar datos en el paginador
    if (paginadorUsuarios) {
        paginadorUsuarios.updateData(resultado);
    }
};

const configurarFiltrosYBusqueda = () => {
    const inputBuscar = document.getElementById("inputBuscarUsuario");
    const checkboxes = document.querySelectorAll(".filtro-checkbox");

    if (inputBuscar) {
        inputBuscar.addEventListener("input", (e) => {
            textoBusquedaActual = e.target.value;
            aplicarFiltrosYBusqueda();
        });
    }

    checkboxes.forEach(chk => {
        chk.addEventListener("change", () => {
            filtrosActivos = Array.from(checkboxes)
                .filter(c => c.checked)
                .map(c => c.value);
            aplicarFiltrosYBusqueda();
        });
    });
};

export const filtrarUsuariosLocal = (termino = "") => {
    textoBusquedaActual = termino;
    aplicarFiltrosYBusqueda();
};

export const getUsuarios = async () => {
    const tablaBody = document.getElementById("tablaUsuariosBody");
    const paginationContainer = document.getElementById("paginacionUsuarios");

    if (!tablaBody || !paginationContainer) return;

    try {
        const response = await usuarioService.getAll();

        if (
            response.status === 403 || 
            (response.success === false && response.message?.toLowerCase().includes('no tienes permiso'))
        ) {
            window.location.href = "/proyecto-tareas/dashboard";
            return;
        }
        
        if (response.ok === false || response.success === false) {
            throw new Error("No se pudieron obtener los usuarios.");
        }

        usuariosCache = response.data || [];

        // Actualizar las 4 tarjetas superiores de resumen
        renderizarResumenUsuarios(usuariosCache);

        // paginación con las cards de usuarios
        paginadorUsuarios = new Pagination(
            usuariosCache, 
            8, // Cantidad de cards por página
            tablaBody, 
            paginationContainer, 
            tableUsuarioTemplate
        );
        paginadorUsuarios.render();

        configurarFiltrosYBusqueda();

       
        const inputBuscar = document.getElementById("inputBuscarUsuario");
        if (inputBuscar && inputBuscar.value.trim() !== "") {
            textoBusquedaActual = inputBuscar.value;
            aplicarFiltrosYBusqueda();
        }
        
    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        // Si el error contiene 403 o código de acceso denegado, redirigimos también
        if (error.status === 403 || (error.message && error.message.includes('403'))) {
            window.location.href = "/proyecto-tareas/dashboard";
            return;
        }

        tablaBody.innerHTML = `
            <div class="col-12">
                <div class="text-center py-4 text-danger fw-bold">
                    <i class="fas fa-exclamation-triangle mb-2 d-block fa-2x"></i>
                    Error al cargar los usuarios.
                </div>
            </div>
        `;
    }
};