<?php

class TareaModel
{
    protected $db;

    public function __construct()
    {
        $this->db = new Database;
    }

    /**
     * Obtiene los estados posibles de las tareas.
     */
    public function buscar_estados()
    {
        $this->db->query("SELECT * FROM estado");
        return $this->db->registers();
    }

    /**
     * 1. Admin: Obtiene todas las tareas del sistema.
     */
    public function buscarTareas($id_estado = 0)
    {
        $sql = "SELECT
                    tarea.id AS id_tarea,
                    tarea.titulo,
                    tarea.descripcion,
                    tarea.created_at,
                    tarea.expired_at,
                    tarea.fk_id_equipo,
                    tarea.fk_id_usuario_asignado,
                    tarea.fk_id_estado,
                    equipos.nombre AS nombre_equipo,
                    u_asignado.nombre AS nombre_usuario_asignado,
                    u_asignado.apellido AS apellido_usuario_asignado,
                    estado.tipoEstado,
                    estado.color
                FROM tarea
                INNER JOIN estado
                    ON estado.id_estado = tarea.fk_id_estado
                LEFT JOIN equipos
                    ON equipos.id = tarea.fk_id_equipo
                LEFT JOIN usuario u_asignado
                    ON u_asignado.id = tarea.fk_id_usuario_asignado
                WHERE tarea.deleted_at IS NULL";

        if ($id_estado > 0) {
            $sql .= " AND estado.id_estado = :id_estado";
        }

        $sql .= " ORDER BY tarea.created_at DESC";

        $this->db->query($sql);

        if ($id_estado > 0) {
            $this->db->bind('id_estado', $id_estado);
        }

        return $this->db->registers();
    }
   /**
     * 2. Líder: Obtiene las tareas pertenecientes al su mismo equipo.
     */
    public function obtener_tareas_por_equipo($id_usuario, $id_estado = 0)
    {
        $sql = "SELECT 
                    tarea.id AS id_tarea,
                    tarea.titulo,
                    tarea.descripcion,
                    tarea.created_at,
                    tarea.expired_at,
                    tarea.fk_id_equipo,
                    tarea.fk_id_usuario_asignado,
                    tarea.fk_id_estado,
                    equipos.nombre AS nombre_equipo,
                    u_asignado.nombre AS nombre_usuario_asignado,
                    u_asignado.apellido AS apellido_usuario_asignado,
                    estado.tipoEstado, 
                    estado.color 
                FROM tarea
                INNER JOIN usuario u_lider 
                    ON u_lider.id = :id_usuario
                INNER JOIN estado 
                    ON tarea.fk_id_estado = estado.id_estado
                LEFT JOIN equipos
                    ON equipos.id = tarea.fk_id_equipo
                LEFT JOIN usuario u_asignado
                    ON u_asignado.id = tarea.fk_id_usuario_asignado
                WHERE tarea.fk_id_equipo = u_lider.fk_id_equipo
                  AND tarea.deleted_at IS NULL";

        if ($id_estado > 0) {
            $sql .= " AND estado.id_estado = :id_estado";
        }

        $sql .= " ORDER BY tarea.created_at DESC";

        $this->db->query($sql);
        $this->db->bind('id_usuario', $id_usuario);

        if ($id_estado > 0) {
            $this->db->bind('id_estado', $id_estado);
        }

        return $this->db->registers();
    }
   /**
     * 3. Miembro: Obtiene las tareas asignadas directamente a su usuario.
     */
    public function obtener_tareas_por_usuario($id_usuario, $id_estado = 0)
    {
        $sql = "SELECT 
                    tarea.id AS id_tarea,
                    tarea.titulo,
                    tarea.descripcion,
                    tarea.created_at,
                    tarea.expired_at,
                    tarea.fk_id_equipo,
                    tarea.fk_id_usuario_asignado,
                    tarea.fk_id_estado,
                    equipos.nombre AS nombre_equipo,
                    u_asignado.nombre AS nombre_usuario_asignado,
                    u_asignado.apellido AS apellido_usuario_asignado,
                    estado.tipoEstado, 
                    estado.color 
                FROM tarea
                INNER JOIN estado 
                    ON tarea.fk_id_estado = estado.id_estado
                LEFT JOIN equipos
                    ON equipos.id = tarea.fk_id_equipo
                LEFT JOIN usuario u_asignado
                    ON u_asignado.id = tarea.fk_id_usuario_asignado
                WHERE tarea.fk_id_usuario_asignado = :id_usuario
                  AND tarea.deleted_at IS NULL";

        if ($id_estado > 0) {
            $sql .= " AND estado.id_estado = :id_estado";
        }

        $sql .= " ORDER BY tarea.created_at DESC";

        $this->db->query($sql);
        $this->db->bind('id_usuario', $id_usuario);

        if ($id_estado > 0) {
            $this->db->bind('id_estado', $id_estado);
        }

        return $this->db->registers();
    }

    /**
     * Crea una nueva tarea.
     */
    public function altaTarea($data)
    {
        $this->db->query(
            "INSERT INTO tarea
                (
                    titulo,
                    descripcion,
                    expired_at,
                    fk_id_estado,
                    fk_id_creador,
                    fk_id_equipo,
                    created_at
                )
             VALUES
                (
                    :titulo,
                    :descripcion,
                    :expired_at,
                    :id_estado,
                    :id_creador,
                    :id_equipo,
                    CURRENT_TIMESTAMP
                )"
        );

        $this->db->bind('titulo', $data['titulo']);
        $this->db->bind('descripcion', $data['descripcion']);
        $this->db->bind('expired_at', $data['expired_at']);
        $this->db->bind('id_estado', $data['id_estado']);
        $this->db->bind('id_creador', $data['id_usuario']); 
        
        $id_equipo = !empty($data['id_equipo']) ? $data['id_equipo'] : null;
        $this->db->bind('id_equipo', $id_equipo);

        return $this->db->execute();
    }

    public function ultimoId()
    {
        return $this->db->lastId();
    }

    public function eliminarTarea($id_tarea)
    {
        $this->db->query(
            "UPDATE tarea
             SET deleted_at = CURRENT_TIMESTAMP
             WHERE tarea.id = :id"
        );

        $this->db->bind('id', $id_tarea);
        return $this->db->execute();
    }

    public function tareaById($id_tarea)
    {
        $this->db->query(
            "SELECT
                tarea.*,
                estado.tipoEstado,
                estado.color
             FROM tarea
             INNER JOIN estado
                ON estado.id_estado = tarea.fk_id_estado
             WHERE tarea.id = :id
             AND tarea.deleted_at IS NULL"
        );

        $this->db->bind('id', $id_tarea);
        return $this->db->register();
    }

    public function updateTarea($data)
    {
        $this->db->query(
            "UPDATE tarea
             SET
                titulo = :titulo,
                descripcion = :descripcion,
                expired_at = :expired_at,
                fk_id_estado = :id_estado,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = :id_tarea"
        );

        $this->db->bind('titulo', $data['titulo']);
        $this->db->bind('descripcion', $data['descripcion']);
        $this->db->bind('expired_at', $data['expired_at']);
        $this->db->bind('id_estado', $data['id_estado']);
        $this->db->bind('id_tarea', $data['id_tarea']);

        return $this->db->execute();
    }

    public function expirarTareas()
    {
        $this->db->query(
            "UPDATE tarea
             SET fk_id_estado = 4
             WHERE expired_at < CURDATE()
             AND deleted_at IS NULL"
        );

        return $this->db->execute();
    }

    public function asignarEquipo($id_tarea, $id_equipo)
    {
        $this->db->query(
            "UPDATE tarea
             SET fk_id_equipo = :id_equipo,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = :id_tarea"
        );

        $this->db->bind('id_equipo', $id_equipo);
        $this->db->bind('id_tarea', $id_tarea);

        return $this->db->execute();
    }

    public function asignarUsuario($id_tarea, $id_usuario)
    {
        $this->db->query(
            "UPDATE tarea
             SET fk_id_usuario_asignado = :id_usuario,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = :id_tarea"
        );

        $this->db->bind('id_usuario', $id_usuario);
        $this->db->bind('id_tarea', $id_tarea);

        return $this->db->execute();
    }

    public function actualizarEstado($id_tarea, $id_estado)
    {
        $sql = "UPDATE tarea SET fk_id_estado = :id_estado WHERE id = :id_tarea";
        $this->db->query($sql);
        $this->db->bind('id_estado', $id_estado);
        $this->db->bind('id_tarea', $id_tarea);
        return $this->db->execute();
    }

    /**
     * Quita el equipo y el usuario asignado a una tarea (Desasignar de equipo)
     */
    public function desasignarEquipo($id_tarea)
    {
        $sql = "UPDATE tarea 
                SET fk_id_equipo = NULL, 
                    fk_id_usuario_asignado = NULL 
                WHERE id = :id_tarea";

        $this->db->query($sql);
        $this->db->bind('id_tarea', $id_tarea);
        return $this->db->execute();
    }
}