<?php

class RolController extends BaseController {
    private $rolModel;
    private $permisoModel;

    public function __construct() {
        $this->rolModel = $this->model('RolModel');
        $this->permisoModel = $this->model('PermisosModel');
    }

    // Muestra la lista de todos los roles (Devuelve JSON)
    public function index() {
        AuthHelper::tienePermiso('roles.gestionar');
        $roles = $this->rolModel->obtenerRoles();
        
        if ($roles !== false) {
            $this->jsonResponse([
                'success' => true,
                'data' => $roles
            ]);
        } else {
            $this->jsonResponse([
                'success' => false,
                'message' => 'Error al obtener los roles'
            ], 500);
        }
    }

    
    public function crear() {
        AuthHelper::tienePermiso('roles.crear'); 
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Leer el JSON enviado por fetch
            $data = $this->getJsonBody();
            
            $datos = [
                'nombre' => trim($data['nombre'] ?? ''),
                'descripcion' => trim($data['descripcion'] ?? '')
            ];
            
            if (empty($datos['nombre'])) {
                $this->jsonResponse([
                    'success' => false,
                    'message' => 'El nombre del rol es obligatorio'
                ], 400);
                return;
            }

            if ($this->rolModel->crearRol($datos)) {
                $nuevoRolId = $this->rolModel->obtenerRoles();
                // Obtener el último ID insertado o el rol recién creado
                $ultimoId = !empty($nuevoRolId) ? end($nuevoRolId)->id : null;

                // Asignar permisos si fueron enviados
                if ($ultimoId && !empty($data['permisos']) && is_array($data['permisos'])) {
                    foreach ($data['permisos'] as $idPermiso) {
                        $this->rolModel->asignarPermisoARol((int)$ultimoId, (int)$idPermiso);
                    }
                }

                $this->jsonResponse([
                    'success' => true, 
                    'message' => 'Rol creado correctamente'
                ]);
            } else {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'Algo salió mal al crear el rol'
                ], 500);
            }
        }
    }

   
    public function editar($id) {
        AuthHelper::tienePermiso('roles.editar'); 
        if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT') {
           
            $data = $this->getJsonBody();
            
            $datos = [
                'id' => $id,
                'nombre' => trim($data['nombre'] ?? ''),
                'descripcion' => trim($data['descripcion'] ?? '')
            ];

            if ($this->rolModel->actualizarRol($datos)) {
                // Sincronizar permisos del rol
                $this->rolModel->limpiarPermisosDeRol((int)$id);

                if (!empty($data['permisos']) && is_array($data['permisos'])) {
                    foreach ($data['permisos'] as $idPermiso) {
                        $this->rolModel->asignarPermisoARol((int)$id, (int)$idPermiso);
                    }
                }

                $this->jsonResponse([
                    'success' => true, 
                    'message' => 'Rol y permisos actualizados correctamente'
                ]);
            } else {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'Algo salió mal al actualizar el rol'
                ], 500);
            }
        } else {
            // Petición GET: Devolver el rol, el catálogo completo de permisos y los permisos que ya tiene
            $rol = $this->rolModel->obtenerRolPorId($id);
            $todosLosPermisos = $this->permisoModel->obtenerPermisos();
            $permisosAsignadosIds = $this->rolModel->obtenerIdsPermisosPorRol((int)$id);

            if ($rol) {
                $this->jsonResponse([
                    'success' => true,
                    'data' => $rol,
                    'rol' => $rol,
                    'todos_permisos' => $todosLosPermisos ?: [],
                    'permisos_asignados' => $permisosAsignadosIds ?: []
                ]);
            } else {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'Rol no encontrado'
                ], 404);
            }
        }
    }

    
    public function eliminar($id) {
        AuthHelper::tienePermiso('roles.eliminar'); 
        if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'DELETE') {
            if ($this->rolModel->eliminarRol($id)) {
                $this->jsonResponse([
                    'success' => true, 
                    'message' => 'Rol eliminado correctamente'
                ]);
            } else {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'Algo salió mal al eliminar el rol'
                ], 500);
            }
        }
    }

    public function mostrarRol($id)
    {
        // Protegemos también la consulta individual por ID
        AuthHelper::tienePermiso('roles.gestionar');
        $rol = $this->rolModel->obtenerRolPorId($id);
        $permisos = $this->rolModel->obtenerPermisosPorRol((int)$id);

        if ($rol) {
            $this->jsonResponse([
                'success' => true,
                'rol' => $rol,
                'data' => $rol,
                'permisos' => $permisos ?: []
            ]);
        } else {
            $this->jsonResponse([
                'success' => false,
                'message' => 'El rol no existe.'
            ], 404);
        }
    } 
}