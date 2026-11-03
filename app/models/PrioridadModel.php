<?php
class PrioridadModel
{
     protected $db;

    public function __construct()
    {
        $this->db = new Database();
    }
    
    public function obtenerPrioridad()
    {
        $this->db->query("SELECT * FROM prioridad ORDER BY id ASC");
        return $this->db->registers();
    }
}