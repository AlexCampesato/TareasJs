import { httpClient } from "../utils/httpClient.js";

export const tareaService = {
    async getEstados() {
        return await httpClient("/api/estados");
    },

    async getPrioridades() {
        return await httpClient("/api/prioridades");
    },

    async getAll(statusId = 0, priorityId = 0) {
        const params = new URLSearchParams();
        
        if (statusId > 0) params.append("id_estado", statusId);
        if (priorityId > 0) params.append("id_prioridad", priorityId);

        const queryString = params.toString();
        const url = queryString ? `/api/tareas?${queryString}` : "/api/tareas";

        return await httpClient(url);
    },

    async getById(id) {
        return await httpClient(`/api/tareas/${id}`);
    },

    async create(data) {
        return await httpClient("/api/tareas", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id, data) {
        return await httpClient(`/api/tareas/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async actualizarPrioridad(idTarea, idPrioridad) {
        return await httpClient("/api/tareas/actualizar-prioridad", {
            method: "POST",
            body: JSON.stringify({
                id_tarea: idTarea,
                fk_id_prioridad: idPrioridad,
            }),
        });
    },

    async delete(id) {
        return await httpClient(`/api/tareas/${id}`, {
            method: "DELETE",
        });
    },
};

