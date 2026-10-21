import { httpClient } from "../utils/httpClient.js";

export const rolService = {
    // Obtiene todos los roles
    async getAll() {
        return await httpClient("/api/roles");
    },

    // Obtiene un rol específico por su ID
    async getById(id) {
        return await httpClient(`/api/roles/${id}`);
    },

    // Obtiene un rol y sus permisos para el formulario de edición
    async getParaEditar(id) {
        return await httpClient(`/api/roles/editar/${id}`);
    },

    // Crea un nuevo rol
    async create(data) {
        return await httpClient("/api/roles/crear", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // Actualiza un rol existente
    async update(id, data) {
        return await httpClient(`/api/roles/editar/${id}`, {
            method: "POST", 
            body: JSON.stringify(data),
        });
    },

    // Elimina un rol
    async delete(id) {
        return await httpClient(`/api/roles/eliminar/${id}`, {
            method: "POST",
        });
    },

   
};