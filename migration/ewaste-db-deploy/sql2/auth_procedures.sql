USE myapp;
DELIMITER $$

-- Procedure for donor signup
CREATE PROCEDURE RegisterDonor(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_address VARCHAR(255),
    IN p_donor_type VARCHAR(20),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE donor_exists INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN 
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Check if email already exists in Donor table
    SELECT COUNT(*) INTO donor_exists FROM Donor WHERE email = p_email;
    
    IF donor_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already registered';
    END IF;
    
    -- Insert the new donor
    INSERT INTO Donor (
        name,
        email,
        phone_no,
        address,
        donor_type,
        password
    ) VALUES (
        p_name,
        p_email,
        p_phone,
        p_address,
        p_donor_type,
        p_password_hash
    );
    
    -- Return the ID of the new donor
    SELECT LAST_INSERT_ID() AS donor_id;
    COMMIT;
END $$

-- Procedure for volunteer signup
-- CREATE PROCEDURE RegisterVolunteer(
--     IN p_name VARCHAR(100),
--     IN p_age INT,
--     IN p_address VARCHAR(255),
--     IN p_occupation VARCHAR(100),
--     IN p_password_hash VARCHAR(255)
-- )
-- BEGIN
--     DECLARE volunteer_exists INT;
    
--     DECLARE EXIT HANDLER FOR SQLEXCEPTION 
--     BEGIN 
--         ROLLBACK;
--         RESIGNAL;
--     END;
    
--     START TRANSACTION;
    
--     -- Check if name already exists in Volunteer table (using name as identifier)
--     SELECT COUNT(*) INTO volunteer_exists FROM Volunteer WHERE name = p_name;
    
--     IF volunteer_exists > 0 THEN
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Volunteer name already registered';
--     END IF;
    
--     -- Insert the new volunteer
--     INSERT INTO Volunteer (
--         name,
--         age,
--         address,
--         occupation
--     ) VALUES (
--         p_name,
--         p_age,
--         p_address,
--         p_occupation
--     );
    
--     -- Return the ID of the new volunteer
--     SELECT LAST_INSERT_ID() AS volunteer_id;
--     COMMIT;
-- END $$

-- Procedure for admin signup
CREATE PROCEDURE RegisterAdmin(
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
END $$

-- Procedure for recycler signup
CREATE PROCEDURE RegisterRecycler(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_service_area VARCHAR(100),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE recycler_exists INT DEFAULT 0;
    
    -- Check if email already exists in Recycler table
    SELECT COUNT(*) INTO recycler_exists FROM Recycler WHERE email = p_email;
    
    IF recycler_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already registered';
    ELSE
        -- Insert the new recycler
        INSERT INTO Recycler (
            name,
            email,
            phone_no,
            service_area,
            password
        ) VALUES (
            p_name,
            p_email,
            p_phone,
            p_service_area,
            p_password_hash
        );
        
        -- Return the ID of the new recycler
        SELECT LAST_INSERT_ID() AS recycler_id, 'Recycler registered successfully' AS message;
    END IF;
END $$

-- Procedure for donor login
CREATE PROCEDURE LoginDonor(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT 
        donor_id,
        name,
        email,
        password,
        phone_no,
        address,
        donor_type,
        'donor' as role
    FROM 
        Donor 
    WHERE 
        email = p_email;
END $$

-- Procedure for volunteer login
CREATE PROCEDURE LoginVolunteer(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT 
        volunteer_id,
        name,
        age,
        address,
        occupation,
        program_id,
        'volunteer' as role
    FROM 
        Volunteer
    WHERE 
        name = p_email;  -- Using name field as the identifier for volunteers since there's no email field
END $$

-- Procedure for admin login
CREATE PROCEDURE LoginAdmin(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT 
        admin_id,
        name,
        email,
        password,
        'admin' as role
    FROM 
        Admin
    WHERE 
        email = p_email;
END $$

-- Procedure for recycler login
CREATE PROCEDURE LoginRecycler(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT 
        recycler_id,
        name,
        email,
        password,
        phone_no,
        service_area,
        'recycler' as role
    FROM 
        Recycler 
    WHERE 
        email = p_email;
END $$

-- Generic procedure to validate user credentials across all roles
CREATE PROCEDURE ValidateUserCredentials(
    IN p_email VARCHAR(100),
    IN p_role VARCHAR(20)
)
BEGIN
    CASE p_role
        WHEN 'donor' THEN
            SELECT 
                donor_id AS id,
                name,
                email,
                password,
                'donor' as role
            FROM 
                Donor 
            WHERE 
                email = p_email;
                
        WHEN 'volunteer' THEN
            SELECT 
                volunteer_id AS id,
                name,
                NULL AS email, -- Volunteer table doesn't have email
                NULL AS password, -- Volunteer table doesn't have password
                'volunteer' as role
            FROM 
                Volunteer
            WHERE 
                name = p_email;
                
        WHEN 'admin' THEN
            SELECT 
                admin_id AS id,
                name,
                email,
                password,
                'admin' as role
            FROM 
                Admin
            WHERE 
                email = p_email;
                
        WHEN 'recycler' THEN
            SELECT 
                recycler_id AS id,
                name,
                email,
                password,
                'recycler' as role
            FROM 
                Recycler 
            WHERE 
                email = p_email;
                
        ELSE
            -- Return empty result set for invalid role
            SELECT 
                NULL AS id,
                NULL AS name,
                NULL AS email,
                NULL AS password,
                NULL AS role
            WHERE 
                FALSE;
    END CASE;
END $$

DELIMITER ;