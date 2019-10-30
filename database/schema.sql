DROP DATABASE vidplus;
CREATE DATABASE vidplus;
USE vidplus;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255),
  name VARCHAR(255)
);

CREATE TABLE spaces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255),
  name VARCHAR(255)
);

CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  space_id INT,
  timestamp TIME,
  content TEXT
);

CREATE TABLE shared (
  user_id INT,
  space_id INT,
  PRIMARY KEY (user_id, space_id)
);