USE myapp;

-- Trigger to validate request data before insertion
DELIMITER //
CREATE TRIGGER before_request_insert
BEFORE INSERT ON Request
FOR EACH ROW
BEGIN
    -- Validate service area is not empty
    IF NEW.service_area IS NULL OR NEW.service_area = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Service area cannot be empty';
    END IF;
    
    -- Validate waste type is not empty
    IF NEW.waste_type IS NULL OR NEW.waste_type = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Waste type cannot be empty';
    END IF;
    
    -- Ensure donor exists
    IF NEW.donor_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Donor WHERE donor_id = NEW.donor_id) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid donor ID';
    END IF;
    
    -- Enforce logical date constraints
    IF NEW.date_resolved IS NOT NULL AND NEW.date_resolved < NEW.date_submitted THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Resolution date cannot be earlier than submission date';
    END IF;
END //
DELIMITER ;

-- Trigger to validate volunteer age before insertion
DELIMITER //
CREATE TRIGGER before_volunteer_insert
BEFORE INSERT ON Volunteer
FOR EACH ROW
BEGIN
    -- Validate age is reasonable
    IF NEW.age IS NOT NULL AND (NEW.age < 16 OR NEW.age > 100) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Volunteer age must be between 16 and 100';
    END IF;
END //
DELIMITER ;

-- Trigger to ensure recycler quantity is never negative
DELIMITER //
CREATE TRIGGER before_recycler_update
BEFORE UPDATE ON Recycler
FOR EACH ROW
BEGIN
    -- Prevent negative quantities
    IF NEW.quantity < 0 THEN
        SET NEW.quantity = 0;
    END IF;
END //
DELIMITER ;