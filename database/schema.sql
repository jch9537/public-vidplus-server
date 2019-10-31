DROP DATABASE vidplus;
CREATE DATABASE vidplus;
USE vidplus;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  UNIQUE (email)
);
-- email 중복안됨 하지만 에러리퀘스트도 카운터가 올라가는 단점

CREATE TABLE spaces (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  name VARCHAR(255)
);

CREATE TABLE notes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  space_id INT NOT NULL,
  timestamp TIME,
  content TEXT
);

CREATE TABLE shared (
  user_id INT NOT NULL,
  space_id INT NOT NULL,
  PRIMARY KEY (user_id, space_id)
);