CREATE DATABASE IF NOT EXISTS siemens_case;
USE siemens_case;

CREATE TABLE IF NOT EXISTS problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT 'Problem Başlığı',
    description TEXT NULL COMMENT 'D2- Detaylı Açıklama',
    responsible_team VARCHAR(100) NOT NULL COMMENT 'D1 - Sorumlu ekip',
    status VARCHAR(50) DEFAULT 'Open' COMMENT 'Problem Durumu',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Oluşturulma Tarihi',
    resolved_at DATETIME NULL COMMENT 'Çözülme Tarihi'
);


CREATE TABLE IF NOT EXISTS root_causes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    problem_id INT NOT NULL COMMENT 'Bağlı olduğu problem ID',
    parent_id INT NULL DEFAULT NULL COMMENT 'Üst Seviye Root Cause ID',
    content TEXT NOT NULL COMMENT 'Root Cause Açıklaması',
    is_root_cause TINYINT(1) DEFAULT 0 COMMENT 'Root Cause mu?',
    permanent_action TEXT NULL DEFAULT NULL COMMENT 'Kalıcı Çözüm',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Oluşturulma Tarihi',
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES root_causes(id) ON DELETE CASCADE
);

INSERT INTO problems (id, title, description, responsible_team, status, created_at, resolved_at) VALUES 
(1, 'CNC Makinesi Durdu', 'Üretim hattında arıza var.', 'Bakım Ekibi', 'Resolved', '2026-01-09 00:32:47', '2026-01-12 00:24:21');

INSERT INTO root_causes (id, problem_id, parent_id, content, is_root_cause, permanent_action, created_at) VALUES 
(16, 1, NULL, 'ARIZALI', 1, 'değişitirldi', '2026-01-12 00:24:09'); 