USE myapp;

-- Create a table to track history of request status changes
CREATE TABLE IF NOT EXISTS Request_Status_History (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES Request(request_id) ON DELETE CASCADE
);

-- Trigger to log request status changes
DELIMITER //
CREATE TRIGGER after_request_status_change
AFTER UPDATE ON Request
FOR EACH ROW
BEGIN
    -- Only log if the status actually changed
    IF OLD.status != NEW.status THEN
        INSERT INTO Request_Status_History (request_id, old_status, new_status)
        VALUES (NEW.request_id, OLD.status, NEW.status);
    END IF;
END //
DELIMITER ;

-- Create table for tracking feedback statistics
CREATE TABLE IF NOT EXISTS Feedback_Stats (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_type VARCHAR(20) UNIQUE,
    average_rating DECIMAL(3,2),
    feedback_count INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to maintain statistics on feedback
DELIMITER //
CREATE TRIGGER after_feedback_insert
AFTER INSERT ON Feedback
FOR EACH ROW
BEGIN
    DECLARE donor_category VARCHAR(20);
    
    -- Get the donor type
    SELECT donor_type INTO donor_category
    FROM Donor WHERE donor_id = NEW.donor_id;
    
    -- Update statistics
    INSERT INTO Feedback_Stats (donor_type, average_rating, feedback_count, last_updated)
    VALUES (
        donor_category,
        (SELECT AVG(ratings) FROM Feedback WHERE donor_id IN 
            (SELECT donor_id FROM Donor WHERE donor_type = donor_category)),
        (SELECT COUNT(*) FROM Feedback WHERE donor_id IN 
            (SELECT donor_id FROM Donor WHERE donor_type = donor_category)),
        NOW()
    )
    ON DUPLICATE KEY UPDATE
        average_rating = (SELECT AVG(ratings) FROM Feedback WHERE donor_id IN 
                        (SELECT donor_id FROM Donor WHERE donor_type = donor_category)),
        feedback_count = feedback_count + 1,
        last_updated = NOW();
END //
DELIMITER ;