import { httpClient } from "../utils/httpClient.js";

export const equipoService = {
    // Obtiene todos los equipos
    async getAll() {
        return await httpClient("/api/equipos");
    },

    // Obtiene un equipo específico por su ID
    async getById(id) {
        return await httpClient(`/api/equipos/${id}`);
    },

    // Crea un nuevo equipo
    async create(data) {
        return await httpClient("/api/equipos/crear", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // Actualiza un equipo existente
    async update(id, data) {
        return await httpClient(`/api/equipos/editar/${id}`, {
            method: "POST", 
            body: JSON.stringify(data),
        });
    },

    // Elimina un equipo
    async delete(id) {
        return await httpClient(`/api/equipos/eliminar/${id}`, {
            method: "POST",
        });
    },

    // Asigna un usuario a un equipo
    async asignarMiembro(data) {
        return await httpClient("/api/equipos/asignarMiembro", {
            method: "POST",
            body: JSON.stringify(data) 
        });
    }
};