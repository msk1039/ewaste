USE myapp;

-- Trigger to automatically update request status when assigned to a recycler
DELIMITER $$
CREATE TRIGGER after_recycler_assignment
AFTER INSERT ON recycler_assignments
FOR EACH ROW
BEGIN
    UPDATE Request
    SET status = 'processing'
    WHERE request_id = NEW.request_id;
END $$
DELIMITER ;

-- Trigger to automatically update recycler's quantity when a new e-waste is assigned
DELIMITER //
CREATE TRIGGER after_ewaste_assigned
AFTER INSERT ON Total_EWaste
FOR EACH ROW
BEGIN
    IF NEW.recycler_id IS NOT NULL THEN
        UPDATE Recycler
        SET quantity = quantity + 1
        WHERE recycler_id = NEW.recycler_id;
    END IF;
END //
DELIMITER ;

-- Trigger to adjust recycler's quantity when e-waste is reassigned or removed
DELIMITER //
CREATE TRIGGER after_ewaste_update
AFTER UPDATE ON Total_EWaste
FOR EACH ROW
BEGIN
    -- If recycler is being changed
    IF OLD.recycler_id != NEW.recycler_id THEN
        -- Decrease count for old recycler if there was one
        IF OLD.recycler_id IS NOT NULL THEN
            UPDATE Recycler
            SET quantity = quantity - 1
            WHERE recycler_id = OLD.recycler_id;
        END IF;
        
        -- Increase count for new recycler if there is one
        IF NEW.recycler_id IS NOT NULL THEN
            UPDATE Recycler
            SET quantity = quantity + 1
            WHERE recycler_id = NEW.recycler_id;
        END IF;
    END IF;
END //
DELIMITER ;

-- Trigger to adjust recycler's quantity when e-waste record is deleted
DELIMITER //
CREATE TRIGGER after_ewaste_delete
AFTER DELETE ON Total_EWaste
FOR EACH ROW
BEGIN
    -- Decrease count for the recycler if there was one
    IF OLD.recycler_id IS NOT NULL THEN
        UPDATE Recycler
        SET quantity = quantity - 1
        WHERE recycler_id = OLD.recycler_id;
    END IF;
END //
DELIMITER ;

-- Trigger to update request status to 'completed' when completed_date is set
DELIMITER //
CREATE TRIGGER after_assignment_completed
AFTER UPDATE ON recycler_assignments
FOR EACH ROW
BEGIN
    -- Check if completed_date was just updated from NULL to a value
    IF OLD.completed_date IS NULL AND NEW.completed_date IS NOT NULL THEN
        UPDATE Request
        SET 
            status = 'completed',
            date_resolved = CURRENT_DATE
        WHERE request_id = NEW.request_id;
    END IF;
END //
DELIMITER ;