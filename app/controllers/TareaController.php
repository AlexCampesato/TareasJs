<?php

class TareaController extends BaseController
{
    private $tareaModel;
    private $estadoModel;
    private $prioridadModel;

    public function __construct()
    {
        $this->tareaModel = $this->model('TareaModel');
        $this->estadoModel = $this->model('EstadoModel');
        $this->prioridadModel = $this->model('PrioridadModel');
    }

    /**
     * GET /api/tareas
     * GET /api/tareas/estado/{id_estado}
     *
     * Obtiene el listado de tareas filtrado por jerarquía de roles y estado opcional:
     * - Admin (1): Ve todas las tareas.
     * - Líder (2) y Miembro (3): Ven todas las tareas de su equipo.
     */
    public function index($id_estado_param = 0)
    {
        // Ejecutamos la expiración automática en la Base de Datos antes de consultar
        $this->tareaModel->expirarTareas();
        
        // Soporta tanto /api/tareas?id_estado=1 como /api/tareas/estado/1
        $id_estado = isset($_GET['id_estado']) 
            ? intval($_GET['id_estado']) 
            : intval($id_estado_param);

        $id_prioridad = intval($_GET['id_prioridad'] ?? 0);

        $sessionUser = $_SESSION['user'] ?? null;

        // Obtener ID del Usuario autenticado
        $idUsuario = 0;
        if ($sessionUser) {
            foreach (['id', 'id_usuario', 'fk_id_usuario'] as $clave) {
                if (isset($sessionUser[$clave]) && intval($sessionUser[$clave]) > 0) {
                    $idUsuario = intval($sessionUser[$clave]);
                    break;
                }
            }
        }
        if ($idUsuario === 0 && isset($_SESSION['user_id'])) {
            $idUsuario = intval($_SESSION['user_id']);
        }

        // Obtener Rol del Usuario autenticado
        $idRol = 0;
        if ($sessionUser) {
            foreach (['id_rol', 'fk_id_rol', 'rol_id'] as $clave) {
                if (isset($sessionUser[$clave]) && intval($sessionUser[$clave]) > 0) {
                    $idRol = intval($sessionUser[$clave]);
                    break;
                }
            }
        }
        if ($idRol === 0) {
            if (isset($_SESSION['id_rol'])) {
                $idRol = intval($_SESSION['id_rol']);
            } elseif (isset($_SESSION['user_rol_id'])) {
                $idRol = intval($_SESSION['user_rol_id']);
            }
        }

        // Filtrar tareas según la jerarquía y el id_estado
        $tareas = [];

        if ($idRol === 1) {
            // Admin (1): Ve todas las tareas del sistema
            $tareas = $this->tareaModel->buscarTareas($id_estado, $id_prioridad);
        } else if (($idRol === 2 || $idRol === 3) && $idUsuario > 0) {
            // Líder (2) y Miembro (3): Ven las tareas asociadas a su equipo
            $tareas = $this->tareaModel->obtener_tareas_por_equipo($idUsuario, $id_estado, $id_prioridad);
        } else {
            $tareas = [];
        }

        header('Content-Type: application/json');
        echo json_encode([
            'ok' => true,
            'success' => true,
            'tareas' => is_array($tareas) ? $tareas : []
        ]);
        exit;
    }

    /**
     * POST /api/tareas/actualizar-estado
     * PATCH /api/tareas/estado
     *
     * Cambia únicamente el estado de una tarea asignada.
     */
    public function actualizar_estado()
    {
        $datos = $this->getJsonBody();

        $id_tarea = intval($datos['id_tarea'] ?? $datos['id'] ?? 0);
        $id_estado = intval($datos['fk_id_estado'] ?? $datos['id_estado'] ?? 0);

        if (!$id_tarea || !$id_estado) {
            $this->jsonResponse([
                'ok' => false,
                'message' => 'Datos incompletos para actualizar el estado.'
            ], 400);
            return;
        }

        // Actualización directa en el modelo
        $exito = $this->tareaModel->actualizarEstado($id_tarea, $id_estado);

        $this->jsonResponse([
            'ok' => (bool)$exito,
            'success' => (bool)$exito,
            'message' => $exito ? 'Estado actualizado correctamente.' : 'No se pudo actualizar el estado.'
        ]);
    }

    /**
     * GET /api/estados
     */
    public function estados()
    {
        $estados = $this->estadoModel->buscar_estados();

        $this->jsonResponse([
            'ok' => true,
            'estados' => $estados
        ]);
    }

    /**
     * GET /api/prioridades
     * Retorna el listado de prioridades disponibles.
     */
    public function prioridades()
    {
        $prioridades = $this->prioridadModel->obtenerPrioridad();

        $this->jsonResponse([
            'ok' => true,
            'prioridades' => $prioridades
        ]);
    }

    /**
     * POST /api/tareas/actualizar-prioridad
     * PATCH /api/tareas/prioridad
     *
     * Cambia únicamente la prioridad de una tarea.
     * Solo disponible para Admin (Rol 1) y Líder (Rol 2).
     */
    public function actualizar_prioridad()
    {
        $sessionUser = $_SESSION['user'] ?? null;
        $idRol = 0;

        if ($sessionUser) {
            $idRol = intval($sessionUser['id_rol'] ?? $sessionUser['fk_id_rol'] ?? 0);
        } elseif (isset($_SESSION['id_rol'])) {
            $idRol = intval($_SESSION['id_rol']);
        } elseif (isset($_SESSION['user_rol_id'])) {
            $idRol = intval($_SESSION['user_rol_id']);
        }

        // Permiso restrictivo: Solo Admin (1) o Líder (2)
        if ($idRol !== 1 && $idRol !== 2) {
            $this->jsonResponse([
                'ok' => false,
                'message' => 'No tienes permiso para cambiar la prioridad.'
            ], 403);
            return;
        }

        $datos = $this->getJsonBody();

        $id_tarea = intval($datos['id_tarea'] ?? $datos['id'] ?? 0);
        $id_prioridad = intval($datos['fk_id_prioridad'] ?? $datos['id_prioridad'] ?? 0);

        if (!$id_tarea || !$id_prioridad) {
            $this->jsonResponse([
                'ok' => false,
                'message' => 'Datos incompletos para actualizar la prioridad.'
            ], 400);
            return;
        }

        // Actualización directa en TareaModel
        $exito = $this->tareaModel->actualizarPrioridad($id_tarea, $id_prioridad);

        $this->jsonResponse([
            'ok' => (bool)$exito,
            'success' => (bool)$exito,
            'message' => $exito ? 'Prioridad actualizada correctamente.' : 'No se pudo actualizar la prioridad.'
        ]);
    }
    
    /**
     * GET /api/tareas/{id_tarea}
     */
    public function show($id_tarea = null)
    {
        if (!$id_tarea) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'ID de tarea no proporcionado.'
            ], 400);
        }

        $tarea = $this->tareaModel->tareaById($id_tarea);

        $this->jsonResponse([
            'ok' => true,
            'tarea' => $tarea
        ]);
    }

    /**
     * POST /api/tareas
     */
    public function store()
    {
        $datos = $this->getJsonBody();

        $id_usuario = $_SESSION['user_id'] ?? ($_SESSION['user']['id'] ?? null);

        if (empty($id_usuario)) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'Usuario no autenticado.'
            ], 401);
        }

        $data = [
            'titulo' => trim($datos['titulo'] ?? ''),
            'descripcion' => trim($datos['descripcion'] ?? ''),
            'expired_at' => $datos['expired_at'] ?? null,
            'id_estado' => $datos['id_estado'] ?? 1,
            'id_usuario' => $id_usuario
        ];

        if (empty($data['titulo'])) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'El título es obligatorio.'
            ], 400);
        }

        $creado = $this->tareaModel->altaTarea($data);

        if ($creado) {
            $id_tarea = $this->tareaModel->ultimoId();

            $this->jsonResponse([
                'ok' => true,
                'mensaje' => 'Tarea creada exitosamente.',
                'id_tarea' => $id_tarea
            ], 201);
        }

        $this->jsonResponse([
            'ok' => false,
            'mensaje' => 'No se pudo crear la tarea.'
        ], 500);
    }

    /**
     * PATCH /api/tareas/{id_tarea}
     * Actualiza una tarea o únicamente su estado si sólo se envía id_estado.
     */
    public function update($id_tarea = null)
    {
        if (!$id_tarea) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'ID de tarea no válido.'
            ], 400);
            return;
        }

        $datos = $this->getJsonBody();

        // Buscamos los datos actuales de la tarea en la base de datos
        $tareaBD = $this->tareaModel->tareaById($id_tarea);

        if (!$tareaBD) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'La tarea especificada no existe.'
            ], 404);
            return;
        }

        $tareaActual = (array) $tareaBD;

        // conservamos los datos existentes
        $titulo = isset($datos['titulo']) && trim($datos['titulo']) !== '' 
            ? trim($datos['titulo']) 
            : ($tareaActual['titulo'] ?? '');

        $descripcion = isset($datos['descripcion']) 
            ? trim($datos['descripcion']) 
            : ($tareaActual['descripcion'] ?? '');

        $expired_at = array_key_exists('expired_at', $datos) 
            ? $datos['expired_at'] 
            : ($tareaActual['expired_at'] ?? null);

        $id_estado = isset($datos['id_estado']) 
            ? intval($datos['id_estado']) 
            : intval($tareaActual['fk_id_estado'] ?? $tareaActual['id_estado'] ?? 1);

        $data = [
            'id_tarea'    => $id_tarea,
            'titulo'      => $titulo,
            'descripcion' => $descripcion,
            'expired_at'  => $expired_at,
            'id_estado'   => $id_estado
        ];

        //  Ejecutamos la actualización
        $actualizado = $this->tareaModel->updateTarea($data);

        $this->jsonResponse([
            'ok'      => (bool) $actualizado,
            'success' => (bool) $actualizado,
            'mensaje' => $actualizado
                ? 'Tarea actualizada correctamente.'
                : 'Sin cambios realizados.'
        ]);
    }

    /**
     * DELETE /api/tareas/{id_tarea}
     *
     * - Admin (Rol 1): Elimina lógicamente la tarea (Soft-Delete).
     * - Líder (Rol 2): Desasigna la tarea de su equipo.
     */
    public function destroy($id_tarea = null)
    {
        if (!$id_tarea) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'ID de tarea no provisto.'
            ], 400);
            return;
        }

        // Leemos el rol del usuario autenticado
        $sessionUser = $_SESSION['user'] ?? null;
        $idRol = 0;

        if ($sessionUser) {
            $idRol = intval($sessionUser['id_rol'] ?? $sessionUser['fk_id_rol'] ?? 0);
        } elseif (isset($_SESSION['id_rol'])) {
            $idRol = intval($_SESSION['id_rol']);
        } elseif (isset($_SESSION['user_rol_id'])) {
            $idRol = intval($_SESSION['user_rol_id']);
        }

        if ($idRol === 1) {
            // Admin: Borrado lógico real de la tarea
            $eliminado = $this->tareaModel->eliminarTarea($id_tarea);

            $this->jsonResponse([
                'ok' => (bool) $eliminado,
                'success' => (bool) $eliminado,
                'mensaje' => $eliminado
                    ? 'Tarea eliminada exitosamente.'
                    : 'Error al intentar eliminar la tarea.'
            ]);
        } else if ($idRol === 2) {
            // Líder: Desasigna la tarea del equipo (vuelve al Admin)
            $desasignado = $this->tareaModel->desasignarEquipo($id_tarea);

            $this->jsonResponse([
                'ok' => (bool) $desasignado,
                'success' => (bool) $desasignado,
                'mensaje' => $desasignado
                    ? 'Tarea desasignada del equipo correctamente.'
                    : 'Error al intentar desasignar la tarea.'
            ]);
        } else {
            $this->jsonResponse([
                'ok' => false,
                'success' => false,
                'message' => 'No tienes permiso para realizar esta acción.'
            ], 403);
        }
    }

    /**
     * POST /api/tareas/asignar-equipo
     */
    public function asignar_equipo()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->jsonResponse(['ok' => false, 'message' => 'Método no permitido'], 405);
            return;
        }

        $sessionUser = $_SESSION['user'] ?? null;
        $id_rol = null;

        if ($sessionUser) {
            $id_rol = intval($sessionUser['id_rol'] ?? $sessionUser['fk_id_rol'] ?? 0);
        } elseif (isset($_SESSION['id_rol'])) {
            $id_rol = intval($_SESSION['id_rol']);
        } elseif (isset($_SESSION['user_rol_id'])) {
            $id_rol = intval($_SESSION['user_rol_id']);
        }

        if ($id_rol !== 1) {
            $this->jsonResponse(['ok' => false, 'message' => 'No autorizado'], 403);
            return;
        }

        $data = $this->getJsonBody();

        if (empty($data['id_tarea']) || empty($data['id_equipo'])) {
            $this->jsonResponse(['ok' => false, 'message' => 'Datos incompletos'], 400);
            return;
        }

        $exito = $this->tareaModel->asignarEquipo($data['id_tarea'], $data['id_equipo']);

        if ($exito) {
            $this->jsonResponse(['ok' => true, 'message' => 'Equipo asignado correctamente']);
        } else {
            $this->jsonResponse(['ok' => false, 'message' => 'Error al asignar el equipo'], 500);
        }
    }

    /**
     * POST /api/tareas/asignar-usuario
     */
    public function asignar_usuario()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->jsonResponse(['ok' => false, 'message' => 'Método no permitido'], 405);
            return;
        }

        $sessionUser = $_SESSION['user'] ?? null;
        $id_rol = null;

        if ($sessionUser) {
            $id_rol = intval($sessionUser['id_rol'] ?? $sessionUser['fk_id_rol'] ?? 0);
        } elseif (isset($_SESSION['id_rol'])) {
            $id_rol = intval($_SESSION['id_rol']);
        } elseif (isset($_SESSION['user_rol_id'])) {
            $id_rol = intval($_SESSION['user_rol_id']);
        }

        if ($id_rol !== 1 && $id_rol !== 2) {
            $this->jsonResponse(['ok' => false, 'message' => 'No autorizado'], 403);
            return;
        }

        $data = $this->getJsonBody();

        if (empty($data['id_tarea']) || empty($data['id_usuario'])) {
            $this->jsonResponse(['ok' => false, 'message' => 'Datos incompletos'], 400);
            return;
        }

        $exito = $this->tareaModel->asignarUsuario($data['id_tarea'], $data['id_usuario']);

        if ($exito) {
            $this->jsonResponse(['ok' => true, 'message' => 'Miembro asignado correctamente']);
        } else {
            $this->jsonResponse(['ok' => false, 'message' => 'Error al asignar el miembro'], 500);
        }
    }
}