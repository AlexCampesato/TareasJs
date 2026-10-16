import { httpClient } from "../utils/httpClient.js";

export const usuarioService = {
    // Obtiene todos los usuarios
    async getAll() {
        return await httpClient("/api/usuarios");
    },

    // Obtiene un usuario específico por su ID
    async getById(id) {
        return await httpClient(`/api/usuarios/${id}`);
    },

    // Crea un nuevo usuario
    async create(data) {
        return await httpClient("/api/usuarios/crear", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // Actualiza un usuario existente
    async update(id, data) {
        return await httpClient(`/api/usuarios/editar/${id}`, {
            method: "POST", 
            body: JSON.stringify(data),
        });
    },

    // Elimina un usuario
    async delete(id) {
        return await httpClient(`/api/usuarios/eliminar/${id}`, {
            method: "POST",
        });
    },

};