USE myapp;



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