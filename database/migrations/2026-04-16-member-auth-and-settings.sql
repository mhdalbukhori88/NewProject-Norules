ALTER TABLE members
  ADD COLUMN IF NOT EXISTS member_password_hash varchar(255) NULL AFTER photo_url;

ALTER TABLE members
  ADD UNIQUE INDEX IF NOT EXISTS uq_members_nickname (nickname);

CREATE TABLE IF NOT EXISTS settings (
  `key` varchar(120) PRIMARY KEY,
  `value` text NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id char(36) PRIMARY KEY DEFAULT (UUID()),
  username varchar(80) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL
);

INSERT INTO settings (`key`, `value`)
VALUES ('recruitment_status', 'ACTIVE')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
