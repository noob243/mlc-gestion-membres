-- Database Schema for MLC Member Management

CREATE TABLE IF NOT EXISTS members (
    id VARCHAR(50) PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    post_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    sexe VARCHAR(1) NOT NULL,
    birth_date DATE NOT NULL,
    country VARCHAR(100) NOT NULL,
    city_province VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    federation VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_url TEXT -- Using TEXT to store base64 string
);
