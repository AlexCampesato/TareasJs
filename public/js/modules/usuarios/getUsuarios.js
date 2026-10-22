import { usuarioService } from "../../services/usuarioService.js";
import { tableUsuarioTemplate } from "../../templates/usuarios/tableUsuarioTemplate.js";
import { Pagination } from "../../utils/Pagination.js";

let usuariosCache = [];
let paginadorUsuarios = null;
let filtrosActivos = [];
let textoBusquedaActual = "";

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
        
        if (response.ok === false || response.success === false) {
            throw new Error("No se pudieron obtener los usuarios.");
        }

        usuariosCache = response.data || [];

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