USE myapp;

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS RegisterAdmin(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE admin_exists INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN 
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Check if email already exists in Admin table
    SELECT COUNT(*) INTO admin_exists FROM Admin WHERE email = p_email;
    
    IF admin_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already registered';
    END IF;
    
    -- Insert the new admin
    INSERT INTO Admin (
        name,
        email,
        password
    ) VALUES (
        p_name,
        p_email,
        p_password_hash
    );
    
    -- Return the ID of the new admin
    SELECT LAST_INSERT_ID() AS admin_id;
    COMMIT;
END //

DELIMITER ;
