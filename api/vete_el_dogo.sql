-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 16-10-2025 a las 12:34:10
-- Versión del servidor: 8.0.39
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `vete_el_dogo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `apellido` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `direccion` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `id_2` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `apellido`, `telefono`, `direccion`, `email`) VALUES
(11, 'Franco', 'Perez', '65445333335', 'Cordoba 234', 'franco@gmail.com'),
(12, 'Claudio', 'Zapata', '65445333335', 'La Paz 546', 'claudio@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascotas`
--

DROP TABLE IF EXISTS `mascotas`;
CREATE TABLE IF NOT EXISTS `mascotas` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `especie` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `raza` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `problemas_salud` text CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci,
  `cliente_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `mascotas`
--

INSERT INTO `mascotas` (`id`, `nombre`, `especie`, `raza`, `edad`, `problemas_salud`, `cliente_id`) VALUES
(4, 'Milo', 'Perro', 'Mestizo', 2, 'Alergico a las pulgas', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(100) COLLATE utf8mb3_spanish_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb3_spanish_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `rol` enum('ADMIN','VETERINARIO','RECEPCIONISTA') COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_completo`, `direccion`, `email`, `password`, `rol`) VALUES
(1, 'Miguel Zapata', 'San Martin123', 'miguel@gmail.com', '$2y$10$doYdoTwBW6jwXf6pn42IpOxqNhtIGUnCol.TBKoGJz37FJb0ZEwOO', 'ADMIN'),
(3, 'Felipe Lopez', 'Santa Fe 123', 'felipe@gmail.com', '$2y$10$0dqgRYPQ8Z5plTSyDyXhfurRkQ.gEV6exOM4Y1SFPFr1BlJBkKYM.', 'ADMIN'),
(4, 'Franco Perez', 'Buenos Aires 34', 'franco@gmail.com', '$2y$10$KToJzjYJMdavcbE5Lod9MO2GO6E8wOSaNlBC6hcgBlsAnGA3nP.mS', 'VETERINARIO'),
(5, 'Maria Rosas', 'San Martin123', 'maria@maria.com', '$2y$10$OIXu8nqSG3GnRnzKldyG1OHGu0YXe3KDhd3h3UmEAXeJJOqxx9UjC', 'RECEPCIONISTA');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
