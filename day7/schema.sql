CREATE DATABASE IF NOT EXISTS day7_db;
USE day7_db;

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  age        INT,
  UNIQUE KEY uq_email (email)
);