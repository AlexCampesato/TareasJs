-- 1. Agregar la columna de equipo a tu tabla de usuarios actual
ALTER TABLE `usuario` 
ADD `fk_id_equipo` INT(11) DEFAULT NULL;

-- 2. Crear la relación (Llave foránea)
ALTER TABLE `usuario` 
ADD CONSTRAINT `fk_usuario_equipo` FOREIGN KEY (`fk_id_equipo`) REFERENCES `equipos`(`id`) ON DELETE SET NULL;