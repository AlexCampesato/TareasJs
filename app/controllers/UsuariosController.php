<?php
class UsuariosController extends BaseController {

    
    private $usuarioModel;
    private $rolModel;
    private $equipoModel;

    public function __construct() {
        $this->usuarioModel = $this->model('UsuarioModel');
        $this->rolModel = $this->model('RolModel');
        $this->equipoModel = $this->model('EquipoModel');
    }
    // Devuelve la lista de usuarios en JSON
    
    public function index() {
   
    AuthHelper::tienePermiso('usuarios.ver'); 

    $usuarios = $this->usuarioModel->obtener_usuarios();
    
    if ($usuarios === false) {
        $this->jsonResponse(['success' => false, 'message' => 'Error en la consulta SQL del modelo']);
    }

    $this->jsonResponse([
        'success' => true,
        'data' => $usuarios
    ]);
}

   
    // Recibe un JSON del frontend y crea el usuario
    public function crear() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            AuthHelper::tienePermiso('usuarios.crear'); 
            $data = $this->getJsonBody();

            if (empty($data['email']) || empty($data['pass']) || empty($data['nombre'])) {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'Faltan campos obligatorios (Nombre, Email y Contraseña)'
                ], 400);
                return;
            }

            $equipo_id = (!empty($data['fk_id_equipo']) && $data['fk_id_equipo'] !== "") 
                         ? $data['fk_id_equipo'] 
                         : null;

            $datos_usuario = [
                'nombre' => trim($data['nombre']),
                'apellido' => trim($data['apellido'] ?? ''),
                'email' => trim($data['email']),
                'avatar' => trim($data['avatar'] ?? 'img_default.png'), 
                'pass' => $data['pass'],
                'fk_id_rol' => null,
                'fk_id_equipo' => $equipo_id
            ];

            if ($this->usuarioModel->crear_usuario($datos_usuario)) {
                $this->jsonResponse([
                    'success' => true,
                    'message' => 'Usuario creado exitosamente'
                ], 201);
            } else {
                $this->jsonResponse([
                    'success' => false,
                    'message' => 'Error al crear el usuario en la base de datos'
                ], 500);
            }
        } else {
            $roles = $this->rolModel->obtenerRoles();
            $equipos = $this->equipoModel->obtenerEquipos();
            $this->jsonResponse([
                'success' => true,
                'roles' => $roles,
                'equipos' => $equipos
            ]);
        }
    }


    public function editar($id) { 
        if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT') {
            $esPropioUsuario = isset($_SESSION['user_id']) && (int)$_SESSION['user_id'] === (int)$id;

            // Si no está editando su propio perfil, exigimos permiso de administrador
            if (!$esPropioUsuario) {
                AuthHelper::tienePermiso('usuarios.editar');
            }

            $usuarioActual = $this->usuarioModel->obtener_usuario_por_id($id);
            if (!$usuarioActual) {
                $this->jsonResponse([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
                return;
            }

            $data = $this->getJsonBody();

            // Si vienen nombre/email (desde Mi Perfil), los actualizamos
            $nombre = isset($data['nombre']) && trim($data['nombre']) !== ''
                ? trim($data['nombre'])
                : $usuarioActual->nombre;

            $apellido = array_key_exists('apellido', $data)
                ? trim($data['apellido'])
                : ($usuarioActual->apellido ?? '');

            $email = isset($data['email']) && trim($data['email']) !== ''
                ? trim($data['email'])
                : $usuarioActual->email;

            // Si vienen fk_id_rol o fk_id_equipo (desde Admin), los actualizamos
            $rol_id = array_key_exists('fk_id_rol', $data)
                ? (!empty($data['fk_id_rol']) ? $data['fk_id_rol'] : null)
                : $usuarioActual->fk_id_rol;

            $equipo_id = array_key_exists('fk_id_equipo', $data)
                ? (!empty($data['fk_id_equipo']) && $data['fk_id_equipo'] !== "" ? $data['fk_id_equipo'] : null)
                : $usuarioActual->fk_id_equipo;

            $datos_usuario = [
                'id' => $id,
                'nombre' => $nombre,
                'apellido' => $apellido,
                'email' => $email,
                'avatar' => trim($data['avatar'] ?? $usuarioActual->avatar ?? 'img_default.png'), 
                'fk_id_rol' => $rol_id,
                'fk_id_equipo' => $equipo_id,
                'pass' => !empty($data['pass']) ? $data['pass'] : null
            ];

            if ($this->usuarioModel->actualizar_usuario($datos_usuario)) {
                if ($esPropioUsuario) {
                    $_SESSION['user_name'] = $nombre;
                    $_SESSION['user_email'] = $email;
                }

                $this->jsonResponse([
                    'success' => true,
                    'message' => 'Datos actualizados exitosamente'
                ]);
            } else {
                $this->jsonResponse([
                    'success' => false,
                    'message' => 'Error al actualizar el usuario en la base de datos'
                ], 500);
            }
        } else {
            // Petición GET: Devolver datos del usuario y lista de roles para el formulario
            $usuario = $this->usuarioModel->obtener_usuario_por_id($id);
            $roles = $this->rolModel->obtenerRoles();
            $equipos = $this->equipoModel->obtenerEquipos();

            if ($usuario) {
                $this->jsonResponse([
                    'success' => true,
                    'usuario' => $usuario,
                    'roles' => $roles,
                    'equipos' => $equipos
                ]);
            } else {
                $this->jsonResponse(['success' => false, 'message' => 'Usuario no encontrado'], 404);
            }
        }
    }

    public function cambiarEstado($id) {
        AuthHelper::tienePermiso('usuarios.editar');

        // Evitar que el usuario logueado se desactive a sí mismo (admin)
        if (isset($_SESSION['user_id']) && (int)$_SESSION['user_id'] === (int)$id) {
            $this->jsonResponse([
                'success' => false,
                'message' => 'No podés desactivar tu propio usuario.'
            ], 400);
            return;
        }

        if ($this->usuarioModel->cambiar_estado_usuario($id)) {
            $usuarioActualizado = $this->usuarioModel->obtener_usuario_por_id($id);
            $estadoTexto = ($usuarioActualizado && (int)$usuarioActualizado->activo === 1) ? 'activado' : 'desactivado';
            $this->jsonResponse([
                'success' => true,
                'message' => "Usuario {$estadoTexto} correctamente",
                'activo' => $usuarioActualizado ? (int)$usuarioActualizado->activo : null
            ]);
        } else {
            $this->jsonResponse([
                'success' => false,
                'message' => 'No se pudo cambiar el estado del usuario'
            ], 500);
        }
    }

    public function eliminar($id) {
        AuthHelper::tienePermiso('usuarios.eliminar');  

        // 1. No permitir auto-eliminación
        if (isset($_SESSION['user_id']) && (int)$_SESSION['user_id'] === (int)$id) {
            $this->jsonResponse([
                'success' => false,
                'message' => 'No podés eliminar tu propio usuario.'
            ], 400);
            return;
        }

        $usuario = $this->usuarioModel->obtener_usuario_por_id($id);
        if (!$usuario) {
            $this->jsonResponse([
                'success' => false,
                'message' => 'El usuario no existe.'
            ], 404);
            return;
        }
        // No eliminar si pertenece a un equipo
        if (!empty($usuario->fk_id_equipo)) {
            $nombreEquipo = $usuario->equipo_nombre ? " ({$usuario->equipo_nombre})" : "";
            $this->jsonResponse([
                'success' => false,
                'message' => "No se puede eliminar el usuario porque pertenece a un equipo{$nombreEquipo}. Primero quitalo del equipo."
            ], 400);
            return;
        }

        // No eliminar si tiene tareas activas asignadas
        if ($this->usuarioModel->contar_tareas_activas_usuario($id) > 0) {
            $this->jsonResponse([
                'success' => false,
                'message' => 'No se puede eliminar el usuario porque tiene tareas pendientes o en curso. Podés desactivarlo en su lugar.'
            ], 400);
            return;
        }

        if ($this->usuarioModel->eliminar_usuario($id)) {
            $this->jsonResponse([
                'success' => true,
                'message' => 'Usuario eliminado correctamente'
            ]);
        } else {
            $this->jsonResponse([
                'success' => false,
                'message' => 'No se pudo eliminar el usuario'
            ], 500);
        }
    }

    public function mostrarUsuario($id)
    {
        $esPropioUsuario = isset($_SESSION['user_id']) && (int)$_SESSION['user_id'] === (int)$id;
        if (!$esPropioUsuario) {
            AuthHelper::tienePermiso('usuarios.ver');
        }
        $usuario = $this->usuarioModel->obtener_usuario_por_id($id);

        if ($usuario) {
            $this->jsonResponse([
                'success' => true,
                'data' => $usuario,
            ]);
        } else {
            $this->jsonResponse([
                'success' => false,
                'message' => 'El usuario no existe.'
            ], 404);
        }
    } 
}

?>