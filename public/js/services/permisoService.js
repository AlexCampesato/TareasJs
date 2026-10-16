import { httpClient } from "../utils/httpClient.js";

export const permisoService = {
    // Obtiene todos los permiso
    async getAll() {
        return await httpClient("/api/permisos");
    },

    // Obtiene un permiso específico por su ID
    async getById(id) {
        return await httpClient(`/api/permisos/${id}`);
    },

    // Crea un nuevo permiso
    async create(data) {
        return await httpClient("/api/permisos/crear", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // Actualiza un permiso existente
    async update(id, data) {
        return await httpClient(`/api/permisos/editar/${id}`, {
            method: "POST", 
            body: JSON.stringify(data),
        });
    },

    // Elimina un permiso
    async delete(id) {
        return await httpClient(`/api/permisos/eliminar/${id}`, {
            method: "POST",
        });
    },

   
};