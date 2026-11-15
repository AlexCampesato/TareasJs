-- ========================================================
-- SCRIPT REDUCIDO DE ACTUALIZACIÓN DE PERMISOS Y ROLES
-- ========================================================

-- 1. Volcado de datos para la tabla `permisos`
INSERT IGNORE INTO `permisos` (`id`, `nombre`, `descripcion`) VALUES
(25, 'usuarios.ver', 'Ver lista de usuarios'),
(26, 'usuarios.crear', 'Crear nuevos usuarios'),
(27, 'usuarios.editar', 'Modificar usuarios y estados'),
(28, 'usuarios.eliminar', 'Eliminar usuarios'),
(29, 'roles.ver', 'Ver lista de roles'),
(30, 'roles.crear', 'Crear nuevos roles'),
(31, 'roles.editar', 'Modificar roles existentes'),
(32, 'roles.eliminar', 'Eliminar roles del sistema'),
(33, 'roles.gestionar', 'Administrar roles y sus permisos'),
(34, 'equipos.ver', 'Ver lista de equipos'),
(35, 'equipos.editar', 'Permite modificar nombre y descripción de equipos'),
(36, 'equipos.crear', 'Crear equipos nuevos'),
(37, 'equipos.eliminar', 'Permite borrar equipos del sistema'),
(38, 'equipos.miembros', 'Gestionar integrantes de equipos'),
(39, 'tareas.eliminar', 'Borrar tareas del sistema'),
(40, 'tareas.ver.todo', 'Ver estadísticas globales de tareas'),
(41, 'permisos.crear', 'Permite crear nuevos permisos en el sistema'),
(42, 'permisos.editar', 'Permite modificar permisos existentes'),
(43, 'permisos.eliminar', 'Permite borrar permisos del sistema'),
(44, 'tareas.crear', 'Permite crear nuevas tareas desde el dashboard'),
(45, 'tareas.editar', 'Permite modificar los datos de una tarea'),
(46, 'tareas.asignar_equipo', 'Permite asignar o reasignar un equipo a una tarea'),
(47, 'tareas.asignar_miembro', 'Permite delegar la tarea a un integrante del equipo'),
(48, 'tareas.cambiar_prioridad', 'Permite cambiar la prioridad de una tarea'),
(49, 'tareas.cambiar_estado', 'Permite al miembro actualizar el estado de su tarea asignada'),
(50, 'solicitudes.ver', 'Permite ver la campana de notificaciones y abrir el modal de solicitudes pendientes');

-- 2. Volcado de datos para la tabla `roles`
INSERT IGNORE INTO `roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Admin', 'Administrador general de la app'),
(2, 'Lider', 'Lider de equipo'),
(3, 'Miembro', 'Realiza las tareas asignadas y cambia estados');

-- 3. Volcado de datos para la tabla `rol_permiso` (Relaciones)
INSERT IGNORE INTO `rol_permiso` (`id_rol`, `id_permiso`) VALUES
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 36),
(1, 37),
(1, 38),
(1, 39),
(1, 40),
(1, 41),
(1, 42),
(1, 43),
(1, 44),
(1, 45),
(1, 46),
(1, 48),
(1, 49),
(2, 25),
(2, 29),
(2, 34),
(2, 38),
(2, 39),
(2, 40),
(2, 45),
(2, 47),
(2, 48),
(2, 49),
(2, 50),
(3, 40),
(3, 49);