USE myapp;

-- Table to store user notifications about new educational content
CREATE TABLE IF NOT EXISTS Content_Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    content_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (content_id) REFERENCES Educational_Content(content_id) ON DELETE CASCADE
);

-- Trigger to create notifications when new educational content is added
DELIMITER //
CREATE TRIGGER after_educational_content_insert
AFTER INSERT ON Educational_Content
FOR EACH ROW
BEGIN
    INSERT INTO Content_Notifications (content_id, title)
    VALUES (NEW.content_id, NEW.title);
END //
DELIMITER ;

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

-- Trigger to update popular content tracking when content is viewed
DELIMITER //
CREATE TRIGGER after_content_view
AFTER INSERT ON Content_Views
FOR EACH ROW
BEGIN
    -- Update the Popular_Content table
    INSERT INTO Popular_Content (content_id, title, view_count, last_viewed)
    SELECT 
        NEW.content_id,
        (SELECT title FROM Educational_Content WHERE content_id = NEW.content_id),
        1,
        NOW()
    ON DUPLICATE KEY UPDATE
        view_count = view_count + 1,
        last_viewed = NOW();
END //
DELIMITER ;