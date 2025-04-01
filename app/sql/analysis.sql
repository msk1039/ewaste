USE myapp;
DELIMITER $$

-- Procedure to get donation requests by status
CREATE PROCEDURE GetRequestsByStatus(
    IN p_time_range VARCHAR(20)
)
BEGIN
    DECLARE start_date DATE;
    
    -- Set the start date based on the specified time range
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

-- Procedure to get donation requests by waste type
CREATE PROCEDURE GetRequestsByWasteType(
    IN p_time_range VARCHAR(20)
)
BEGIN
    DECLARE start_date DATE;
    
    -- Set the start date based on the specified time range
    CASE p_time_range
        WHEN '7days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY);
        WHEN '30days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY);
        WHEN '90days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY);
        WHEN 'year' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR);
        ELSE SET start_date = '2000-01-01'; -- A date far in the past for 'all'
    END CASE;
    
    SELECT 
        waste_type,
        COUNT(*) as count
    FROM 
        Request
    WHERE 
        date_submitted >= start_date
    GROUP BY 
        waste_type
    ORDER BY 
        count DESC;
END $$

-- Procedure to get donation requests by service area
CREATE PROCEDURE GetRequestsByServiceArea(
    IN p_time_range VARCHAR(20)
)
BEGIN
    DECLARE start_date DATE;
    
    -- Set the start date based on the specified time range
    CASE p_time_range
        WHEN '7days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY);
        WHEN '30days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY);
        WHEN '90days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY);
        WHEN 'year' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR);
        ELSE SET start_date = '2000-01-01'; -- A date far in the past for 'all'
    END CASE;
    
    SELECT 
        service_area,
        COUNT(*) as count
    FROM 
        Request
    WHERE 
        date_submitted >= start_date
    GROUP BY 
        service_area
    ORDER BY 
        count DESC;
END $$

-- Procedure to get donation trends (requests by month)
CREATE PROCEDURE GetDonationTrends(
    IN p_time_range VARCHAR(20)
)
BEGIN
    DECLARE start_date DATE;
    
    -- Set the start date based on the specified time range
    CASE p_time_range
        WHEN '7days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY);
        WHEN '30days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY);
        WHEN '90days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY);
        WHEN 'year' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR);
        ELSE SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 2 YEAR); -- Past 2 years for 'all'
    END CASE;
    
    SELECT 
        DATE_FORMAT(date_submitted, '%Y-%m') as month,
        COUNT(*) as count
    FROM 
        Request
    WHERE 
        date_submitted >= start_date
    GROUP BY 
        DATE_FORMAT(date_submitted, '%Y-%m')
    ORDER BY 
        month;
END $$

-- Procedure to get recycling program statistics
CREATE PROCEDURE GetProgramStatistics()
BEGIN
    SELECT 
        rp.name,
        rp.start_date,
        rp.end_date,
        COUNT(v.volunteer_id) as volunteer_count
    FROM 
        Recycling_Program rp
    LEFT JOIN 
        Volunteer v ON rp.program_id = v.program_id
    GROUP BY 
        rp.program_id, rp.name, rp.start_date, rp.end_date
    ORDER BY 
        rp.start_date DESC;
END $$

-- Procedure to get e-waste distribution by condition
CREATE PROCEDURE GetEWasteByCondition()
BEGIN
    SELECT 
        `condition`,
        COUNT(*) as count
    FROM 
        Total_EWaste
    GROUP BY 
        `condition`
    ORDER BY 
        count DESC;
END $$

-- Procedure to get e-waste distribution by type
CREATE PROCEDURE GetEWasteByType()
BEGIN
    SELECT 
        type,
        COUNT(*) as count
    FROM 
        Total_EWaste
    GROUP BY 
        type
    ORDER BY 
        count DESC
    LIMIT 10;
END $$

-- Procedure to get donor distribution by type
CREATE PROCEDURE GetDonorsByType()
BEGIN
    SELECT 
        donor_type,
        COUNT(*) as count
    FROM 
        Donor
    GROUP BY 
        donor_type
    ORDER BY 
        count DESC;
END $$

-- Procedure to get average ratings from feedback
CREATE PROCEDURE GetAverageFeedbackRatings(
    IN p_time_range VARCHAR(20)
)
BEGIN
    DECLARE start_date DATE;
    
    -- Set the start date based on the specified time range
    CASE p_time_range
        WHEN '7days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY);
        WHEN '30days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY);
        WHEN '90days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY);
        WHEN 'year' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR);
        ELSE SET start_date = '2000-01-01'; -- A date far in the past for 'all'
    END CASE;
    
    SELECT 
        AVG(ratings) as average_rating,
        COUNT(*) as feedback_count
    FROM 
        Feedback
    WHERE 
        date >= start_date;
END $$

-- Procedure to get donation processing efficiency
CREATE PROCEDURE GetProcessingEfficiency(
    IN p_time_range VARCHAR(20)
)
BEGIN
    DECLARE start_date DATE;
    
    -- Set the start date based on the specified time range
    CASE p_time_range
        WHEN '7days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY);
        WHEN '30days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY);
        WHEN '90days' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY);
        WHEN 'year' THEN SET start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR);
        ELSE SET start_date = '2000-01-01'; -- A date far in the past for 'all'
    END CASE;
    
    SELECT 
        AVG(DATEDIFF(date_resolved, date_submitted)) as avg_processing_days
    FROM 
        Request
    WHERE 
        date_submitted >= start_date
        AND date_resolved IS NOT NULL
        AND status = 'completed';
END $$

DELIMITER ;