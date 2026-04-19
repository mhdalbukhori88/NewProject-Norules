USE norules_community;

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS member_password_hash varchar(255) NULL AFTER photo_url;

ALTER TABLE members
  MODIFY COLUMN nickname varchar(150) NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_members_nickname ON members (nickname);

CREATE TABLE IF NOT EXISTS settings (
  `key` varchar(120) PRIMARY KEY,
  `value` text NOT NULL
);

INSERT INTO settings (`key`, `value`)
VALUES ('recruitment_status', 'ACTIVE')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

CREATE TABLE IF NOT EXISTS admins (
  id char(36) PRIMARY KEY DEFAULT (UUID()),
  username varchar(80) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL
);

INSERT INTO admins (id, username, password_hash)
VALUES (
  UUID(),
  'admin',
  '$2a$10$qzWVkPlpVxVty1i6a0MacugD2.ug2A1Zd7eujQeOMTiewRTafGYQe'
)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
