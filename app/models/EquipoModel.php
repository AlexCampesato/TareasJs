<?php

class EquipoModel {
    private $db;

    public function __construct()
    {
        $this->db = new Database;
    }

    // Crear un nuevo equipo
    
    public function crearEquipo(array $data)
    {
        $this -> db -> query("INSERT INTO equipos (nombre, descripcion) VALUES (:nombre, :descripcion)");
        
        $this -> db -> bind(':nombre', $data['nombre']);
        $this -> db -> bind(':descripcion', $data['descripcion']);

        return $this -> db -> execute();
    }

     // Obtener todos los equipos
    
    public function obtenerEquipos()
    {
        $this -> db -> query("SELECT * FROM equipos ORDER BY id ASC");
        
        return $this -> db -> registers();
    }

    
     // Obtener un solo equipo por su ID
    
    public function obtenerEquipoPorId(int $id)
    {
        $this -> db -> query("SELECT * FROM equipos WHERE id = :id");
        $this -> db -> bind(':id', $id);
        
        return $this -> db -> register();
    }

    // Actualizar un equipo existente
     
    public function actualizarEquipo(array $data)
    {
        $this -> db -> query("UPDATE equipos SET nombre = :nombre, descripcion = :descripcion WHERE id = :id");
        
        $this -> db -> bind(':id', $data['id']);
        $this -> db -> bind(':nombre', $data['nombre']);
        $this -> db -> bind(':descripcion', $data['descripcion']);

        return $this -> db -> execute();
    }

    
    // Eliminar un equipo
    
    public function eliminarEquipo(int $id)
    {
        $this -> db -> query("DELETE FROM equipos WHERE id = :id");
        $this -> db -> bind(':id', $id);

        return $this -> db -> execute();
    }

    public function asignarUsuarioAEquipo($id_usuario, $id_equipo) {
       
        $this->db->query("UPDATE usuario SET fk_id_equipo = :id_equipo WHERE id = :id_usuario");
        
        $this->db->bind(':id_equipo', $id_equipo);
        $this->db->bind(':id_usuario', $id_usuario);
        
        return $this->db->execute();
    }
}