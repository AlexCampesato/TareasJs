CREATE TABLE IF NOT EXISTS estado_solicitud (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO estado_solicitud (id, nombre) VALUES 
(1, 'Pendiente'),
(2, 'Aceptada'),
(3, 'Rechazada');

CREATE TABLE IF NOT EXISTS solicitud (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_tarea INT NOT NULL,
    fk_id_usuario INT NOT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'extension_fecha', -- Para saber qué está pidiendo
    fk_id_estado_solicitud INT NOT NULL DEFAULT 1,       -- 1: Pendiente, 2: Resuelta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_id_tarea) REFERENCES tarea(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_id_estado_solicitud) REFERENCES estado_solicitud(id)
);