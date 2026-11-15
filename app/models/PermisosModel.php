<?php

class PermisosModel {
    private $db;

    public function __construct()
    {
        $this->db= new Database;
    }
    
    // Crear permiso

    public function crearPermiso($data){

        $this->db-> query("INSERT INTO permisos (nombre, descripcion)
                     VALUES (:nombre, :descripcion)");

        $this->db-> bind('nombre', $data['nombre']);
        $this->db-> bind(':descripcion', $data['descripcion']);

        if ($this->db->execute()) {
			return true;
		} else {
			return false;
		}
    }

    // Obtener los permisos

    public function obtenerPermisos(){
        $this->db->query("SELECT * FROM permisos ORDER BY id ASC");

        return $this->db->registers();

    }

    // Obtener permiso por ID

    public function obtenerPermisoPorId($id){
        $this->db->query("SELECT * FROM permisos WHERE id = :id");
        $this->db->bind(':id', $id);

        return $this->db->register();
    }

    //Actualizar permiso

    public function actualizarPermiso($data){

        $this->db->query("UPDATE permisos SET nombre = :nombre, descripcion = :descripcion WHERE id = :id");

        $this->db->bind(':id', $data['id']);
        $this->db->bind(':nombre', $data['nombre']);
        $this->db->bind(':descripcion', $data['descripcion']);

        return $this->db->execute();
    }

    //Eliminar permiso
    public function eliminarPermiso($id)
    {
        $this->db->query("DELETE FROM permisos WHERE id = :id");
        $this->db->bind(':id', $id);

        return $this->db->execute();
    }

    // Obtener los nombres de permisos que posee un usuario según su rol
    public function obtenerPermisosPorUsuario($usuarioId) {
        $this->db->query("SELECT p.nombre 
                          FROM permisos p
                          INNER JOIN rol_permiso rp ON p.id = rp.id_permiso
                          INNER JOIN usuario u ON u.fk_id_rol = rp.id_rol
                          WHERE u.id = :id");
        
        $this->db->bind(':id', $usuarioId);
        
        // Traemos todos los registros coincidentes
        $resultados = $this->db->registers(); 

        // Transformamos el resultado en un array plano de strings (ej: ['tareas.crear', 'solicitudes.ver'])
        $permisosArray = [];
        if ($resultados) {
            foreach ($resultados as $row) {
                 
                
                $permisosArray[] = $row->nombre;
            }
        }

        return $permisosArray;
    }

}