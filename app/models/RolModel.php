<?php

class RolModel {
    private $db;

    public function __construct()
    {
        $this->db = new Database;
    }

    // Crear un nuevo rol
    
    public function crearRol(array $data)
    {
        $this->db-> query("INSERT INTO roles (nombre, descripcion) VALUES (:nombre, :descripcion)");
        
        $this->db-> bind(':nombre', $data['nombre']);
        $this->db-> bind(':descripcion', $data['descripcion']);

        return $this->db->execute();
    }

     // Obtener todos los roles
    
    public function obtenerRoles()
    {
        $this->db->query("SELECT * FROM roles ORDER BY id ASC");
        
        return $this->db->registers();
    }

    
     // Obtener un solo rol por su ID
    
    public function obtenerRolPorId(int $id)
    {
        $this->db->query("SELECT * FROM roles WHERE id = :id");
        $this->db->bind(':id', $id);
        
        return $this->db->register();
    }

    // Actualizar un rol existente
     
    public function actualizarRol(array $data)
    {
        $this->db->query("UPDATE roles SET nombre = :nombre, descripcion = :descripcion WHERE id = :id");
        
        $this->db->bind(':id', $data['id']);
        $this->db->bind(':nombre', $data['nombre']);
        $this->db->bind(':descripcion', $data['descripcion']);

        return $this->db->execute();
    }

    
    // Eliminar un rol
    
    public function eliminarRol(int $id)
    {
        //Verificamos que ningún usuario tenga este rol asignado
        if ($this->contarUsuariosConRol($id) > 0) {
            return false;
        }
        // Limpiamos los permisos asociados en la tabla intermedia rol_permiso
        $this->limpiarPermisosDeRol($id);

        $this->db->query("DELETE FROM roles WHERE id = :id");
        $this->db->bind(':id', $id);

        return $this->db->execute();
    }

    // Asignar permiso a un rol
    public function asignarPermisoARol(int $id_rol, int $id_permiso)
    {
        $this->db->query("INSERT INTO rol_permiso (id_rol, id_permiso) VALUES (:id_rol, :id_permiso)");
        $this->db->bind(':id_rol', $id_rol);
        $this->db->bind(':id_permiso', $id_permiso);
        return $this->db->execute();
    }

    // Quitar todos los permisos de un rol (util para resincronizar al editar)
    public function limpiarPermisosDeRol(int $id_rol)
    {
        $this->db->query("DELETE FROM rol_permiso WHERE id_rol = :id_rol");
        $this->db->bind(':id_rol', $id_rol);
        return $this->db->execute();
    }

    // Obtener solo los IDs de los permisos asignados a un rol (para marcar los checkboxes)
    public function obtenerIdsPermisosPorRol(int $id_rol)
    {
        $this->db->query("SELECT id_permiso FROM rol_permiso WHERE id_rol = :id_rol");
        $this->db->bind(':id_rol', $id_rol);
        $rows = $this->db->registers();
        return array_map(function($row) {
            return (int) $row->id_permiso;
        }, $rows ?: []);
    }

    // Obtener todos los permisos asignados a un rol con su detalle
    public function obtenerPermisosPorRol(int $id_rol)
    {
        $this->db->query("
            SELECT p.id, p.nombre, p.descripcion 
            FROM permisos p
            INNER JOIN rol_permiso rp ON p.id = rp.id_permiso
            WHERE rp.id_rol = :id_rol
        ");
        $this->db->bind(':id_rol', $id_rol);
        
        return $this->db->registers();
    }

    /**
     * Verifica si el rol está asignado a algún usuario
     */
    public function contarUsuariosConRol($id_rol)
    {
        $this->db->query(
            "SELECT COUNT(*) AS total 
             FROM usuario 
             WHERE fk_id_rol = :id
             AND deleted_at IS NULL"
        );
        $this->db->bind('id', $id_rol);
        $row = $this->db->register();

        return $row ? (int)$row->total : 0;
    }
}