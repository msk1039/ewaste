USE myapp;
DELIMITER $$

-- Procedure to get all educational content
CREATE PROCEDURE GetEducationalContent()
BEGIN
    SELECT 
        content_id,
        title,
        description,
        upload_date,
        admin_id
    FROM 
        Educational_Content
    ORDER BY 
        upload_date DESC;
END $$

-- Procedure to get educational content by ID
CREATE PROCEDURE GetEducationalContentById(
    IN p_content_id INT
)
BEGIN
    SELECT 
        content_id,
        title,
        description,
        upload_date,
        admin_id
    FROM 
        Educational_Content
    WHERE 
        content_id = p_content_id;
END $$

-- Procedure to create new educational content
CREATE PROCEDURE CreateEducationalContent(
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_admin_id INT
)
BEGIN
    INSERT INTO Educational_Content (
        title,
        description,
        upload_date,
        admin_id
    ) VALUES (
        p_title,
        p_description,
        CURRENT_DATE(),
        p_admin_id
    );
    
    -- Return the ID of the newly created content
    SELECT LAST_INSERT_ID() AS content_id;
END $$

DELIMITER ;