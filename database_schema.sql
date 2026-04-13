-- Database Schema Dump for ALMKA Blind Project (MySQL)
-- Generated on April 8, 2026

-- Migrations table
CREATE TABLE migrations (id int unsigned NOT NULL AUTO_INCREMENT, migration varchar(255) NOT NULL, batch int NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users table (for authentication)
CREATE TABLE users (id bigint unsigned NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, email varchar(255) NOT NULL, email_verified_at timestamp NULL DEFAULT NULL, password varchar(255) NOT NULL, remember_token varchar(100) DEFAULT NULL, created_at timestamp NULL DEFAULT NULL, updated_at timestamp NULL DEFAULT NULL, PRIMARY KEY (id), UNIQUE KEY users_email_unique (email)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password reset tokens
CREATE TABLE password_reset_tokens (email varchar(255) NOT NULL, token varchar(255) NOT NULL, created_at timestamp NULL DEFAULT NULL, PRIMARY KEY (email)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions table
CREATE TABLE sessions (id varchar(255) NOT NULL, user_id bigint unsigned DEFAULT NULL, ip_address varchar(45) DEFAULT NULL, user_agent text, payload longtext NOT NULL, last_activity int NOT NULL, PRIMARY KEY (id), KEY sessions_user_id_index (user_id), KEY sessions_last_activity_index (last_activity)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cache tables
CREATE TABLE cache (key varchar(255) NOT NULL, value mediumtext NOT NULL, expiration int NOT NULL, PRIMARY KEY (key)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE cache_locks (key varchar(255) NOT NULL, owner varchar(255) NOT NULL, expiration int NOT NULL, PRIMARY KEY (key)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs tables (for queues)
CREATE TABLE jobs (id bigint unsigned NOT NULL AUTO_INCREMENT, queue varchar(255) NOT NULL, payload longtext NOT NULL, attempts tinyint unsigned NOT NULL, reserved_at int unsigned DEFAULT NULL, available_at int unsigned NOT NULL, created_at int unsigned NOT NULL, PRIMARY KEY (id), KEY jobs_queue_index (queue)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE job_batches (id varchar(255) NOT NULL, name varchar(255) NOT NULL, total_jobs int NOT NULL, pending_jobs int NOT NULL, failed_jobs int NOT NULL, failed_job_ids longtext NOT NULL, options mediumtext, cancelled_at int DEFAULT NULL, created_at int NOT NULL, finished_at int DEFAULT NULL, PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE failed_jobs (id bigint unsigned NOT NULL AUTO_INCREMENT, uuid varchar(255) NOT NULL, connection text NOT NULL, queue text NOT NULL, payload longtext NOT NULL, exception longtext NOT NULL, failed_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), UNIQUE KEY failed_jobs_uuid_unique (uuid)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Locations table (GPS data storage)
CREATE TABLE locations (id bigint unsigned NOT NULL AUTO_INCREMENT, latitude decimal(10,8) NOT NULL, longitude decimal(11,8) NOT NULL, created_at timestamp NULL DEFAULT NULL, updated_at timestamp NULL DEFAULT NULL, PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- End of schema