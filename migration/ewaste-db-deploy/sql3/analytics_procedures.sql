USE myapp;
DELIMITER $$

-- Procedure to get donation requests by status
CREATE PROCEDURE GetRequestsByStatus(
    IN p_time_range VARCHAR(20)
)
BEGIN
    DECLARE start_date DATE;
    
    CASE p_time_range
        WHEN '7days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY);
        WHEN '30days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY);
        WHEN '90days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY);
        WHEN 'year' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR);
        ELSE SET start_date = '2000-01-01'; -- A date far in the past for 'all'
    END CASE;
    
    SELECT 
        status,
        COUNT(*) as count
    FROM 
        Request
    WHERE 
        date_submitted >= start_date
    GROUP BY 
        status
    ORDER BY 
        count DESC;
END $$

-- More analytics procedures here (removed for brevity)

DELIMITER ;