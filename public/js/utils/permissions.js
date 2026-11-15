import { authService } from "../services/authService.js";

export const tienePermiso = (permisoRequerido) => {
    const user = authService.getUser();

    if (!user || !user.permisos || !Array.isArray(user.permisos)) {
        return false;
    }
    // Retorna true si el array de permisos de la base de datos incluye el permiso consultado
    return user.permisos.includes(permisoRequerido);
};