USE myapp;
DELIMITER $$

-- Procedure to get all requests for a specific donor
CREATE PROCEDURE GetDonorRequests(
    IN p_donor_id INT
)
BEGIN
    SELECT 
        request_id,
        waste_type,
        description,
        date_submitted,
        date_resolved,
        status,
        service_area
    FROM 
        Request
    WHERE 
        donor_id = p_donor_id
    ORDER BY 
        date_submitted DESC;
END $$

-- Procedure to create a new donation request
CREATE PROCEDURE CreateDonationRequest(
    IN p_donor_id INT,
    IN p_waste_type VARCHAR(100),
    IN p_description TEXT,
    IN p_service_area VARCHAR(100)
)
BEGIN
    INSERT INTO Request (
        donor_id,
        waste_type,
        description,
        date_submitted,
        status,
        service_area
    ) VALUES (
        p_donor_id,
        p_waste_type,
        p_description,
        CURRENT_DATE(),
        'pending',
        p_service_area
    );
    
    -- Return the ID of the newly created request
    SELECT LAST_INSERT_ID() AS request_id;
END $$

-- Procedure to get a specific request by ID
CREATE PROCEDURE GetRequestById(
    IN p_request_id INT
)
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
    WHERE 
        r.request_id = p_request_id;
END $$

DELIMITER ;