USE myapp;

-- Procedure to get content with view counts
DELIMITER //
CREATE PROCEDURE GetEducationalContentWithViews()
BEGIN
    SELECT 
        ec.*, 
        COUNT(cv.view_id) as view_count
    FROM 
        Educational_Content ec
    LEFT JOIN 
        Content_Views cv ON ec.content_id = cv.content_id
    GROUP BY 
        ec.content_id
    ORDER BY 
        ec.upload_date DESC;
END //
DELIMITER ;

-- Procedure to get single content with view count
DELIMITER //
CREATE PROCEDURE GetEducationalContentWithViewById(IN content_id_param INT)
BEGIN
    SELECT 
        ec.*, 
        COUNT(cv.view_id) as view_count
    FROM 
        Educational_Content ec
    LEFT JOIN 
        Content_Views cv ON ec.content_id = cv.content_id
    WHERE 
        ec.content_id = content_id_param
    GROUP BY 
        ec.content_id;
END //
DELIMITER ;

-- Procedure to record a content view
DELIMITER //
CREATE PROCEDURE RecordContentView(IN content_id_param INT)
BEGIN
    INSERT INTO Content_Views (content_id) 
    VALUES (content_id_param);
END //
DELIMITER ;