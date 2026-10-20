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
        
        $rol_default = !empty($data['fk_id_rol']) ? $data['fk_id_rol'] : 2; 
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
}
?>