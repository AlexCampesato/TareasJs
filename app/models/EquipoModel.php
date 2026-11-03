<?php

class EquipoModel
{
    protected $db;

    public function __construct()
    {
        $this->db = new Database;
    }

    /**
     * Crea un nuevo equipo en la base de datos.
     */
    public function crearEquipo($data)
    {
        $this->db->query(
            "INSERT INTO equipos 
                (nombre, descripcion) 
             VALUES 
                (:nombre, :descripcion)"
        );
        
        $this->db->bind('nombre', $data['nombre']);
        $this->db->bind('descripcion', $data['descripcion']);

        return $this->db->execute();
    }

    /**
     * Obtiene la lista de todos los equipos.
     */
    public function obtenerEquipos()
    {
        $this->db->query(
            "SELECT 
                e.*, 
                u.nombre AS nombre_lider, 
                u.apellido AS apellido_lider
             FROM equipos e
             LEFT JOIN usuario u 
                ON u.fk_id_equipo = e.id 
               AND u.fk_id_rol = 2 
               AND u.deleted_at IS NULL
             ORDER BY e.id ASC"
        );
        
        return $this->db->registers();
    }

    /**
     * Obtiene un solo equipo por su ID.
     */
    public function obtenerEquipoPorId($id)
    {
        $this->db->query(
            "SELECT * 
             FROM equipos 
             WHERE id = :id"
        );
        
        $this->db->bind('id', $id);
        
        return $this->db->register();
    }

    /**
     * Actualiza los datos de un equipo existente.
     */
    public function actualizarEquipo($data)
    {
        $this->db->query(
            "UPDATE equipos 
             SET 
                nombre = :nombre, 
                descripcion = :descripcion 
             WHERE id = :id"
        );
        
        $this->db->bind('id', $data['id']);
        $this->db->bind('nombre', $data['nombre']);
        $this->db->bind('descripcion', $data['descripcion']);

        return $this->db->execute();
    }

    /**
     * Elimina un equipo de la base de datos (Eliminación física).
     */
    public function eliminarEquipo($id)
    {
        $this->db->query(
            "DELETE FROM equipos 
             WHERE id = :id"
        );
        
        $this->db->bind('id', $id);

        return $this->db->execute();
    }

    /**
     * Asigna un usuario a un equipo específico
     */
    public function asignarUsuarioAEquipo($id_usuario, $id_equipo) 
    {
        $this->db->query(
            "UPDATE usuario 
             SET fk_id_equipo = :id_equipo 
             WHERE id = :id_usuario"
        );
        
        $this->db->bind('id_equipo', $id_equipo);
        $this->db->bind('id_usuario', $id_usuario);
        
        return $this->db->execute();
    }

    /**
     * Obtiene los integrantes pertenecientes a un equipo
     */
    public function obtenerIntegrantesPorEquipo($id_equipo) 
    {
        $this->db->query(
            "SELECT id, nombre, apellido, email 
             FROM usuario 
             WHERE fk_id_equipo = :id 
               AND deleted_at IS NULL"
        );
        
        $this->db->bind('id', $id_equipo);
        
        return $this->db->registers(); 
    }

    /**
     * compatibilidad con asignación de miembros desde el controlador revisar luego.
     */
    public function obtener_miembros_por_equipo($id_equipo)
    {
        return $this->obtenerIntegrantesPorEquipo($id_equipo);
    }
}