<?php
// models/SolicitudModel.php

class SolicitudModel {

    protected $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function crearSolicitud($id_tarea, $id_usuario, $tipo)
    {
        // Verificar si ya existe una solicitud pendiente de este mismo tipo para esta tarea
        $this->db->query(
            "SELECT id FROM solicitud 
             WHERE fk_id_tarea = :id_tarea 
               AND fk_id_estado_solicitud = 1 
               AND tipo = :tipo"
        );
        $this->db->bind(':id_tarea', $id_tarea);
        $this->db->bind(':tipo', $tipo);

        if ($this->db->register()) {
            return ['ok' => false, 'message' => 'Ya existe una solicitud pendiente para esta tarea.'];
        }

        // Insertar la nueva solicitud en estado 1 (Pendiente)
        $this->db->query(
            "INSERT INTO solicitud (fk_id_tarea, fk_id_usuario, tipo, fk_id_estado_solicitud) 
             VALUES (:id_tarea, :id_usuario, :tipo, 1)"
        );
        $this->db->bind(':id_tarea', $id_tarea);
        $this->db->bind(':id_usuario', $id_usuario);
        $this->db->bind(':tipo', $tipo);

        if ($this->db->execute()) {
            return ['ok' => true, 'message' => 'Solicitud enviada correctamente.'];
        }
        
        return ['ok' => false, 'message' => 'Error al registrar la solicitud.'];
    }

    public function obtenerSolicitudesPorEquipo($id_lider)
    {
        $sql = "SELECT 
                    s.id AS id_solicitud,
                    s.tipo,
                    s.created_at,
                    t.id AS id_tarea,
                    t.titulo AS tarea_titulo,
                    u.id AS id_usuario,
                    u.nombre AS usuario_nombre,
                    u.apellido AS usuario_apellido
                FROM solicitud s
                INNER JOIN tarea t ON t.id = s.fk_id_tarea
                INNER JOIN usuario u ON u.id = s.fk_id_usuario
                INNER JOIN usuario u_lider ON u_lider.id = :id_lider
                WHERE t.fk_id_equipo = u_lider.fk_id_equipo
                  AND s.fk_id_estado_solicitud = 1
                ORDER BY s.created_at ASC";

        $this->db->query($sql);
        $this->db->bind(':id_lider', $id_lider);
        
        return $this->db->registers();
    }
}