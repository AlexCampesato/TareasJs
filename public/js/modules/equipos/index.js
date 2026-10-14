import { API_BASE_URL_EQUIPOS } from '../../config.js';

export const renderEquipos = async (container) => {
  
    container.innerHTML = `
        <div style="padding: 20px;">
            <h2>Cargando equipos...</h2>
        </div>
    `;

    try {
        const response = await fetch(`${API_BASE_URL_EQUIPOS}`);
        const resultado = await response.json();

        if (resultado.success) {
            const equipos = resultado.data; 

            let html = `
                <div style="padding: 20px;">
                    <h1>Gestión de Equipos</h1>
                    <div style="margin-bottom: 15px;">
                        <button id="btn-crear-equipo" style="padding: 10px; background-color: #28a745; color: white; border: none; cursor: pointer;">
                            + Crear Nuevo equipo
                        </button>
                        <button href="/dashboard" data-link>VOLVER</button>
                    </div>
                    <table border="1" cellpadding="8" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripcion</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

      
            if (equipos.length > 0) {
                equipos.forEach(equipo => {
                    html += `
                        <tr>
                            <td>${equipo.id}</td>
                            <td>${equipo.nombre}</td>
                            <td>${equipo.descripcion}</td>
                            <td>
                                <button class="btn-editar" data-id="${equipo.id}" style="color: blue; cursor: pointer;">Editar</button> 
                               <button class="btn-eliminar" data-id="${equipo.id}" style="color: red; cursor: pointer;">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                html += `<tr><td colspan="5" style="text-align: center;">No hay equipos</td></tr>`;
            }

            html += `
                        </tbody>
                    </table>
                </div>
            `;

                        
            container.innerHTML = html;

            const botonesEditar = container.querySelectorAll('.btn-editar');
            botonesEditar.forEach(boton => {
                boton.addEventListener('click', (e) => {
                    const idEquipo = e.target.getAttribute('data-id');
 
                    renderEditarEquipo(container, idEquipo);
                });
            });

            const botonesEliminar = container.querySelectorAll('.btn-eliminar');
            botonesEliminar.forEach(boton => {
                boton.addEventListener('click', async (e) => {
                    const idEquipo = e.target.getAttribute('data-id');

                    
                    if (confirm(`¿Estás seguro de que deseas eliminar el equipo con ID ${idEquipo}?`)) {
                        try {
                            const response = await fetch(`${API_BASE_URL_EQUIPOS}/eliminar/${idEquipo}`, {
                                method: 'POST' 
                            });
                            const resultado = await response.json();

                            if (resultado.success) {
                                alert('Equipo eliminado con éxito');
                             
                                renderEquipos(container);
                            } else {
                                alert(resultado.message || 'Error al eliminar');
                            }
                        } catch (error) {
                            console.error("Error:", error);
                            alert('Error de conexión con el servidor.');
                        }
                    }
                });
            });

           
            document.getElementById('btn-crear-equipo').addEventListener('click', () => {
                renderCrearEquipo(container);
            });

        } else {
            container.innerHTML = `<h2>Error: ${resultado.message || 'No se pudieron cargar los equipos'}</h2>`;
        }

    } catch (error) {
        console.error("Error al cargar equipos:", error);
        container.innerHTML = `<h2>Error de conexión con el servidor.</h2>`;
    }
};

export const renderEditarEquipo = async (container, id) => {
    container.innerHTML = `<h2>Cargando formulario...</h2>`;

    try {
       
        const response = await fetch(`${API_BASE_URL_EQUIPOS}/editar/${id}`);
        const resultado = await response.json();

        if (resultado.success) {
            const equipo = resultado.data;

            container.innerHTML = `
                <div style="padding: 20px;">
                    <h1>Editar Equipo: ${equipo.nombre}</h1>
                    <form id="form-editar-equipo">
                        <div style="margin-bottom: 10px;">
                            <label>Nombre:</label><br>
                            <input type="text" id="edit-nombre" value="${equipo.nombre}" required>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label>Descripcion:</label><br>
                            <input type="text" id="edit-descripcion" value="${equipo.descripcion}">
                        </div>
                        <button type="submit" style="padding: 10px; background-color: #007bff; color: white; border: none; cursor: pointer;">
                            Guardar Cambios
                        </button>
                        <button type="button" id="btn-cancelar-edicion" style="padding: 10px; margin-left: 10px;">Cancelar</button>
                    </form>
                </div>
            `;

           
            document.getElementById('form-editar-equipo').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const datosFormulario = {
                    nombre: document.getElementById('edit-nombre').value,
                    descripcion: document.getElementById('edit-descripcion').value,
                };

                try {
                    const updateRes = await fetch(`${API_BASE_URL_EQUIPOS}/editar/${id}`, {
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datosFormulario)
                    });
                    const updateData = await updateRes.json();

                    if (updateData.success) {
                        alert('Equipo actualizado correctamente');
                        renderEquipos(container); 
                    } else {
                        alert(updateData.message);
                    }
                } catch (err) {
                    alert('Error al guardar los cambios');
                }
            });

            
            document.getElementById('btn-cancelar-edicion').addEventListener('click', () => {
                renderEquipos(container);
            });

        } else {
            container.innerHTML = `<h2>Error: ${resultado.message}</h2>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<h2>Error al conectar con el servidor</h2>`;
    }
};

export const renderCrearEquipo = (container) => {
   
    container.innerHTML = `
        <div style="padding: 20px;">
            <h1>Crear Nuevo Equipo</h1>
            <form id="form-crear-equipo">
                <div style="margin-bottom: 10px;">
                    <label>Nombre:</label><br>
                    <input type="text" id="crear-nombre" placeholder="colorimetria" required>
                </div>
                <div style="margin-bottom: 10px;">
                    <label>Descripción:</label><br>
                    <input type="text" id="crear-descripcion" placeholder="cambio de color">
                </div>
                <button type="submit" style="padding: 10px; background-color: #28a745; color: white; border: none; cursor: pointer;">
                    Guardar Equipo
                </button>
                <button type="button" id="btn-cancelar-creacion" style="padding: 10px; margin-left: 10px;">Cancelar</button>
            </form>
        </div>
    `;

    
    document.getElementById('form-crear-equipo').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datosFormulario = {
            nombre: document.getElementById('crear-nombre').value,
            descripcion: document.getElementById('crear-descripcion').value
        };

        try {
            const response = await fetch(`${API_BASE_URL_EQUIPOS}/crear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosFormulario)
            });
            
            const resultado = await response.json();

            if (resultado.success) {
                alert('Equipo creado correctamente');
              
                renderEquipos(container); 
            } else {
                alert(resultado.message);
            }
        } catch (error) {
            console.error("Error al crear:", error);
            alert('Error de conexión al intentar crear el equipo');
        }
    });

    
    document.getElementById('btn-cancelar-creacion').addEventListener('click', () => {
        renderEquipos(container);
    });
};