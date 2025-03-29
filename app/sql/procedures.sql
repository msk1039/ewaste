USE myapp;
DELIMITER $$

-- Procedure to register a new user
CREATE PROCEDURE RegisterUser(
    IN p_username VARCHAR(50),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN 
        ROLLBACK;
    END;
    
    START TRANSACTION;
    INSERT INTO users (username, password_hash) VALUES (p_username, p_password_hash);
    COMMIT;
END $$

-- Procedure to login a user
CREATE PROCEDURE LoginUser(
    IN p_username VARCHAR(50)
)
BEGIN
    SELECT id, password_hash FROM users WHERE username = p_username;
END $$



-- Procedure to check if username already exists
CREATE PROCEDURE CheckUsernameExists(
    IN p_username VARCHAR(50),
    OUT p_exists BOOLEAN
)
BEGIN
    DECLARE user_count INT;
    SELECT COUNT(*) INTO user_count FROM users WHERE username = p_username;
    IF user_count > 0 THEN
        SET p_exists = TRUE;
    ELSE
        SET p_exists = FALSE;
    END IF;
END $$

-- Procedure to update user password
CREATE PROCEDURE UpdateUserPassword(
    IN p_username VARCHAR(50),
    IN p_new_password_hash VARCHAR(255)
)
BEGIN
    UPDATE users SET password_hash = p_new_password_hash WHERE username = p_username;
END $$

-- Procedure to get user by ID
CREATE PROCEDURE GetUserById(
    IN p_user_id INT
)
BEGIN
    SELECT id, username, created_at FROM users WHERE id = p_user_id;
END $$

-- Procedure to delete user
CREATE PROCEDURE DeleteUser(
    IN p_user_id INT
)
BEGIN
    DELETE FROM users WHERE id = p_user_id;
END $$


DELIMITER ;