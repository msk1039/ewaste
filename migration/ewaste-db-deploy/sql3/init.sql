-- Create database

DROP DATABASE myapp;
CREATE DATABASE IF NOT EXISTS myapp;
USE myapp;

-- Drop existing tables if needed (in reverse order of dependencies)
-- DROP TABLE IF EXISTS Feedback;
-- DROP TABLE IF EXISTS Total_EWaste;
-- DROP TABLE IF EXISTS recycler_assignments;  -- Update to use new table name
-- DROP TABLE IF EXISTS Request;
-- DROP TABLE IF EXISTS Volunteer;
-- DROP TABLE IF EXISTS Educational_Content;
-- DROP TABLE IF EXISTS Recycling_Program;
-- DROP TABLE IF EXISTS Recycler;
-- DROP TABLE IF EXISTS Donor;
-- DROP TABLE IF EXISTS Admin;
-- DROP TABLE IF EXISTS User;

-- User table (general table if needed)
CREATE TABLE IF NOT EXISTS User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    user_type ENUM('donor', 'admin', 'volunteer', 'recycler') NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Donor table
CREATE TABLE IF NOT EXISTS Donor (
    donor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_no VARCHAR(20),
    address VARCHAR(255),
    donor_type ENUM('individual', 'business', 'organization') NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Admin table
CREATE TABLE IF NOT EXISTS Admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Recycler table
CREATE TABLE IF NOT EXISTS Recycler (
    recycler_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone_no VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    service_area VARCHAR(100),
    quantity INT DEFAULT 0,
    password VARCHAR(255) NOT NULL
);

-- Recycling Program table
CREATE TABLE IF NOT EXISTS Recycling_Program (
    program_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT,
    start_date DATE,
    end_date DATE,
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES Admin(admin_id) ON DELETE SET NULL
);

-- Volunteer table
CREATE TABLE IF NOT EXISTS Volunteer (
    volunteer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT,
    address VARCHAR(255),
    occupation VARCHAR(100),
    program_id INT,
    FOREIGN KEY (program_id) REFERENCES Recycling_Program(program_id) ON DELETE SET NULL
);

-- Educational Content table
CREATE TABLE IF NOT EXISTS Educational_Content (
    content_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    upload_date DATE DEFAULT (CURRENT_DATE),
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES Admin(admin_id) ON DELETE SET NULL
);

-- Request table
CREATE TABLE IF NOT EXISTS Request (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT,
    waste_type VARCHAR(100) NOT NULL,
    description TEXT,
    date_submitted DATE DEFAULT (CURRENT_DATE),
    date_resolved DATE,
    status ENUM('pending', 'approved', 'processing', 'completed', 'rejected') DEFAULT 'pending',
    service_area VARCHAR(100),
    FOREIGN KEY (donor_id) REFERENCES Donor(donor_id) ON DELETE CASCADE
);

-- Total E-Waste table
CREATE TABLE IF NOT EXISTS Total_EWaste (
    e_waste_id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(100) NOT NULL,
    `condition` ENUM('new', 'used', 'damaged') NOT NULL,
    recycler_id INT,
    FOREIGN KEY (recycler_id) REFERENCES Recycler(recycler_id) ON DELETE SET NULL
);

-- Feedback table
CREATE TABLE IF NOT EXISTS Feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT,
    ratings INT CHECK (ratings BETWEEN 1 AND 5),
    comments TEXT,
    date DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (donor_id) REFERENCES Donor(donor_id) ON DELETE CASCADE
);


-- Create a table to track history of request status changes
CREATE TABLE IF NOT EXISTS Request_Status_History (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES Request(request_id) ON DELETE CASCADE
);

-- Create table for tracking feedback statistics
CREATE TABLE IF NOT EXISTS Feedback_Stats (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_type VARCHAR(20) UNIQUE,
    average_rating DECIMAL(3,2),
    feedback_count INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store user notifications about new educational content
CREATE TABLE IF NOT EXISTS Content_Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    content_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (content_id) REFERENCES Educational_Content(content_id) ON DELETE CASCADE
);



-- Table for tracking popular educational content
CREATE TABLE IF NOT EXISTS Popular_Content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content_id INT UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    view_count INT DEFAULT 1,
    last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES Educational_Content(content_id) ON DELETE CASCADE
);

-- Table for tracking content views
CREATE TABLE IF NOT EXISTS Content_Views (
    view_id INT PRIMARY KEY AUTO_INCREMENT,
    content_id INT NOT NULL,
    viewer_id INT, -- Can be NULL for anonymous views
    view_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES Educational_Content(content_id) ON DELETE CASCADE
);

-- Create trigger to update request status when assigned to a recycler
-- DELIMITER //
-- CREATE TRIGGER after_recycler_assignment
-- AFTER INSERT ON recycler_assignments
-- FOR EACH ROW
-- BEGIN
--     UPDATE Request
--     SET status = 'processing'
--     WHERE request_id = NEW.request_id;
-- END //
-- DELIMITER ;