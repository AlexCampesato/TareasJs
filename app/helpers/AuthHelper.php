<?php

class AuthHelper {

    
    public static function tienePermiso($permiso) {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Sesión no iniciada']);
        exit;
    }

    $db = new Database();
    // Agregamos un TRY/CATCH aquí para ver si la consulta falla
    try {
        $db->query("SELECT p.nombre 
                    FROM permisos p
                    INNER JOIN rol_permiso rp ON p.id = rp.id_permiso
                    INNER JOIN usuario u ON u.fk_id_rol = rp.id_rol
                    WHERE u.id = :uid AND p.nombre = :permiso");
        
        $db->bind(':uid', $_SESSION['user_id']);
        $db->bind(':permiso', $permiso);
        
        if (!$db->register()) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'No tienes permiso para: ' . $permiso]);
            exit; 
        }
    } catch (Exception $e) {
        // SI ENTRA ACÁ, EL ERROR ES SQL
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error SQL: ' . $e->getMessage()]);
        exit;
    }

    return true;
}
}