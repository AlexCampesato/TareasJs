-- 1. Insertar Permisos
INSERT IGNORE INTO permisos (nombre, descripcion) VALUES 
('usuarios.ver', 'Ver lista de usuarios'),
('usuarios.crear', 'Crear nuevos usuarios'),
('usuarios.editar', 'Modificar usuarios y estados'),
('usuarios.eliminar', 'Eliminar usuarios'),
('roles.ver', 'Ver lista de roles'),
('roles.crear', 'Crear nuevos roles'),
('roles.editar', 'Modificar roles existentes'),
('roles.eliminar', 'Eliminar roles del sistema'),
('roles.gestionar', 'Administrar roles y sus permisos'),
('equipos.ver', 'Ver lista de equipos'),
('equipos.editar', 'Permite modificar nombre y descripción de equipos'),
('equipos.crear', 'Crear equipos nuevos'),
('equipos.eliminar', 'Permite borrar equipos del sistema'),
('equipos.miembros', 'Gestionar integrantes de equipos'),
('tareas.eliminar', 'Borrar tareas del sistema'),
('tareas.ver.todo', 'Ver estadísticas globales de tareas');
('permisos.crear', 'Permite crear nuevos permisos en el sistema'),
('permisos.editar', 'Permite modificar permisos existentes'),
('permisos.eliminar', 'Permite borrar permisos del sistema');

-- 2. Vincular todos al Rol 1 (Líder)
INSERT IGNORE INTO rol_permiso (id_rol, id_permiso)
SELECT 1, id FROM permisos;

-- 3. Vincular solo algunos al Rol 2 (Miembro) 
-- (El Miembro solo ve tareas y equipos, no administra usuarios)
INSERT IGNORE INTO rol_permiso (id_rol, id_permiso)
SELECT 2, id FROM permisos WHERE nombre IN ('equipos.ver', 'usuarios.ver','roles.ver');