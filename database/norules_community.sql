CREATE DATABASE IF NOT EXISTS norules_community;
USE norules_community;

CREATE TABLE IF NOT EXISTS members (
  id char(36) PRIMARY KEY DEFAULT (UUID()),
  nama varchar(150) NOT NULL,
  nickname varchar(150) NOT NULL UNIQUE,
  gender varchar(30),
  tanggal_lahir date,
  domisili varchar(150),
  no_hp varchar(30),
  division varchar(50),
  role varchar(50) DEFAULT 'Member',
  photo_url longtext,
  member_password_hash varchar(255),
  status varchar(30) DEFAULT 'pending',
  join_date date DEFAULT (CURRENT_DATE),
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blacklist (
  id char(36) PRIMARY KEY DEFAULT (UUID()),
  nama varchar(150) NOT NULL,
  nickname varchar(150) NOT NULL,
  status varchar(50) NOT NULL,
  durasi varchar(100) DEFAULT 'PERMANEN',
  alasan text,
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id char(36) PRIMARY KEY DEFAULT (UUID()),
  title varchar(180) NOT NULL,
  description text,
  event_date date NOT NULL,
  banner_url longtext,
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testers (
  id char(36) PRIMARY KEY DEFAULT (UUID()),
  nama varchar(150) NOT NULL,
  whatsapp varchar(30) NOT NULL,
  is_online boolean DEFAULT false,
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id char(36) PRIMARY KEY DEFAULT (UUID()),
  name varchar(150),
  category varchar(50) NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id char(36) PRIMARY KEY DEFAULT (UUID()),
  username varchar(80) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  `key` varchar(120) PRIMARY KEY,
  `value` text NOT NULL
);

INSERT INTO settings (`key`, `value`)
VALUES ('recruitment_status', 'ACTIVE')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

INSERT INTO admins (id, username, password_hash)
VALUES (
  UUID(),
  'admin',
  '$2a$10$qzWVkPlpVxVty1i6a0MacugD2.ug2A1Zd7eujQeOMTiewRTafGYQe'
)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
