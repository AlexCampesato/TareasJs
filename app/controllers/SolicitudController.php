<?php

require_once __DIR__ . '/../models/SolicitudModel.php';

class SolicitudController extends BaseController{

    public function crear()
    {
        $id_tarea = $_POST['id_tarea'] ?? null;
        $tipo = $_POST['tipo'] ?? 'extension_fecha';
        
        // Obtener el ID del usuario desde la sesión actual
        if (session_status() === PHP_SESSION_NONE) {
             session_start();
        }
        $id_usuario = $_SESSION['user']['id'] ?? $_SESSION['user_id'] ?? null;

        if (!$id_tarea || !$id_usuario) {
            header('Content-Type: application/json');
            echo json_encode(['ok' => false, 'message' => 'Datos incompletos o sesión expirada.']);
            exit;
        }

        $solicitudModel = new SolicitudModel();
        $resultado = $solicitudModel->crearSolicitud($id_tarea, $id_usuario, $tipo);

        header('Content-Type: application/json');
        echo json_encode($resultado);
        exit;
    }

    public function pendientes()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $id_lider = $_SESSION['user']['id'] ?? $_SESSION['user_id'] ?? null;

        if (!$id_lider) {
            header('Content-Type: application/json');
            echo json_encode(['ok' => false, 'message' => 'Sesión expirada.']);
            exit;
        }

       // Usar ruta absoluta con __DIR__
        require_once __DIR__ . '/../models/SolicitudModel.php';

        $solicitudModel = new SolicitudModel();
        $solicitudes = $solicitudModel->obtenerSolicitudesPorEquipo($id_lider);

        header('Content-Type: application/json');
        echo json_encode([
            'ok' => true,
            'solicitudes' => is_array($solicitudes) ? $solicitudes : []
        ]);
        exit;
    }
}