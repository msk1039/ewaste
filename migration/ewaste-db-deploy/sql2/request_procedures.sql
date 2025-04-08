USE myapp;
DELIMITER $$

-- Procedure to get all donation requests
CREATE PROCEDURE GetAllRequests()
BEGIN
    SELECT 
        r.request_id,
        r.waste_type,
        r.description,
        r.date_submitted,
        r.date_resolved,
        r.status,
        r.service_area,
        d.name AS donor_name,
        d.email AS donor_email,
        d.phone_no AS donor_phone
    FROM 
        Request r
    JOIN 
        Donor d ON r.donor_id = d.donor_id
    ORDER BY 
        r.date_submitted DESC;
END $$

-- Procedure to update request status
CREATE PROCEDURE UpdateRequestStatus(
    IN p_request_id INT,
    IN p_status VARCHAR(20),
    IN p_date_resolved DATE
)
BEGIN
    UPDATE Request
    SET 
        status = p_status,
        date_resolved = CASE 
            WHEN p_status IN ('completed', 'rejected') THEN p_date_resolved
            ELSE date_resolved
        END
    WHERE 
        request_id = p_request_id;
END $$

DELIMITER ;