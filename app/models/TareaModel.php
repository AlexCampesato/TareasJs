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
     * Actualiza únicamente la prioridad de una tarea.
     */
    public function actualizarPrioridad($id_tarea, $id_prioridad)
    {
        $this->db->query(
            "UPDATE tarea 
            SET fk_id_prioridad = :id_prioridad 
            WHERE id = :id_tarea"
        );

        $this->db->bind(':id_prioridad', $id_prioridad);
        $this->db->bind(':id_tarea', $id_tarea);

        return $this->db->execute();
    }

    /**
     * 1. Admin: Obtiene todas las tareas del sistema.
     */
    public function buscarTareas($id_estado = 0, $id_prioridad = 0, $id_usuario = null)
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
                    tarea.fk_id_prioridad,
                    equipos.nombre AS nombre_equipo,
                    u_asignado.nombre AS nombre_usuario_asignado,
                    u_asignado.apellido AS apellido_usuario_asignado,
                    estado.tipoEstado,
                    estado.color,
                    prioridad.nombre AS nombre_prioridad,
                    prioridad.color AS color_prioridad,
                    (SELECT COUNT(*) FROM solicitud s 
                     WHERE s.fk_id_tarea = tarea.id 
                       AND s.fk_id_usuario = :id_usuario_solicitud 
                       AND s.fk_id_estado_solicitud = 1 
                       AND s.tipo = 'extension_fecha') AS tiene_solicitud_pendiente
                FROM tarea
                INNER JOIN estado
                    ON estado.id_estado = tarea.fk_id_estado
                LEFT JOIN prioridad
                    ON prioridad.id = tarea.fk_id_prioridad    
                LEFT JOIN equipos
                    ON equipos.id = tarea.fk_id_equipo
                LEFT JOIN usuario u_asignado
                    ON u_asignado.id = tarea.fk_id_usuario_asignado
                WHERE tarea.deleted_at IS NULL";

        if ($id_estado > 0) {
            $sql .= " AND estado.id_estado = :id_estado";
        }

        if ($id_prioridad > 0) {
        $sql .= " AND tarea.fk_id_prioridad = :id_prioridad";
        }

        $sql .= " ORDER BY tarea.created_at DESC";

        $this->db->query($sql);
        $this->db->bind('id_usuario_solicitud', $id_usuario);

        if ($id_estado > 0) {
            $this->db->bind('id_estado', $id_estado);
        }
        if ($id_prioridad > 0){ 
            $this->db->bind('id_prioridad', $id_prioridad);
        }
        return $this->db->registers();
    }
   /**
     * 2. Líder: Obtiene las tareas pertenecientes al su mismo equipo.
     */
    public function obtener_tareas_por_equipo($id_usuario, $id_estado = 0, $id_prioridad = 0)
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
                    tarea.fk_id_prioridad,
                    equipos.nombre AS nombre_equipo,
                    u_asignado.nombre AS nombre_usuario_asignado,
                    u_asignado.apellido AS apellido_usuario_asignado,
                    estado.tipoEstado, 
                    estado.color,
                    prioridad.nombre AS nombre_prioridad,
                    prioridad.color AS color_prioridad,
                    (SELECT COUNT(*) FROM solicitud s 
                     WHERE s.fk_id_tarea = tarea.id 
                       AND s.fk_id_usuario = :id_usuario_solicitud 
                       AND s.fk_id_estado_solicitud = 1 
                       AND s.tipo = 'extension_fecha') AS tiene_solicitud_pendiente 
                FROM tarea
                INNER JOIN usuario u_lider 
                    ON u_lider.id = :id_usuario
                INNER JOIN estado 
                    ON tarea.fk_id_estado = estado.id_estado
                LEFT JOIN prioridad
                    ON prioridad.id = tarea.fk_id_prioridad    
                LEFT JOIN equipos
                    ON equipos.id = tarea.fk_id_equipo
                LEFT JOIN usuario u_asignado
                    ON u_asignado.id = tarea.fk_id_usuario_asignado
                WHERE tarea.fk_id_equipo = u_lider.fk_id_equipo
                  AND tarea.deleted_at IS NULL";

        if ($id_estado > 0) {
            $sql .= " AND estado.id_estado = :id_estado";
        }
        if ($id_prioridad > 0) {
            $sql .= " AND tarea.fk_id_prioridad = :id_prioridad";
        }
        $sql .= " ORDER BY tarea.created_at DESC";

        $this->db->query($sql);
        $this->db->bind('id_usuario', $id_usuario);
        $this->db->bind('id_usuario_solicitud', $id_usuario);

        if ($id_estado > 0) {
            $this->db->bind('id_estado', $id_estado);
        }
        if ($id_prioridad > 0) {
            $this->db->bind('id_prioridad', $id_prioridad);
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
                    tarea.fk_id_prioridad,
                    equipos.nombre AS nombre_equipo,
                    u_asignado.nombre AS nombre_usuario_asignado,
                    u_asignado.apellido AS apellido_usuario_asignado,
                    estado.tipoEstado, 
                    estado.color,
                    prioridad.nombre AS nombre_prioridad,
                    prioridad.color AS color_prioridad,
                    (SELECT COUNT(*) FROM solicitud s 
                     WHERE s.fk_id_tarea = tarea.id 
                       AND s.fk_id_usuario = :id_usuario_solicitud 
                       AND s.fk_id_estado_solicitud = 1 
                       AND s.tipo = 'extension_fecha') AS tiene_solicitud_pendiente 
                FROM tarea
                INNER JOIN estado 
                    ON tarea.fk_id_estado = estado.id_estado
                LEFT JOIN prioridad
                    ON prioridad.id = tarea.fk_id_prioridad
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
        $this->db->bind('id_usuario_solicitud', $id_usuario);

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
        $id_prioridad = !empty($data['id_prioridad']) ? $data['id_prioridad'] : 2;

        $this->db->query(
            "INSERT INTO tarea
                (
                    titulo,
                    descripcion,
                    expired_at,
                    fk_id_estado,
                    fk_id_prioridad,
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
                    :id_prioridad,
                    :id_creador,
                    :id_equipo,
                    CURRENT_TIMESTAMP
                )"
        );

        $this->db->bind('titulo', $data['titulo']);
        $this->db->bind('descripcion', $data['descripcion']);
        $this->db->bind('expired_at', $data['expired_at']);
        $this->db->bind('id_estado', $data['id_estado']);
        $this->db->bind('id_prioridad', $id_prioridad);
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
                estado.color,
                prioridad.nombre AS nombre_prioridad,
                prioridad.color AS color_prioridad
             FROM tarea
             INNER JOIN estado
                ON estado.id_estado = tarea.fk_id_estado
             LEFT JOIN prioridad
                ON prioridad.id = tarea.fk_id_prioridad
             WHERE tarea.id = :id
             AND tarea.deleted_at IS NULL"
        );

        $this->db->bind('id', $id_tarea);
        return $this->db->register();
    }

    public function updateTarea($data)
    {
        // 1. Actualizar la tarea
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

        $resultado = $this->db->execute();

        // 2. Si la tarea se actualizó bien, resolvemos automáticamente las solicitudes de extensión
        if ($resultado) {
            $this->db->query(
                "UPDATE solicitud 
                 SET fk_id_estado_solicitud = 2 
                 WHERE fk_id_tarea = :id_tarea 
                   AND tipo = 'extension_fecha'"
            );
            $this->db->bind('id_tarea', $data['id_tarea']);
            $this->db->execute();
        }

        return $resultado;
    }

   public function expirarTareas()
    {
        $this->db->query(
            "UPDATE tarea
             SET fk_id_estado = 4
             WHERE expired_at < CURDATE()
               AND fk_id_estado IN (1, 2)
               AND deleted_at IS NULL"
        );

        return $this->db->execute();
    }

   public function asignarEquipo($id_tarea, $id_equipo)
    {
        $this->db->query(
            "UPDATE tarea
             SET fk_id_usuario_asignado = CASE 
                     WHEN fk_id_equipo IS NOT NULL AND fk_id_equipo != :id_equipo_check THEN NULL 
                     ELSE fk_id_usuario_asignado 
                 END,
                 fk_id_equipo = :id_equipo,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = :id_tarea"
        );

        $this->db->bind('id_equipo_check', $id_equipo);
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

    /**
     * Verifica si la tarea tiene solicitudes pendientes asociadas
     */
    public function contarSolicitudesPendientes($id_tarea)
    {
        $this->db->query(
            "SELECT COUNT(*) AS total 
             FROM solicitud 
             WHERE fk_id_tarea = :id_tarea 
               AND fk_id_estado_solicitud = 1"
        );
        $this->db->bind(':id_tarea', $id_tarea);
        $row = $this->db->register();

        return $row ? (int)$row->total : 0;
    }
}