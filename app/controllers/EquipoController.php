<?php
class EquipoController extends BaseController {
    private $equipoModel;
    private $usuarioModel;

    public function __construct() {
        $this->equipoModel = $this->model('EquipoModel');
        $this->usuarioModel = $this->model('UsuarioModel'); 
    }

    
    public function index() {
        AuthHelper::tienePermiso('equipos.ver');
        $equipos = $this->equipoModel->obtenerEquipos();
        
        // TIENE que ser JSON para que getEquipos.js pueda leerlo
        $this->jsonResponse([
            'success' => true,
            'equipos' => $equipos 
        ]);
    }
  
    public function crear() { 
        AuthHelper::tienePermiso('equipos.crear');
         if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Leer el JSON enviado por fetch
            $data = json_decode(file_get_contents("php://input"), true);
            
            $datos = [
                'nombre' => trim($data['nombre'] ?? ''),
                'descripcion' => trim($data['descripcion'] ?? '')
            ];
            
            if ($this->equipoModel->crearEquipo($datos)) {
                $this->jsonResponse([
                    'success' => true, 
                    'message' => 'Equipo creado correctamente'
                ]);
            } else {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'Algo salió mal al crear el equipo'
                ], 500);
            }
        }

     }
    public function editar($id) { 
        AuthHelper::tienePermiso('equipos.editar');
         if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT') {
           
            $data = json_decode(file_get_contents("php://input"), true);
            
            $datos = [
                'id' => $id,
                'nombre' => trim($data['nombre'] ?? ''),
                'descripcion' => trim($data['descripcion'] ?? '')
            ];

            if ($this->equipoModel->actualizarEquipo($datos)) {
                $this->jsonResponse([
                    'success' => true, 
                    'message' => 'Equipo actualizado correctamente'
                ]);
            } else {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'Algo salió mal al actualizar el equipo'
                ], 500);
            }
        } else {
          
            $rol = $this->equipoModel->obtenerEquipoPorId($id);

            if ($rol) {
                $this->jsonResponse([
                    'success' => true,
                    'data' => $rol
                ]);
            } else {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'Equipo no encontrado'
                ], 404);
            }
        }
     }

    public function eliminar($id)
    {
        AuthHelper::tienePermiso('equipos.eliminar');

        if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'DELETE') {

            $integrantes = $this->equipoModel->obtenerIntegrantesPorEquipo($id);

            if (!empty($integrantes) && count($integrantes) > 0) {
                $this->jsonResponse([
                    'success' => false,
                    'message' => 'No se puede eliminar el equipo porque tiene miembros asignados.'
                ], 400);
                return;
            }

            // Verificamos si tiene usuarios históricos (soft-deleted) que bloqueen la FK
            if ($this->equipoModel->contarUsuariosPorEquipo($id) > 0) {
                $this->jsonResponse([
                    'success' => false,
                    'message' => 'No se puede eliminar el equipo porque tiene historial de usuarios asociados.'
                ], 400);
                return;
            }

            //Intentamos eliminar capturando cualquier restricción de BD
            try {
                if ($this->equipoModel->eliminarEquipo($id)) {
                    $this->jsonResponse([
                        'success' => true, 
                        'message' => 'Equipo eliminado correctamente'
                    ]);
                } else {
                    $this->jsonResponse([
                        'success' => false, 
                        'message' => 'Algo salió mal al eliminar el equipo'
                    ], 500);
                }
            } catch (PDOException $e) {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'No se puede eliminar el equipo porque tiene tareas asignadas.'
                ], 400);
            }
        }
    }

    
    public function mostrarEquipo($id)
    {
       AuthHelper::tienePermiso('equipos.ver');
        $equipo = $this->equipoModel->obtenerEquipoPorId($id);
        $integrantes = $this->equipoModel->obtenerIntegrantesPorEquipo($id);

        if ($equipo) {
            $this->jsonResponse([
                'success' => true,
                'equipo' => $equipo,
                'integrantes' => $integrantes
            ]);
        } else {
            $this->jsonResponse([
                'success' => false,
                'message' => 'El equipo no existe.'
            ], 404);
        }
    } 
    // Recibe el ID del usuario y el ID del equipo al que se va a asignar
    public function asignarMiembro() {
        AuthHelper::tienePermiso('equipos.asignar');
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            $data = json_decode(file_get_contents("php://input"), true);
            $id_usuario = $data['id_usuario'];
            $id_equipo = $data['id_equipo']; 

            
            if ($this->equipoModel->asignarUsuarioAEquipo($id_usuario, $id_equipo)) {
                $this->jsonResponse([
                    'success' => true, 
                    'message' => 'Miembro asignado al equipo correctamente'
                ]);
            } else {
                $this->jsonResponse([
                    'success' => false, 
                    'message' => 'Error al asignar el miembro'
                ], 500);
            }
        }
    } 

    public function obtener_miembros($id_equipo)
    {
        AuthHelper::tienePermiso('equipos.ver');
        $equipoModel = new EquipoModel();
        $miembros = $equipoModel->obtenerIntegrantesPorEquipo($id_equipo);

        // Nos aseguramos de devolver siempre un array
        $lista = is_array($miembros) ? $miembros : [];

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'ok' => true,
            'miembros' => $lista
        ]);
        exit;
    }
}