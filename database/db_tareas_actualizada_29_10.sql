-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-10-2026 a las 04:28:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_tareas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

DROP TABLE IF EXISTS `equipos`;
CREATE TABLE `equipos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id`, `nombre`, `descripcion`, `created_at`) VALUES
(1, 'frontend', 'se encarga de las vistas con bootstrap', '2026-10-14 00:13:42'),
(3, 'backend', 'MCV php', '2026-10-14 00:46:02'),
(5, 'UI', 'experiencia del usuario', '2026-10-16 01:23:02'),
(6, 'AI', 'administracion de bots', '2026-10-16 01:23:37'),
(8, 'pagos', 'pasarelas', '2026-10-16 02:01:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

DROP TABLE IF EXISTS `estado`;
CREATE TABLE `estado` (
  `id_estado` int(11) NOT NULL,
  `tipoEstado` varchar(50) NOT NULL,
  `color` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`id_estado`, `tipoEstado`, `color`) VALUES
(1, 'ToDo', '#36b9cc'),
(2, 'Doing', '#4e73df'),
(3, 'Finished', '#1cc88a'),
(4, 'Expired', '#e74a3b');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

DROP TABLE IF EXISTS `permisos`;
CREATE TABLE `permisos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id`, `nombre`, `descripcion`) VALUES
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
(43, 'permisos.eliminar', 'Permite borrar permisos del sistema');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Admin', 'Administrador general de la app'),
(2, 'Lider', 'Lider de equipo'),
(3, 'Miembro', 'Realiza las tareas asignadas y cambia estados');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_permiso`
--

DROP TABLE IF EXISTS `rol_permiso`;
CREATE TABLE `rol_permiso` (
  `id_rol` int(11) NOT NULL,
  `id_permiso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol_permiso`
--

INSERT INTO `rol_permiso` (`id_rol`, `id_permiso`) VALUES
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
(2, 25),
(2, 29),
(2, 34),
(3, 40);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea`
--

DROP TABLE IF EXISTS `tarea`;
CREATE TABLE `tarea` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `expired_at` datetime NOT NULL,
  `fk_id_estado` int(11) NOT NULL,
  `fk_id_creador` int(11) NOT NULL,
  `fk_id_equipo` int(11) DEFAULT NULL,
  `fk_id_usuario_asignado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarea`
--

INSERT INTO `tarea` (`id`, `titulo`, `descripcion`, `created_at`, `updated_at`, `deleted_at`, `expired_at`, `fk_id_estado`, `fk_id_creador`, `fk_id_equipo`, `fk_id_usuario_asignado`) VALUES
(1, 'armar tarjetas con tareas', 'hacer tareas para back', '2026-10-28 01:28:31', '2026-10-29 02:06:42', NULL, '2026-10-30 00:00:00', 2, 21, 5, 32),
(2, 'armar roles definitivos', 'vincular roles y permisos', '2026-10-28 20:16:23', '2026-10-29 02:27:56', NULL, '2026-10-31 00:00:00', 2, 21, 3, NULL),
(4, 'Visual', 'Mejorar el diseño', '2026-10-28 22:59:26', '2026-10-29 02:43:05', NULL, '2026-10-30 00:00:00', 1, 21, 3, 29);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `fk_id_rol` int(11) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `pass` blob NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fk_id_equipo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `fk_id_rol`, `nombre`, `apellido`, `avatar`, `email`, `pass`, `created_at`, `updated_at`, `deleted_at`, `activo`, `fk_id_equipo`) VALUES
(21, 1, 'admin', 'Lider', 'img_default.png', 'admin@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-11 19:17:02', '2026-10-29 02:47:42', NULL, 1, NULL),
(22, 2, 'Maria', 'Martinez', 'img_default.png', 'maria@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-12 03:17:52', '2026-10-28 00:59:33', NULL, 1, 3),
(24, 2, 'juan', 'j', 'img_default.png', 'juan@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:23:41', '2026-10-29 02:47:27', NULL, 1, 1),
(25, 3, 'pedro', 'p', 'img_default.png', 'pedro@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:23:59', '2026-10-28 21:27:38', NULL, 1, 3),
(26, 2, 'pablo', 'p', 'img_default.png', 'pablo@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:27:21', '2026-10-22 20:02:48', NULL, 0, NULL),
(27, 2, 'marcelo', 'm', 'img_default.png', 'marce@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:28:22', NULL, '2026-10-21 23:39:32', 1, NULL),
(28, 2, 'juana', 'j', 'img_default.png', 'juana@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:30:13', NULL, '2026-10-21 23:34:17', 1, NULL),
(29, 3, 'ana', 'a', 'img_default.png', 'ana@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:34:48', '2026-10-28 23:33:19', NULL, 1, 3),
(30, 2, 'marcela', 'm', 'img_default.png', 'marcela@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:39:58', NULL, '2026-10-21 23:44:19', 1, NULL),
(31, 2, 'marcela', 'mm', 'img_default.png', 'marcela@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:44:36', NULL, '2026-10-22 16:19:37', 1, NULL),
(32, 3, 'Paula', 'p', 'img_default.png', 'paula@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:46:14', '2026-10-28 22:13:26', NULL, 1, 5),
(33, 2, 'fer', 'f', 'img_default.png', 'fer@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:55:47', '2026-10-29 00:19:58', NULL, 1, 5),
(34, NULL, 'ale', 'a', 'img_default.png', 'ale@mail.com', 0xecfeb22ab8ef78593af8df8e5f5eda1b, '2026-10-21 23:57:57', '2026-10-28 01:22:09', NULL, 1, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `rol_permiso`
--
ALTER TABLE `rol_permiso`
  ADD PRIMARY KEY (`id_rol`,`id_permiso`),
  ADD KEY `id_permiso` (`id_permiso`);

--
-- Indices de la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_id_estado` (`fk_id_estado`),
  ADD KEY `fk_tarea_creador` (`fk_id_creador`),
  ADD KEY `fk_tarea_equipo` (`fk_id_equipo`),
  ADD KEY `fk_tarea_asignado` (`fk_id_usuario_asignado`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_id_rol` (`fk_id_rol`),
  ADD KEY `fk_usuario_equipo` (`fk_id_equipo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tarea`
--
ALTER TABLE `tarea`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `rol_permiso`
--
ALTER TABLE `rol_permiso`
  ADD CONSTRAINT `rol_permiso_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rol_permiso_ibfk_2` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD CONSTRAINT `fk_tarea_asignado` FOREIGN KEY (`fk_id_usuario_asignado`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `fk_tarea_creador` FOREIGN KEY (`fk_id_creador`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `fk_tarea_equipo` FOREIGN KEY (`fk_id_equipo`) REFERENCES `equipos` (`id`),
  ADD CONSTRAINT `tarea_ibfk_1` FOREIGN KEY (`fk_id_estado`) REFERENCES `estado` (`id_estado`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_equipo` FOREIGN KEY (`fk_id_equipo`) REFERENCES `equipos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`fk_id_rol`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
