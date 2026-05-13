-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2026 at 09:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `almka_blind`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `device_sessions`
--

CREATE TABLE `device_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `device_id` varchar(255) NOT NULL DEFAULT 'almka-blind-001',
  `device_ip` varchar(255) DEFAULT NULL,
  `wifi_mode` varchar(255) NOT NULL DEFAULT 'STA',
  `wifi_ssid` varchar(255) DEFAULT NULL,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ended_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `device_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`device_info`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `device_sessions`
--

INSERT INTO `device_sessions` (`id`, `device_id`, `device_ip`, `wifi_mode`, `wifi_ssid`, `started_at`, `ended_at`, `is_active`, `device_info`, `created_at`, `updated_at`) VALUES
(1, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 21:52:22', '2026-04-08 13:52:22', 0, NULL, '2026-04-08 13:51:03', '2026-04-08 13:52:22'),
(2, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 22:01:58', '2026-04-08 14:01:58', 0, NULL, '2026-04-08 13:52:22', '2026-04-08 14:01:58'),
(3, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 22:02:42', '2026-04-08 14:02:42', 0, NULL, '2026-04-08 14:01:58', '2026-04-08 14:02:42'),
(4, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 22:04:45', '2026-04-08 14:04:45', 0, NULL, '2026-04-08 14:02:42', '2026-04-08 14:04:45'),
(5, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 22:09:22', '2026-04-08 14:09:22', 0, NULL, '2026-04-08 14:04:45', '2026-04-08 14:09:22'),
(6, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 22:10:52', '2026-04-08 14:10:52', 0, NULL, '2026-04-08 14:09:22', '2026-04-08 14:10:52'),
(7, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 22:11:07', '2026-04-08 14:11:07', 0, NULL, '2026-04-08 14:10:52', '2026-04-08 14:11:07'),
(8, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 22:13:45', '2026-04-08 14:13:45', 0, NULL, '2026-04-08 14:11:07', '2026-04-08 14:13:45'),
(9, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 22:22:58', '2026-04-08 14:22:58', 0, NULL, '2026-04-08 14:13:45', '2026-04-08 14:22:58'),
(10, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 22:24:16', '2026-04-08 14:24:16', 0, NULL, '2026-04-08 14:22:58', '2026-04-08 14:24:16'),
(11, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 23:04:01', '2026-04-08 15:04:01', 0, NULL, '2026-04-08 14:24:16', '2026-04-08 15:04:01'),
(12, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 23:34:46', '2026-04-08 15:34:46', 0, NULL, '2026-04-08 15:04:01', '2026-04-08 15:34:46'),
(13, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 23:42:57', '2026-04-08 15:42:57', 0, NULL, '2026-04-08 15:34:46', '2026-04-08 15:42:57'),
(14, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 23:44:51', '2026-04-08 15:44:51', 0, NULL, '2026-04-08 15:42:57', '2026-04-08 15:44:51'),
(15, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 23:52:12', '2026-04-08 15:52:12', 0, NULL, '2026-04-08 15:44:51', '2026-04-08 15:52:12'),
(16, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 23:52:14', '2026-04-08 15:52:14', 0, NULL, '2026-04-08 15:52:12', '2026-04-08 15:52:14'),
(17, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-09 00:26:43', '2026-04-08 16:26:43', 0, NULL, '2026-04-08 15:52:14', '2026-04-08 16:26:43'),
(18, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-09 00:28:10', '2026-04-08 16:28:10', 0, NULL, '2026-04-08 16:26:43', '2026-04-08 16:28:10'),
(19, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-09 00:30:59', '2026-04-08 16:30:59', 0, NULL, '2026-04-08 16:28:10', '2026-04-08 16:30:59'),
(20, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-09 00:33:23', '2026-04-08 16:33:23', 0, NULL, '2026-04-08 16:30:59', '2026-04-08 16:33:23'),
(21, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-09 00:39:35', '2026-04-08 16:39:35', 0, NULL, '2026-04-08 16:33:23', '2026-04-08 16:39:35'),
(22, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-09 00:57:19', '2026-04-08 16:57:19', 0, NULL, '2026-04-08 16:39:35', '2026-04-08 16:57:19'),
(23, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-09 01:04:14', '2026-04-08 17:04:14', 0, NULL, '2026-04-08 16:57:19', '2026-04-08 17:04:14'),
(24, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-09 01:13:14', '2026-04-08 17:13:14', 0, NULL, '2026-04-08 17:04:14', '2026-04-08 17:13:14'),
(25, 'almka-blind-001', '10.41.241.39', 'STA', 'SM', '2026-04-08 17:13:14', NULL, 1, NULL, '2026-04-08 17:13:14', '2026-04-08 17:13:14');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `latitude`, `longitude`, `created_at`, `updated_at`) VALUES
(1, 14.77257787, 121.07895805, '2026-04-08 16:00:07', '2026-04-08 16:00:07'),
(2, 14.77257787, 121.07895805, '2026-04-08 16:00:11', '2026-04-08 16:00:11'),
(3, 14.77257787, 121.07895805, '2026-04-08 16:00:16', '2026-04-08 16:00:16'),
(4, 14.77257787, 121.07895805, '2026-04-08 16:00:21', '2026-04-08 16:00:21'),
(5, 14.77257787, 121.07895805, '2026-04-08 16:00:30', '2026-04-08 16:00:30'),
(6, 14.77257787, 121.07895805, '2026-04-08 16:00:35', '2026-04-08 16:00:35'),
(7, 14.77257787, 121.07895805, '2026-04-08 16:00:40', '2026-04-08 16:00:40'),
(8, 14.77257787, 121.07895805, '2026-04-08 16:00:45', '2026-04-08 16:00:45'),
(9, 14.77257787, 121.07895805, '2026-04-08 16:00:50', '2026-04-08 16:00:50'),
(10, 14.77257787, 121.07895805, '2026-04-08 16:00:55', '2026-04-08 16:00:55'),
(11, 14.77257787, 121.07895805, '2026-04-08 16:01:00', '2026-04-08 16:01:00'),
(12, 14.77257787, 121.07895805, '2026-04-08 16:01:05', '2026-04-08 16:01:05'),
(13, 14.77257787, 121.07895805, '2026-04-08 16:01:10', '2026-04-08 16:01:10'),
(14, 14.77260676, 121.07894241, '2026-04-08 16:01:14', '2026-04-08 16:01:14'),
(15, 14.77260676, 121.07894241, '2026-04-08 16:01:18', '2026-04-08 16:01:18'),
(16, 14.77260676, 121.07894241, '2026-04-08 16:01:22', '2026-04-08 16:01:22'),
(17, 14.77260676, 121.07894241, '2026-04-08 16:01:25', '2026-04-08 16:01:25'),
(18, 14.77260676, 121.07894241, '2026-04-08 16:01:31', '2026-04-08 16:01:31'),
(19, 14.77260676, 121.07894241, '2026-04-08 16:01:33', '2026-04-08 16:01:33'),
(20, 14.77260676, 121.07894241, '2026-04-08 16:01:36', '2026-04-08 16:01:36'),
(21, 14.77260676, 121.07894241, '2026-04-08 16:01:41', '2026-04-08 16:01:41'),
(22, 14.77260676, 121.07894241, '2026-04-08 16:01:46', '2026-04-08 16:01:46'),
(23, 14.77260676, 121.07894241, '2026-04-08 16:01:51', '2026-04-08 16:01:51'),
(24, 14.77260676, 121.07894241, '2026-04-08 16:01:56', '2026-04-08 16:01:56'),
(25, 14.77260676, 121.07894241, '2026-04-08 16:02:01', '2026-04-08 16:02:01'),
(26, 14.77260676, 121.07894241, '2026-04-08 16:02:06', '2026-04-08 16:02:06'),
(27, 14.77260676, 121.07894241, '2026-04-08 16:02:11', '2026-04-08 16:02:11'),
(28, 14.77260676, 121.07894241, '2026-04-08 16:02:16', '2026-04-08 16:02:16'),
(29, 14.77259761, 121.07891555, '2026-04-08 16:02:22', '2026-04-08 16:02:22'),
(30, 14.77259761, 121.07891555, '2026-04-08 16:02:26', '2026-04-08 16:02:26'),
(31, 14.77259761, 121.07891555, '2026-04-08 16:02:32', '2026-04-08 16:02:32'),
(32, 14.77259761, 121.07891555, '2026-04-08 16:02:34', '2026-04-08 16:02:34'),
(33, 14.77259761, 121.07891555, '2026-04-08 16:02:37', '2026-04-08 16:02:37'),
(34, 14.77259761, 121.07891555, '2026-04-08 16:02:42', '2026-04-08 16:02:42'),
(35, 14.77259761, 121.07891555, '2026-04-08 16:02:47', '2026-04-08 16:02:47'),
(36, 14.77259761, 121.07891555, '2026-04-08 16:02:52', '2026-04-08 16:02:52'),
(37, 14.77259761, 121.07891555, '2026-04-08 16:02:57', '2026-04-08 16:02:57'),
(38, 14.77259761, 121.07891555, '2026-04-08 16:03:02', '2026-04-08 16:03:02'),
(39, 14.77259761, 121.07891555, '2026-04-08 16:03:08', '2026-04-08 16:03:08'),
(40, 14.77259761, 121.07891555, '2026-04-08 16:03:13', '2026-04-08 16:03:13'),
(41, 14.77259761, 121.07891555, '2026-04-08 16:03:18', '2026-04-08 16:03:18'),
(42, 14.77261447, 121.07887627, '2026-04-08 16:03:24', '2026-04-08 16:03:24'),
(43, 14.77261447, 121.07887627, '2026-04-08 16:03:28', '2026-04-08 16:03:28'),
(44, 14.77261447, 121.07887627, '2026-04-08 16:03:33', '2026-04-08 16:03:33'),
(45, 14.77261447, 121.07887627, '2026-04-08 16:03:38', '2026-04-08 16:03:38'),
(46, 14.77261447, 121.07887627, '2026-04-08 16:03:43', '2026-04-08 16:03:43'),
(47, 14.77261447, 121.07887627, '2026-04-08 16:03:48', '2026-04-08 16:03:48'),
(48, 14.77261447, 121.07887627, '2026-04-08 16:03:53', '2026-04-08 16:03:53'),
(49, 14.77261447, 121.07887627, '2026-04-08 16:03:58', '2026-04-08 16:03:58'),
(50, 14.77261447, 121.07887627, '2026-04-08 16:04:03', '2026-04-08 16:04:03'),
(51, 14.77261447, 121.07887627, '2026-04-08 16:04:08', '2026-04-08 16:04:08'),
(52, 14.77261447, 121.07887627, '2026-04-08 16:04:13', '2026-04-08 16:04:13'),
(53, 14.77261447, 121.07887627, '2026-04-08 16:04:18', '2026-04-08 16:04:18'),
(54, 14.77261447, 121.07887627, '2026-04-08 16:04:23', '2026-04-08 16:04:23'),
(55, 14.77261447, 121.07887627, '2026-04-08 16:04:28', '2026-04-08 16:04:28'),
(56, 14.77261364, 121.07893711, '2026-04-08 16:04:34', '2026-04-08 16:04:34'),
(57, 14.77261364, 121.07893711, '2026-04-08 16:04:39', '2026-04-08 16:04:39'),
(58, 14.77261364, 121.07893711, '2026-04-08 16:04:48', '2026-04-08 16:04:48'),
(59, 14.77261364, 121.07893711, '2026-04-08 16:04:52', '2026-04-08 16:04:52'),
(60, 14.77261364, 121.07893711, '2026-04-08 16:04:57', '2026-04-08 16:04:57'),
(61, 14.77261364, 121.07893711, '2026-04-08 16:05:02', '2026-04-08 16:05:02'),
(62, 14.77261364, 121.07893711, '2026-04-08 16:05:07', '2026-04-08 16:05:07'),
(63, 14.77261364, 121.07893711, '2026-04-08 16:05:12', '2026-04-08 16:05:12'),
(64, 14.77261364, 121.07893711, '2026-04-08 16:05:17', '2026-04-08 16:05:17'),
(65, 14.77259882, 121.07891374, '2026-04-08 16:06:55', '2026-04-08 16:06:55'),
(66, 14.77259882, 121.07891374, '2026-04-08 16:06:59', '2026-04-08 16:06:59'),
(67, 14.77259882, 121.07891374, '2026-04-08 16:07:04', '2026-04-08 16:07:04'),
(68, 14.77259882, 121.07891374, '2026-04-08 16:07:09', '2026-04-08 16:07:09'),
(69, 14.77259882, 121.07891374, '2026-04-08 16:08:56', '2026-04-08 16:08:56'),
(70, 14.77259882, 121.07891374, '2026-04-08 16:09:00', '2026-04-08 16:09:00'),
(71, 14.77259882, 121.07891374, '2026-04-08 16:09:05', '2026-04-08 16:09:05'),
(72, 14.77259882, 121.07891374, '2026-04-08 16:09:10', '2026-04-08 16:09:10'),
(73, 14.77259882, 121.07891374, '2026-04-08 16:09:15', '2026-04-08 16:09:15'),
(74, 14.77259882, 121.07891374, '2026-04-08 16:09:20', '2026-04-08 16:09:20'),
(75, 14.77259882, 121.07891374, '2026-04-08 16:09:25', '2026-04-08 16:09:25'),
(76, 14.77259882, 121.07891374, '2026-04-08 16:09:30', '2026-04-08 16:09:30'),
(77, 14.77259882, 121.07891374, '2026-04-08 16:09:35', '2026-04-08 16:09:35'),
(78, 14.77259882, 121.07891374, '2026-04-08 16:09:40', '2026-04-08 16:09:40'),
(79, 14.77259882, 121.07891374, '2026-04-08 16:09:45', '2026-04-08 16:09:45'),
(80, 14.77259882, 121.07891374, '2026-04-08 16:09:51', '2026-04-08 16:09:51');

-- --------------------------------------------------------

--
-- Table structure for table `location_histories`
--

CREATE TABLE `location_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `device_id` varchar(255) NOT NULL DEFAULT 'almka-blind-001',
  `device_session_id` bigint(20) UNSIGNED DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `altitude` decimal(8,2) DEFAULT NULL,
  `satellites` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `location_histories`
--

INSERT INTO `location_histories` (`id`, `device_id`, `device_session_id`, `latitude`, `longitude`, `altitude`, `satellites`, `address`, `recorded_at`, `created_at`, `updated_at`) VALUES
(1, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(2, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(3, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(4, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(5, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(6, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(7, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(8, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(9, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(10, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(11, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(12, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(13, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(14, 'almka-blind-001', NULL, 14.77258677, 121.07891164, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(15, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(16, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(17, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(18, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(19, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(20, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(21, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(22, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(23, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(24, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(25, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(26, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(27, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(28, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(29, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(30, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(31, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(32, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(33, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(34, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(35, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(36, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(37, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(38, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(39, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(40, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(41, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(42, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(43, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57'),
(44, 'almka-blind-001', NULL, 14.77254992, 121.07886155, NULL, NULL, 'Address lookup failed', '2026-04-10 10:24:57', '2026-04-10 10:24:57', '2026-04-10 10:24:57');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_07_224808_create_locations_table', 1),
(5, '2026_04_08_043611_create_device_sessions_table', 2),
(6, '2026_04_08_043613_create_sensor_readings_table', 2),
(7, '2026_04_10_000000_create_location_histories_table', 3),
(8, '2026_04_10_010000_create_video_recordings_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sensor_readings`
--

CREATE TABLE `sensor_readings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `device_id` varchar(255) NOT NULL DEFAULT 'almka-blind-001',
  `device_session_id` bigint(20) UNSIGNED NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `altitude` decimal(8,2) DEFAULT NULL,
  `satellites` int(11) DEFAULT NULL,
  `distance_left` int(11) DEFAULT NULL,
  `distance_front` int(11) DEFAULT NULL,
  `distance_right` int(11) DEFAULT NULL,
  `vibration_left` int(11) NOT NULL DEFAULT 0,
  `vibration_front` int(11) NOT NULL DEFAULT 0,
  `vibration_right` int(11) NOT NULL DEFAULT 0,
  `battery_level` int(11) DEFAULT NULL,
  `temperature` decimal(4,2) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sensor_readings`
--

INSERT INTO `sensor_readings` (`id`, `device_id`, `device_session_id`, `latitude`, `longitude`, `altitude`, `satellites`, `distance_left`, `distance_front`, `distance_right`, `vibration_left`, `vibration_front`, `vibration_right`, `battery_level`, `temperature`, `recorded_at`, `created_at`, `updated_at`) VALUES
(1, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:57:27', '2026-04-08 16:57:27'),
(2, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:57:40', '2026-04-08 16:57:40'),
(3, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:57:50', '2026-04-08 16:57:50'),
(4, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:58:01', '2026-04-08 16:58:01'),
(5, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:58:16', '2026-04-08 16:58:16'),
(6, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:58:27', '2026-04-08 16:58:27'),
(7, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:58:39', '2026-04-08 16:58:39'),
(8, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:58:50', '2026-04-08 16:58:50'),
(9, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:59:01', '2026-04-08 16:59:01'),
(10, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:59:11', '2026-04-08 16:59:11'),
(11, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:59:25', '2026-04-08 16:59:25'),
(12, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:59:36', '2026-04-08 16:59:36'),
(13, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:59:46', '2026-04-08 16:59:46'),
(14, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 16:59:57', '2026-04-08 16:59:57'),
(15, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:00:08', '2026-04-08 17:00:08'),
(16, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:00:21', '2026-04-08 17:00:21'),
(17, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:00:32', '2026-04-08 17:00:32'),
(18, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:00:45', '2026-04-08 17:00:45'),
(19, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:00:56', '2026-04-08 17:00:56'),
(20, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:01:07', '2026-04-08 17:01:07'),
(21, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:01:18', '2026-04-08 17:01:18'),
(22, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:01:29', '2026-04-08 17:01:29'),
(23, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:01:40', '2026-04-08 17:01:40'),
(24, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:01:51', '2026-04-08 17:01:51'),
(25, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:02:02', '2026-04-08 17:02:02'),
(26, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:02:13', '2026-04-08 17:02:13'),
(27, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:02:24', '2026-04-08 17:02:24'),
(28, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:02:35', '2026-04-08 17:02:35'),
(29, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:02:47', '2026-04-08 17:02:47'),
(30, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:03:08', '2026-04-08 17:03:08'),
(31, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:03:17', '2026-04-08 17:03:17'),
(32, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:03:28', '2026-04-08 17:03:28'),
(33, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:03:43', '2026-04-08 17:03:43'),
(34, 'almka-blind-001', 23, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:03:54', '2026-04-08 17:03:54'),
(35, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:04:23', '2026-04-08 17:04:23'),
(36, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:04:34', '2026-04-08 17:04:34'),
(37, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:04:45', '2026-04-08 17:04:45'),
(38, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:04:55', '2026-04-08 17:04:55'),
(39, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:05:06', '2026-04-08 17:05:06'),
(40, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 110, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:05:17', '2026-04-08 17:05:17'),
(41, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:05:28', '2026-04-08 17:05:28'),
(42, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:05:39', '2026-04-08 17:05:39'),
(43, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:05:49', '2026-04-08 17:05:49'),
(44, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:06:01', '2026-04-08 17:06:01'),
(45, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:06:12', '2026-04-08 17:06:12'),
(46, 'almka-blind-001', 24, NULL, NULL, NULL, NULL, 102, 109, 102, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:06:23', '2026-04-08 17:06:23'),
(47, 'almka-blind-001', 25, NULL, NULL, NULL, NULL, 114, 108, 101, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:13:22', '2026-04-08 17:13:22'),
(48, 'almka-blind-001', 25, NULL, NULL, NULL, NULL, 114, 108, 101, 0, 0, 0, NULL, NULL, '2026-04-10 10:25:23', '2026-04-08 17:13:33', '2026-04-08 17:13:33');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('CVY3IMiTNjLTInCL6Wn0Hh43b1lxFHUN4Snf8mdg', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoidjBONkZpMnRqWnRtM3lvZFlibnh4RHQzMG5PR0ljdUFRSzJYbU5rNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC91c2VyLWhpc3RvcnkiO3M6NToicm91dGUiO3M6MTI6InVzZXItaGlzdG9yeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjM7fQ==', 1775846598),
('Eg7WnashZ88RQNNZd7V8VxsFpDd6yEboNTzrlaXS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZVJxb1lTSm8zOVJEWG9YTFRsYW96cmlxUEh4dVNLT0hpdlROOHNFRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpmUURTdlNlVXNJOU4xcXNBIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775847797),
('gTyeqCEaaZWUxg5z9W7EgNfefm71Z81cfpf24CCW', 4, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiMm5maURaRUYxN2tDZGNFZEFhaEt3WklXcE5YZ1FHcXdsYWY5bVlSWCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6NDtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czozNzoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2xpdmUtbW9uaXRvcmluZyI7czo1OiJyb3V0ZSI7czoxNToibGl2ZS1tb25pdG9yaW5nIjt9fQ==', 1775793536),
('qB3QrSkA3aUIniQgW1lyRTmDvSKLYlr9vTed9EOc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOW0ycEw0SG5HWGIzODdvOWZoY0hmQVFFeVhoa0FyZFBBaXlEaEt0aSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775780152);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Test User', 'test@example.com', '2026-04-07 15:09:21', '$2y$12$xJCsoJaB4XlcITGlH41Mg.ilMkAReZRIb1eP496GhEm5ZwZ8sB7DG', '3WDuUW7IRdzOMtjKcJbj3faPid38aXIMAddt6EOfhseCRDG6ub1JFKzn7BX7', '2026-04-07 15:09:21', '2026-04-07 15:09:21'),
(3, 'Aljon Alonzo', 'aljonrisasalonzo@gmail.com', NULL, '$2y$12$375tFQ5oANsUK5nvjs9Tr.spHCbcqdIDV32Up178RFXtYGPldCztq', '4Z4btj2IxBYtNIiv5yH3wtBkVCk7jOsLR0thAhABEoVdlnO84IhHkR0aKZp2', '2026-04-07 19:57:11', '2026-04-07 19:57:11'),
(4, 'Aljon Alonzo', 'aljonr@gmail.com', NULL, '$2y$12$dzNx2l9YbQECX4fZPlkw8eQ4gAt8rLdt/jgAjlaPpYGWxlxHqnKve', NULL, '2026-04-09 18:29:09', '2026-04-09 18:29:09');

-- --------------------------------------------------------

--
-- Table structure for table `video_recordings`
--

CREATE TABLE `video_recordings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `device_id` varchar(255) NOT NULL DEFAULT 'almka-blind-001',
  `device_session_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'ready',
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `video_recordings`
--

INSERT INTO `video_recordings` (`id`, `device_id`, `device_session_id`, `title`, `file_path`, `video_url`, `duration_seconds`, `status`, `recorded_at`, `created_at`, `updated_at`) VALUES
(1, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:22 AM', 'video-recordings/almka-blind-001_20260409215723.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215723.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(2, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:26 AM', 'video-recordings/almka-blind-001_20260409215726.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215726.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(3, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:28 AM', 'video-recordings/almka-blind-001_20260409215728.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215728.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(4, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:30 AM', 'video-recordings/almka-blind-001_20260409215730.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215730.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(5, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:32 AM', 'video-recordings/almka-blind-001_20260409215733.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215733.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(6, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:34 AM', 'video-recordings/almka-blind-001_20260409215735.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215735.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(7, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:47 AM', 'video-recordings/almka-blind-001_20260409215748.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215748.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(8, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:49 AM', 'video-recordings/almka-blind-001_20260409215750.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215750.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(9, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:51 AM', 'video-recordings/almka-blind-001_20260409215752.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215752.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(10, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:53 AM', 'video-recordings/almka-blind-001_20260409215754.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215754.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(11, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:55 AM', 'video-recordings/almka-blind-001_20260409215755.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215755.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(12, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:57 AM', 'video-recordings/almka-blind-001_20260409215758.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215758.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(13, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:57:59 AM', 'video-recordings/almka-blind-001_20260409215800.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215800.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(14, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:01 AM', 'video-recordings/almka-blind-001_20260409215802.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215802.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(15, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:03 AM', 'video-recordings/almka-blind-001_20260409215803.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215803.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(16, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:05 AM', 'video-recordings/almka-blind-001_20260409215807.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215807.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(17, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:09 AM', 'video-recordings/almka-blind-001_20260409215810.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215810.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(18, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:11 AM', 'video-recordings/almka-blind-001_20260409215812.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215812.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(19, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:13 AM', 'video-recordings/almka-blind-001_20260409215815.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215815.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(20, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:17 AM', 'video-recordings/almka-blind-001_20260409215818.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215818.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(21, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:19 AM', 'video-recordings/almka-blind-001_20260409215820.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215820.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(22, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:21 AM', 'video-recordings/almka-blind-001_20260409215822.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215822.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(23, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:23 AM', 'video-recordings/almka-blind-001_20260409215825.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215825.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(24, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:27 AM', 'video-recordings/almka-blind-001_20260409215828.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215828.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(25, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:29 AM', 'video-recordings/almka-blind-001_20260409215831.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215831.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(26, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:31 AM', 'video-recordings/almka-blind-001_20260409215833.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215833.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(27, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:35 AM', 'video-recordings/almka-blind-001_20260409215836.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215836.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(28, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:37 AM', 'video-recordings/almka-blind-001_20260409215838.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215838.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(29, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:39 AM', 'video-recordings/almka-blind-001_20260409215840.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215840.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(30, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:41 AM', 'video-recordings/almka-blind-001_20260409215842.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215842.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(31, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:43 AM', 'video-recordings/almka-blind-001_20260409215844.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215844.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(32, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:45 AM', 'video-recordings/almka-blind-001_20260409215845.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215845.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(33, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:47 AM', 'video-recordings/almka-blind-001_20260409215848.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215848.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(34, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:49 AM', 'video-recordings/almka-blind-001_20260409215850.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215850.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(35, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:51 AM', 'video-recordings/almka-blind-001_20260409215852.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215852.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(36, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:53 AM', 'video-recordings/almka-blind-001_20260409215854.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215854.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(37, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:55 AM', 'video-recordings/almka-blind-001_20260409215856.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215856.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(38, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:57 AM', 'video-recordings/almka-blind-001_20260409215857.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215857.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(39, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:58:59 AM', 'video-recordings/almka-blind-001_20260409215900.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215900.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(40, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:03 AM', 'video-recordings/almka-blind-001_20260409215904.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215904.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(41, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:05 AM', 'video-recordings/almka-blind-001_20260409215906.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215906.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(42, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:07 AM', 'video-recordings/almka-blind-001_20260409215909.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215909.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(43, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:12 AM', 'video-recordings/almka-blind-001_20260409215913.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215913.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(44, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:14 AM', 'video-recordings/almka-blind-001_20260409215914.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215914.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(45, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:16 AM', 'video-recordings/almka-blind-001_20260409215916.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215916.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(46, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:18 AM', 'video-recordings/almka-blind-001_20260409215918.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215918.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(47, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:20 AM', 'video-recordings/almka-blind-001_20260409215920.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215920.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(48, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:22 AM', 'video-recordings/almka-blind-001_20260409215922.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215922.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(49, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:24 AM', 'video-recordings/almka-blind-001_20260409215925.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215925.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(50, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:26 AM', 'video-recordings/almka-blind-001_20260409215926.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215926.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(51, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:28 AM', 'video-recordings/almka-blind-001_20260409215928.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215928.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(52, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:30 AM', 'video-recordings/almka-blind-001_20260409215930.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215930.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(53, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:32 AM', 'video-recordings/almka-blind-001_20260409215933.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215933.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(54, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:34 AM', 'video-recordings/almka-blind-001_20260409215934.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215934.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(55, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:36 AM', 'video-recordings/almka-blind-001_20260409215936.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215936.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(56, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:38 AM', 'video-recordings/almka-blind-001_20260409215938.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215938.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(57, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:40 AM', 'video-recordings/almka-blind-001_20260409215940.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215940.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(58, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:42 AM', 'video-recordings/almka-blind-001_20260409215942.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215942.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(59, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:44 AM', 'video-recordings/almka-blind-001_20260409215944.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215944.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(60, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:46 AM', 'video-recordings/almka-blind-001_20260409215946.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215946.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(61, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:48 AM', 'video-recordings/almka-blind-001_20260409215949.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215949.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(62, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:50 AM', 'video-recordings/almka-blind-001_20260409215951.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215951.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(63, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:52 AM', 'video-recordings/almka-blind-001_20260409215952.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215952.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(64, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:54 AM', 'video-recordings/almka-blind-001_20260409215955.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215955.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(65, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:56 AM', 'video-recordings/almka-blind-001_20260409215957.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215957.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(66, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 5:59:58 AM', 'video-recordings/almka-blind-001_20260409215958.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409215958.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(67, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:00:00 AM', 'video-recordings/almka-blind-001_20260409220000.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409220000.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(68, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:00:02 AM', 'video-recordings/almka-blind-001_20260409220003.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409220003.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(69, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:00:04 AM', 'video-recordings/almka-blind-001_20260409220005.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409220005.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(70, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:00:06 AM', 'video-recordings/almka-blind-001_20260409220008.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409220008.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(71, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:00:10 AM', 'video-recordings/almka-blind-001_20260409220012.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409220012.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(72, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:00:14 AM', 'video-recordings/almka-blind-001_20260409220017.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409220017.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(73, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:00:35 AM', 'video-recordings/almka-blind-001_20260409220035.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409220035.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(74, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:05:57 AM', 'video-recordings/almka-blind-001_20260409220557.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409220557.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(75, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:12:22 AM', 'video-recordings/almka-blind-001_20260409221223.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409221223.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(76, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:12:37 AM', 'video-recordings/almka-blind-001_20260409221237.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409221237.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(77, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:24:03 AM', 'video-recordings/almka-blind-001_20260409222403.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409222403.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(78, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:26:22 AM', 'video-recordings/almka-blind-001_20260409222622.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409222622.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(79, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:34:54 AM', 'video-recordings/almka-blind-001_20260409223455.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409223455.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(80, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:35:09 AM', 'video-recordings/almka-blind-001_20260409223509.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409223509.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(81, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:35:16 AM', 'video-recordings/almka-blind-001_20260409223516.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409223516.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(82, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:37:16 AM', 'video-recordings/almka-blind-001_20260409223716.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409223716.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(83, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:39:06 AM', 'video-recordings/almka-blind-001_20260409223906.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409223906.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(84, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:41:06 AM', 'video-recordings/almka-blind-001_20260409224107.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409224107.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(85, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:41:43 AM', 'video-recordings/almka-blind-001_20260409224143.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409224143.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(86, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:43:43 AM', 'video-recordings/almka-blind-001_20260409224344.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409224344.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(87, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:45:43 AM', 'video-recordings/almka-blind-001_20260409224544.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409224544.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(88, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:47:43 AM', 'video-recordings/almka-blind-001_20260409224744.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409224744.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(89, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:49:43 AM', 'video-recordings/almka-blind-001_20260409224944.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409224944.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(90, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:51:43 AM', 'video-recordings/almka-blind-001_20260409225144.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409225144.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(91, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:53:44 AM', 'video-recordings/almka-blind-001_20260409225347.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409225347.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(92, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:56:19 AM', 'video-recordings/almka-blind-001_20260409225620.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409225620.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(93, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 6:58:19 AM', 'video-recordings/almka-blind-001_20260409225821.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409225821.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(94, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:00:19 AM', 'video-recordings/almka-blind-001_20260409230020.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409230020.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(95, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:02:19 AM', 'video-recordings/almka-blind-001_20260409230220.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409230220.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(96, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:04:19 AM', 'video-recordings/almka-blind-001_20260409230420.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409230420.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(97, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:06:19 AM', 'video-recordings/almka-blind-001_20260409230623.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409230623.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(98, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:08:19 AM', 'video-recordings/almka-blind-001_20260409230822.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409230822.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(99, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:10:20 AM', 'video-recordings/almka-blind-001_20260409231021.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409231021.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(100, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:12:19 AM', 'video-recordings/almka-blind-001_20260409231220.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409231220.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(101, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:14:19 AM', 'video-recordings/almka-blind-001_20260409231420.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409231420.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(102, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:16:59 AM', 'video-recordings/almka-blind-001_20260409231701.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409231701.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(103, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:19:32 AM', 'video-recordings/almka-blind-001_20260409231933.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409231933.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(104, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:21:32 AM', 'video-recordings/almka-blind-001_20260409232133.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409232133.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(105, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:23:36 AM', 'video-recordings/almka-blind-001_20260409232337.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409232337.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(106, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:25:32 AM', 'video-recordings/almka-blind-001_20260409232533.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409232533.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(107, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:27:32 AM', 'video-recordings/almka-blind-001_20260409232733.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409232733.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(108, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:29:32 AM', 'video-recordings/almka-blind-001_20260409232933.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409232933.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(109, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:51:03 AM', 'video-recordings/almka-blind-001_20260409235107.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409235107.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(110, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:52:58 AM', 'video-recordings/almka-blind-001_20260409235258.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409235258.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(111, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:54:58 AM', 'video-recordings/almka-blind-001_20260409235459.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409235459.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(112, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:56:58 AM', 'video-recordings/almka-blind-001_20260409235659.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409235659.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(113, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 7:58:58 AM', 'video-recordings/almka-blind-001_20260409235859.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260409235859.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(114, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:00:36 AM', 'video-recordings/almka-blind-001_20260410000036.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410000036.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(115, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:01:59 AM', 'video-recordings/almka-blind-001_20260410000200.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410000200.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(116, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:03:59 AM', 'video-recordings/almka-blind-001_20260410000400.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410000400.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(117, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:06:08 AM', 'video-recordings/almka-blind-001_20260410000609.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410000609.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(118, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:10:27 AM', 'video-recordings/almka-blind-001_20260410001032.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410001032.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(119, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:11:02 AM', 'video-recordings/almka-blind-001_20260410001103.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410001103.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(120, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:11:38 AM', 'video-recordings/almka-blind-001_20260410001141.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410001141.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(121, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:13:38 AM', 'video-recordings/almka-blind-001_20260410001339.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410001339.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(122, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:13:56 AM', 'video-recordings/almka-blind-001_20260410001358.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410001358.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(123, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:14:08 AM', 'video-recordings/almka-blind-001_20260410001412.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410001412.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(124, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:14:13 AM', 'video-recordings/almka-blind-001_20260410001418.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410001418.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(125, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:16:22 AM', 'video-recordings/almka-blind-001_20260410001623.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410001623.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(126, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:18:23 AM', 'video-recordings/almka-blind-001_20260410001824.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410001824.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(127, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:21:20 AM', 'video-recordings/almka-blind-001_20260410002122.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410002122.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(128, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:23:18 AM', 'video-recordings/almka-blind-001_20260410002319.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410002319.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(129, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:25:18 AM', 'video-recordings/almka-blind-001_20260410002521.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410002521.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(130, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:27:19 AM', 'video-recordings/almka-blind-001_20260410002720.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410002720.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(131, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:29:24 AM', 'video-recordings/almka-blind-001_20260410002926.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410002926.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(132, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 8:31:21 AM', 'video-recordings/almka-blind-001_20260410003122.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410003122.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(133, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:01:24 AM', 'video-recordings/almka-blind-001_20260410010130.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410010130.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(134, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:03:24 AM', 'video-recordings/almka-blind-001_20260410010325.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410010325.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(135, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:05:24 AM', 'video-recordings/almka-blind-001_20260410010524.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410010524.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(136, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:05:32 AM', 'video-recordings/almka-blind-001_20260410010535.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410010535.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(137, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:08:21 AM', 'video-recordings/almka-blind-001_20260410010822.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410010822.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(138, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:08:59 AM', 'video-recordings/almka-blind-001_20260410010924.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410010924.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(139, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:11:01 AM', 'video-recordings/almka-blind-001_20260410011102.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410011102.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(140, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:12:59 AM', 'video-recordings/almka-blind-001_20260410011300.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410011300.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(141, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:14:59 AM', 'video-recordings/almka-blind-001_20260410011500.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410011500.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(142, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:17:01 AM', 'video-recordings/almka-blind-001_20260410011703.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410011703.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(143, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:18:59 AM', 'video-recordings/almka-blind-001_20260410011900.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410011900.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(144, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:21:04 AM', 'video-recordings/almka-blind-001_20260410012105.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410012105.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(145, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:36:25 AM', 'video-recordings/almka-blind-001_20260410013626.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410013626.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(146, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:38:25 AM', 'video-recordings/almka-blind-001_20260410013826.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410013826.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(147, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:39:05 AM', 'video-recordings/almka-blind-001_20260410013907.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410013907.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(148, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:39:57 AM', 'video-recordings/almka-blind-001_20260410013958.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410013958.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(149, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:50:00 AM', 'video-recordings/almka-blind-001_20260410015002.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410015002.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(150, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:53:35 AM', 'video-recordings/almka-blind-001_20260410015335.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410015335.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(151, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:53:42 AM', 'video-recordings/almka-blind-001_20260410015343.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410015343.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(152, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:53:53 AM', 'video-recordings/almka-blind-001_20260410015353.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410015353.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(153, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:54:16 AM', 'video-recordings/almka-blind-001_20260410015416.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410015416.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(154, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:56:10 AM', 'video-recordings/almka-blind-001_20260410015610.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410015610.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(155, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 9:58:10 AM', 'video-recordings/almka-blind-001_20260410015813.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410015813.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(156, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:00:10 AM', 'video-recordings/almka-blind-001_20260410020011.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410020011.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(157, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:00:41 AM', 'video-recordings/almka-blind-001_20260410020042.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410020042.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(158, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:02:41 AM', 'video-recordings/almka-blind-001_20260410020241.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410020241.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(159, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:04:41 AM', 'video-recordings/almka-blind-001_20260410020442.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410020442.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(160, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:06:41 AM', 'video-recordings/almka-blind-001_20260410020642.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410020642.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(161, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:08:42 AM', 'video-recordings/almka-blind-001_20260410020844.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410020844.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(162, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:10:41 AM', 'video-recordings/almka-blind-001_20260410021045.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410021045.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(163, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:12:41 AM', 'video-recordings/almka-blind-001_20260410021242.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410021242.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(164, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:15:19 AM', 'video-recordings/almka-blind-001_20260410021520.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410021520.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(165, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:17:19 AM', 'video-recordings/almka-blind-001_20260410021720.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410021720.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(166, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:23:49 AM', 'video-recordings/almka-blind-001_20260410022350.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410022350.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(167, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:29:39 AM', 'video-recordings/almka-blind-001_20260410022940.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410022940.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(168, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:31:09 AM', 'video-recordings/almka-blind-001_20260410023111.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410023111.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14'),
(169, 'almka-blind-001', NULL, 'Auto recording - 4/10/2026, 10:35:33 AM', 'video-recordings/almka-blind-001_20260410023534.mp4', 'http://localhost:8000/storage/video-recordings/almka-blind-001_20260410023534.mp4', 2, 'ready', '2026-04-10 10:25:14', '2026-04-10 10:25:14', '2026-04-10 10:25:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `device_sessions`
--
ALTER TABLE `device_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `location_histories`
--
ALTER TABLE `location_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_histories_device_session_id_foreign` (`device_session_id`),
  ADD KEY `location_histories_device_id_recorded_at_index` (`device_id`,`recorded_at`),
  ADD KEY `location_histories_recorded_at_index` (`recorded_at`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `sensor_readings`
--
ALTER TABLE `sensor_readings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sensor_readings_device_session_id_foreign` (`device_session_id`),
  ADD KEY `sensor_readings_device_id_recorded_at_index` (`device_id`,`recorded_at`),
  ADD KEY `sensor_readings_recorded_at_index` (`recorded_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `video_recordings`
--
ALTER TABLE `video_recordings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `video_recordings_device_session_id_foreign` (`device_session_id`),
  ADD KEY `video_recordings_device_id_recorded_at_index` (`device_id`,`recorded_at`),
  ADD KEY `video_recordings_recorded_at_index` (`recorded_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `device_sessions`
--
ALTER TABLE `device_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `location_histories`
--
ALTER TABLE `location_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sensor_readings`
--
ALTER TABLE `sensor_readings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `video_recordings`
--
ALTER TABLE `video_recordings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `location_histories`
--
ALTER TABLE `location_histories`
  ADD CONSTRAINT `location_histories_device_session_id_foreign` FOREIGN KEY (`device_session_id`) REFERENCES `device_sessions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sensor_readings`
--
ALTER TABLE `sensor_readings`
  ADD CONSTRAINT `sensor_readings_device_session_id_foreign` FOREIGN KEY (`device_session_id`) REFERENCES `device_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `video_recordings`
--
ALTER TABLE `video_recordings`
  ADD CONSTRAINT `video_recordings_device_session_id_foreign` FOREIGN KEY (`device_session_id`) REFERENCES `device_sessions` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
