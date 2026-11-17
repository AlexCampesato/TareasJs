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
     * Helper privado para evaluar permisos en formato booleano (sin frenar la ejecución con exit)
     */
    private function tienePermisoBool(string $permiso): bool
    {
        if (!isset($_SESSION['user_id'])) {
            return false;
        }

        try {
            $db = new Database();
            $db->query("SELECT p.nombre 
                        FROM permisos p
                        INNER JOIN rol_permiso rp ON p.id = rp.id_permiso
                        INNER JOIN usuario u ON u.fk_id_rol = rp.id_rol
                        WHERE u.id = :uid AND p.nombre = :permiso");
            
            $db->bind(':uid', $_SESSION['user_id']);
            $db->bind(':permiso', $permiso);
            
            return (bool) $db->register();
        } catch (Exception $e) {
            return false;
        }
    }
    

    /**
     * GET /api/tareas
     * GET /api/tareas/estado/{id_estado}
     *
     * Obtiene el listado de tareas filtrado por jerarquía de roles y estado opcional:
     * - Admin: Ve todas las tareas.
     * - Líder y Miembro: Ven todas las tareas de su equipo.
     */
    public function index($id_estado_param = 0)
    {
        // Ejecutamos la expiración automática en la Base de Datos antes de consultar
        $this->tareaModel->expirarTareas();
       
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

        // Filtrar tareas según permisos dinámicos en lugar de IDs estáticos
        $tareas = [];

        // Evaluamos si el usuario posee privilegios de administración
        if ($this->tienePermisoBool('roles.gestionar')) {
            $tareas = $this->tareaModel->buscarTareas($id_estado, $id_prioridad, $idUsuario);
        } else {
            // Líder y Miembro: Ven las tareas asociadas a su equipo
            $tareas = $this->tareaModel->obtener_tareas_por_equipo($idUsuario, $id_estado, $id_prioridad);
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
        AuthHelper::tienePermiso('tareas.cambiar_estado');
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
     * Solo disponible para Admin y Líder.
     */
    public function actualizar_prioridad()
    {
        AuthHelper::tienePermiso('tareas.cambiar_prioridad');

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
        AuthHelper::tienePermiso('tareas.crear');

        $datos = $this->getJsonBody();

        $id_usuario = $_SESSION['user_id'] ?? ($_SESSION['user']['id'] ?? null);

        if (empty($id_usuario)) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'Usuario no autenticado.'
            ], 401);
            return;
        }

        $titulo = trim($datos['titulo'] ?? '');
        $descripcion = trim($datos['descripcion'] ?? '');
        $expired_at = $datos['expired_at'] ?? null;
        $id_estado = $datos['id_estado'] ?? 1;

        if (mb_strlen($titulo) < 3) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'El título es obligatorio y debe tener al menos 3 caracteres.'
            ], 400);
            return;
        }

        if (empty($descripcion)) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'La descripción de la tarea es obligatoria.'
            ], 400);
            return;
        }

        if (empty($expired_at)) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'La fecha de vencimiento es obligatoria.'
            ], 400);
            return;
        }

       // Evitar fechas de vencimiento en el pasado al crear
        $hoy = date('Y-m-d');
        $fechaComparacion = substr($expired_at, 0, 10);
        
        if ($fechaComparacion < $hoy) {
            $this->jsonResponse([
                'ok' => false,
                'mensaje' => 'La fecha de vencimiento no puede ser anterior al día de hoy.'
            ], 400);
            return;
        }

              
        $data = [
            'titulo' => $titulo,
            'descripcion' => $descripcion,
            'expired_at' => $expired_at,
            'id_estado' => $id_estado,
            'id_usuario' => $id_usuario
        ];

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
     * Actualiza una tarea completa o únicamente su estado según los permisos del usuario.
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

        // Validación de permisos según la acción que se intenta realizar
        $modificaCamposCriticos = array_key_exists('titulo', $datos) || array_key_exists('descripcion', $datos) || array_key_exists('expired_at', $datos);
        $esSoloCambioEstado = array_key_exists('id_estado', $datos) || array_key_exists('fk_id_estado', $datos);

        if ($modificaCamposCriticos) {
            // Si intenta editar texto, fecha o detalles de la tarea, exige permiso de edición general
            AuthHelper::tienePermiso('tareas.editar');
        } else if ($esSoloCambioEstado) {
            // Si solo está actualizando el estado desde el modal de miembro, exige el permiso específico
            AuthHelper::tienePermiso('tareas.cambiar_estado');
        } else {
            AuthHelper::tienePermiso('tareas.editar');
        }

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

        if (array_key_exists('titulo', $datos)) {
            $tituloTrim = trim($datos['titulo']);
            if (mb_strlen($tituloTrim) < 3) {
                $this->jsonResponse([
                    'ok' => false,
                    'mensaje' => 'El título debe tener al menos 3 caracteres.'
                ], 400);
                return;
            }
            $titulo = $tituloTrim;
        } else {
            $titulo = $tareaActual['titulo'] ?? '';
        }

        if (array_key_exists('descripcion', $datos)) {
            $descripcionTrim = trim($datos['descripcion']);
            if ($descripcionTrim === '') {
                $this->jsonResponse([
                    'ok' => false,
                    'mensaje' => 'La descripción es obligatoria y no puede estar vacía.'
                ], 400);
                return;
            }
            $descripcion = $descripcionTrim;
        } else {
            $descripcion = $tareaActual['descripcion'] ?? '';
        }

        $idEstadoAnterior = intval($tareaActual['fk_id_estado'] ?? $tareaActual['id_estado'] ?? 1);
        $id_estado = isset($datos['id_estado']) 
            ? intval($datos['id_estado']) 
            : (isset($datos['fk_id_estado']) ? intval($datos['fk_id_estado']) : $idEstadoAnterior);

        $expired_at = array_key_exists('expired_at', $datos) 
            ? $datos['expired_at'] 
            : ($tareaActual['expired_at'] ?? null);

        $seReabreTarea = ($idEstadoAnterior === 3 && $id_estado !== 3);
        $seModificaFecha = array_key_exists('expired_at', $datos) 
            && substr((string)$datos['expired_at'], 0, 10) !== substr((string)($tareaActual['expired_at'] ?? ''), 0, 10);

        // Validar fecha solo si se modificó la fecha o si se está reabriendo una tarea Finished
        if ($expired_at && ($seModificaFecha || $seReabreTarea)) {
            $hoy = date('Y-m-d');
            $fechaComparacion = substr($expired_at, 0, 10);
            
            if ($fechaComparacion < $hoy) {
                $mensajeError = $seReabreTarea
                    ? 'Para reabrir una tarea cuya fecha ya venció, debés actualizar también la fecha de vencimiento a hoy o a una fecha futura.'
                    : 'La fecha de vencimiento no puede ser anterior al día de hoy.';

                $this->jsonResponse([
                    'ok' => false,
                    'mensaje' => $mensajeError
                ], 400);
                return;
            }
        }

        $data = [
            'id_tarea'    => $id_tarea,
            'titulo'      => $titulo,
            'descripcion' => $descripcion,
            'expired_at'  => $expired_at,
            'id_estado'   => $id_estado
        ];

        // Ejecutamos la actualización
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
     * - Admin Elimina lógicamente la tarea (Soft-Delete).
     * - Líder Desasigna la tarea de su equipo.
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

        // Buscamos la tarea para validar su estado y asignaciones
        $tarea = $this->tareaModel->tareaById($id_tarea);
        if (!$tarea) {
            $this->jsonResponse([
                'ok' => false,
                'success' => false,
                'mensaje' => 'La tarea no existe o ya fue eliminada.'
            ], 404);
            return;
        }
        $idEstado = (int)($tarea->fk_id_estado ?? 0);
        $estadoActual = mb_strtolower(trim($tarea->tipoEstado ?? ''));
        $tieneSolicitudesPendientes = $this->tareaModel->contarSolicitudesPendientes($id_tarea) > 0;

        // Evaluamos si es el Administrador (usando un permiso exclusivo de gestión global)
        if ($this->tienePermisoBool('roles.gestionar') || $this->tienePermisoBool('usuarios.eliminar')) {

            // No eliminar si está asignada a un equipo o usuario
            if (!empty($tarea->fk_id_equipo) || !empty($tarea->fk_id_usuario_asignado)) {
                $this->jsonResponse([
                    'ok' => false,
                    'success' => false,
                    'mensaje' => 'No se puede eliminar la tarea porque está asignada a un equipo o usuario.'
                ], 400);
                return;
            }
            // No eliminar si ya está en curso o completada
            if(in_array($idEstado, [2, 3]) || in_array($estadoActual, ['doing', 'finished'])) {
                $this->jsonResponse([
                    'ok' => false,
                    'success' => false,
                    'mensaje' => "No se puede eliminar una tarea en estado \"{$tarea->tipoEstado}\"."
                ], 400);
                return;
            }

            // No eliminar si tiene solicitudes pendientes
            if ($tieneSolicitudesPendientes) {
                $this->jsonResponse([
                    'ok' => false,
                    'success' => false,
                    'mensaje' => 'No se puede eliminar la tarea porque tiene solicitudes pendientes de resolución.'
                ], 400);
                return;
            }

            // Admin: Borrado lógico real de la tarea (la oculta con deleted_at)
           $eliminado = $this->tareaModel->eliminarTarea($id_tarea);

            $this->jsonResponse([
                'ok' => (bool) $eliminado,
                'success' => (bool) $eliminado,
                'mensaje' => $eliminado
                    ? 'Tarea eliminada exitosamente.'
                    : 'Error al intentar eliminar la tarea.',
                'message' => $eliminado
                    ? 'Tarea eliminada exitosamente.'
                    : 'Error al intentar eliminar la tarea.'
            ]);
        }


        // Evaluamos si es el Líder (tiene permisos de equipo pero no los de gestión global)
        else if ($this->tienePermisoBool('tareas.asignar_equipo') || $this->tienePermisoBool('equipos.miembros')) {

            if(in_array($idEstado, [2, 3]) || in_array($estadoActual, ['doing', 'finished'])) {
                $this->jsonResponse([
                    'ok' => false,
                    'success' => false,
                    'mensaje' => "No se puede eliminar una tarea en estado \"{$tarea->tipoEstado}\"."
                ], 400);
                return;
            }

            if ($tieneSolicitudesPendientes) {
                $this->jsonResponse([
                    'ok' => false,
                    'success' => false,
                    'mensaje' => 'No se puede desasignar la tarea mientras tenga solicitudes pendientes.'
                ], 400);
                return;
            }
            // Líder: Desasigna la tarea del equipo (vuelve a quedar libre para el Admin)
            $desasignado = $this->tareaModel->desasignarEquipo($id_tarea);

            $this->jsonResponse([
                'ok' => (bool) $desasignado,
                'success' => (bool) $desasignado,
                'mensaje' => $desasignado
                    ? 'Tarea desasignada del equipo correctamente.'
                    : 'Error al intentar desasignar la tarea.',
                'message' => $desasignado
                    ? 'Tarea desasignada del equipo correctamente.'
                    : 'Error al intentar desasignar la tarea.'
            ]);
   
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

        AuthHelper::tienePermiso('tareas.asignar_equipo');

        $data = $this->getJsonBody();

       if (empty($data['id_tarea'])) {
            $this->jsonResponse(['ok' => false, 'message' => 'ID de tarea incompleto'], 400);
            return;
        }

        // Si viene vacío o null, desasignamos el equipo (y el usuario asignado)
        $idEquipo = (!empty($data['id_equipo']) && $data['id_equipo'] !== "") ? $data['id_equipo'] : null;

        if ($idEquipo === null) {
            $exito = $this->tareaModel->desasignarEquipo($data['id_tarea']);
            $mensaje = $exito ? 'Equipo desasignado correctamente' : 'Error al desasignar el equipo';
        } else {
            $exito = $this->tareaModel->asignarEquipo($data['id_tarea'], $idEquipo);
            $mensaje = $exito ? 'Equipo asignado correctamente' : 'Error al asignar el equipo';
        }

        if ($exito) {
            $this->jsonResponse(['ok' => true, 'message' => $mensaje]);
        } else {
            $this->jsonResponse(['ok' => false, 'message' => $mensaje], 500);
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

       AuthHelper::tienePermiso('tareas.asignar_miembro');

        $data = $this->getJsonBody();

        if (empty($data['id_tarea']) || empty($data['id_usuario'])) {
            $this->jsonResponse(['ok' => false, 'message' => 'Datos incompletos'], 400);
            return;
        }

        // Validar que la tarea exista y no esté finalizada
        $tarea = $this->tareaModel->tareaById($data['id_tarea']);
        if (!$tarea) {
            $this->jsonResponse(['ok' => false, 'message' => 'La tarea no existe.'], 404);
            return;
        }

        $idEstado = (int)($tarea->fk_id_estado ?? 0);
        $estadoActual = mb_strtolower(trim($tarea->tipoEstado ?? ''));
        if ($idEstado === 3 || $estadoActual === 'finished') {
            $this->jsonResponse([
                'ok' => false,
                'message' => 'No se puede asignar ni reasignar un miembro a una tarea ya finalizada.'
            ], 400);
            return;
        }

        // Validar que el usuario exista, esté activo y pertenezca al mismo equipo de la tarea
        $usuarioModel = $this->model('UsuarioModel');
        $usuario = $usuarioModel->obtener_usuario_por_id($data['id_usuario']);

        if (!$usuario || (int)$usuario->activo !== 1) {
            $this->jsonResponse([
                'ok' => false,
                'message' => 'El usuario seleccionado no existe o se encuentra inactivo.'
            ], 400);
            return;
        }

        if (empty($tarea->fk_id_equipo) || (int)$usuario->fk_id_equipo !== (int)$tarea->fk_id_equipo) {
            $this->jsonResponse([
                'ok' => false,
                'message' => 'El usuario seleccionado no pertenece al equipo asignado a esta tarea.'
            ], 400);
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