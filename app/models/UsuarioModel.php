<?php

class UsuarioModel {
    private $db;
    
    public function __construct()
    {
        $this->db = new Database;
    }

    
    // Función para dar de alta al usuario.
    public function crear_usuario($data)
    {
        $keyw = "keyword";
        $equipo_id = (!empty($data['fk_id_equipo']) && $data['fk_id_equipo'] !== "") 
                     ? $data['fk_id_equipo'] 
                     : null;
       
        $this->db->query("INSERT INTO usuario
                          (nombre, apellido, avatar, email, pass, fk_id_rol, fk_id_equipo, activo, created_at) 
                          VALUES 
                          (:nombre, :apellido, :avatar, :email, aes_encrypt(:pass,:keyword), :fk_id_rol, :fk_id_equipo, 1, CURRENT_TIMESTAMP)");
                          
        $this->db->bind('nombre', $data['nombre']);
        $this->db->bind('apellido', $data['apellido']);
        $this->db->bind('avatar', $data['avatar']);                  
        $this->db->bind('email', $data['email']);
        $this->db->bind('pass', $data['pass']);
        
        $rol_default = null; 
        $this->db->bind('fk_id_rol', $rol_default);
        $this->db->bind('fk_id_equipo', $equipo_id);
        $this->db->bind('keyword', $keyw);
        
        return $this->db->execute();
    }

    
    // Obtener todos los usuarios activos (no eliminados)
    public function obtener_usuarios()
    {
        $this->db->query("SELECT u.id, u.nombre, u.apellido, u.email, u.avatar, u.activo, u.fk_id_rol, u.fk_id_equipo, r.nombre AS rol_nombre, e.nombre AS equipo_nombre
                          FROM usuario u
                          LEFT JOIN roles r ON u.fk_id_rol = r.id
                          LEFT JOIN equipos e ON u.fk_id_equipo = e.id
                          WHERE u.deleted_at IS NULL
                          ORDER BY u.id ASC");
        return $this->db->registers(); 
    }
    
    // READ: Obtener un solo usuario por ID
    public function obtener_usuario_por_id($id)
    {
        $this->db->query("SELECT 
                            u.id, 
                            u.nombre, 
                            u.apellido, 
                            u.email, 
                            u.avatar, 
                            u.activo,
                            u.fk_id_rol,      
                            u.fk_id_equipo,   
                            r.nombre AS rol_nombre, 
                            e.nombre AS equipo_nombre
                        FROM usuario u
                        LEFT JOIN roles r ON u.fk_id_rol = r.id
                        LEFT JOIN equipos e ON u.fk_id_equipo = e.id
                        WHERE u.id = :id AND u.deleted_at IS NULL");
        $this->db->bind('id', $id);
        return $this->db->register(); 
    }

    
    // UPDATE: Actualizar los datos básicos, rol, equipo y opcionalmente contraseña de un usuario
    public function actualizar_usuario($data)
    {
        if (!empty($data['pass'])) {
            $keyw = "keyword";
            $this->db->query("UPDATE usuario SET 
                              nombre = :nombre, 
                              apellido = :apellido, 
                              avatar = :avatar, 
                              email = :email,
                              pass = aes_encrypt(:pass, :keyword),
                              fk_id_rol = :fk_id_rol,
                              fk_id_equipo = :fk_id_equipo,
                              updated_at = CURRENT_TIMESTAMP 
                              WHERE id = :id AND deleted_at IS NULL");
            $this->db->bind('pass', $data['pass']);
            $this->db->bind('keyword', $keyw);
        } else {
            $this->db->query("UPDATE usuario SET 
                              nombre = :nombre, 
                              apellido = :apellido, 
                              avatar = :avatar, 
                              email = :email,
                              fk_id_rol = :fk_id_rol,
                              fk_id_equipo = :fk_id_equipo,
                              updated_at = CURRENT_TIMESTAMP 
                              WHERE id = :id AND deleted_at IS NULL");
        }
                          
        $this->db->bind('nombre', $data['nombre']);
        $this->db->bind('apellido', $data['apellido']);
        $this->db->bind('avatar', $data['avatar']);
        $this->db->bind('email', $data['email']);
        $this->db->bind('fk_id_rol', $data['fk_id_rol']);
        $this->db->bind('fk_id_equipo', $data['fk_id_equipo']);
        $this->db->bind('id', $data['id']);
        
        return $this->db->execute();
    }

    // Activar / Desactivar usuario
    public function cambiar_estado_usuario($id)
    {
        $this->db->query("UPDATE usuario SET 
                          activo = IF(activo = 1, 0, 1),
                          updated_at = CURRENT_TIMESTAMP
                          WHERE id = :id AND deleted_at IS NULL");
        $this->db->bind(':id', $id);
        return $this->db->execute();
    }
 
    // DELETE: Borrado lógico del usuario (Soft Delete)
    public function eliminar_usuario($id) {
        $this->db->query("UPDATE usuario SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->execute();
    }

    // Verificar si el usuario tiene tareas pendientes o en progreso asignadas
    public function contar_tareas_activas_usuario($id)
    {
        $this->db->query("SELECT COUNT(*) AS total 
                          FROM tarea t
                          INNER JOIN estado e ON t.fk_id_estado = e.id_estado
                          WHERE t.fk_id_usuario_asignado = :id 
                            AND t.deleted_at IS NULL 
                            AND e.id_estado != 3 
                            AND LOWER(e.tipoEstado) != 'finished'");
        $this->db->bind(':id', $id);
        $row = $this->db->register();

        return $row ? (int)$row->total : 0;
    }

    /**
     * Verifica si un rol corresponde a Líder de equipo mediante permisos dinámicos
     * (Tiene permiso de asignar miembros, pero no de gestión global de roles)
     */
    public function esRolLider($id_rol)
    {
        if (empty($id_rol)) return false;

        $this->db->query("SELECT 
                            SUM(CASE WHEN p.nombre = 'tareas.asignar_miembro' THEN 1 ELSE 0 END) AS es_lider,
                            SUM(CASE WHEN p.nombre = 'roles.gestionar' THEN 1 ELSE 0 END) AS es_admin
                          FROM rol_permiso rp
                          INNER JOIN permisos p ON rp.id_permiso = p.id
                          WHERE rp.id_rol = :id_rol");
        $this->db->bind(':id_rol', $id_rol);
        $row = $this->db->register();

        return $row && (int)$row->es_lider > 0 && (int)$row->es_admin === 0;
    }

    /**
     * Busca si un equipo ya tiene un usuario activo con rol de Líder (excluyendo opcionalmente un ID de usuario)
     */
    public function obtenerLiderActualEquipo($id_equipo, $excluir_usuario_id = 0)
    {
        if (empty($id_equipo)) return null;

        $this->db->query("SELECT DISTINCT u.id, u.nombre, u.apellido, u.fk_id_rol
                          FROM usuario u
                          INNER JOIN rol_permiso rp ON u.fk_id_rol = rp.id_rol
                          INNER JOIN permisos p ON rp.id_permiso = p.id
                          WHERE u.fk_id_equipo = :id_equipo
                            AND u.deleted_at IS NULL
                            AND u.id != :excluir_id
                            AND p.nombre = 'tareas.asignar_miembro'
                            AND u.fk_id_rol NOT IN (
                                SELECT rp2.id_rol 
                                FROM rol_permiso rp2 
                                INNER JOIN permisos p2 ON rp2.id_permiso = p2.id 
                                WHERE p2.nombre = 'roles.gestionar'
                            )
                          LIMIT 1");
        $this->db->bind(':id_equipo', $id_equipo);
        $this->db->bind(':excluir_id', (int)$excluir_usuario_id);

        return $this->db->register();
    }

    /**
     * Reemplaza al líder actual asignándole un rol de miembro base (sin permisos de líder ni admin)
     */
    public function degradarLiderAMiembro($id_lider_actual)
    {
        // Buscamos dinámicamente un rol base de miembro 
        $this->db->query("SELECT r.id 
                          FROM roles r
                          WHERE r.id NOT IN (
                              SELECT rp.id_rol 
                              FROM rol_permiso rp 
                              INNER JOIN permisos p ON rp.id_permiso = p.id 
                              WHERE p.nombre IN ('tareas.asignar_miembro', 'roles.gestionar')
                          )
                          ORDER BY r.id DESC
                          LIMIT 1");
        $rolMiembro = $this->db->register();
        $nuevoRolId = $rolMiembro ? $rolMiembro->id : null;

        $this->db->query("UPDATE usuario 
                          SET fk_id_rol = :nuevo_rol, 
                              updated_at = CURRENT_TIMESTAMP 
                          WHERE id = :id");
        $this->db->bind(':nuevo_rol', $nuevoRolId);
        $this->db->bind(':id', $id_lider_actual);

        return $this->db->execute();
    }
}
?>