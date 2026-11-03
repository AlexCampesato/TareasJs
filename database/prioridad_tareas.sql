-- 1. Crear tabla de prioridades
CREATE TABLE IF NOT EXISTS prioridades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    color VARCHAR(20) DEFAULT '#6c757d'
);

-- 2. Insertar valores iniciales
INSERT INTO prioridades (id, nombre, color) VALUES
(1, 'Baja', '#6c757d'),
(2, 'Media', '#0dcaf0'),
(3, 'Alta', '#ffc107'),
(4, 'Urgente', '#dc3545');

-- 3. Agregar la clave foránea a la tabla tareas (apuntando por defecto a 'Media' = 2)
ALTER TABLE tareas 
ADD COLUMN fk_id_prioridad INT DEFAULT 2 AFTER fk_id_estado,
ADD CONSTRAINT fk_tareas_prioridad FOREIGN KEY (fk_id_prioridad) REFERENCES prioridades(id);