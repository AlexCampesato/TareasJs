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
    // 1. Desactiva temporalmente el AuthHelper para descartar que sea el guardia
    // AuthHelper::tienePermiso('usuarios.ver'); 

    $usuarios = $this->usuarioModel->obtener_usuarios();
    
    // 2. Debug: Si $usuarios devuelve un error (false), aquí lo veremos en la consola
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
                'fk_id_rol' => !empty($data['fk_id_rol']) ? $data['fk_id_rol'] : 2,
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
            AuthHelper::tienePermiso('usuarios.editar');  
            $data = $this->getJsonBody();

            if (empty($data['email']) || empty($data['nombre'])) {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'Faltan campos obligatorios'
                ], 400);
                return;
            }

            $equipo_id = (!empty($data['fk_id_equipo']) && $data['fk_id_equipo'] !== "") 
                         ? $data['fk_id_equipo'] 
                         : null;

            $datos_usuario = [
                'id' => $id,
                'nombre' => trim($data['nombre']),
                'apellido' => trim($data['apellido'] ?? ''),
                'email' => trim($data['email']),
                'avatar' => trim($data['avatar'] ?? 'img_default.png'), 
                'fk_id_rol' => $data['fk_id_rol'],
                'fk_id_equipo' => $equipo_id,
                'pass' => !empty($data['pass']) ? $data['pass'] : null
            ];

            if ($this->usuarioModel->actualizar_usuario($datos_usuario)) {
                $this->jsonResponse([
                    'success' => true,
                    'message' => 'Usuario actualizado exitosamente'
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