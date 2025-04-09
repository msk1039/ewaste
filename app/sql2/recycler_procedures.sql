USE myapp;
DELIMITER $$

-- Procedure to get all recyclers (for assignment to requests)
CREATE PROCEDURE GetAllRecyclers()
BEGIN
    SELECT 
        recycler_id,
        name,
        email,
        phone_no,
        service_area
    FROM 
        Recycler
    ORDER BY 
        name;
END $$

-- Procedure to get recycler assignments - the key procedure required by your API
CREATE PROCEDURE GetRecyclerAssignments(
  IN p_recycler_id INT
)
BEGIN
  SELECT 
    ra.assignment_id,
    r.request_id,
    r.waste_type,
    r.description,
    r.date_submitted,
    r.status,
    d.name as donor_name,
    d.phone_no as donor_phone,
    d.address as donor_address,
    r.service_area,
    ra.assigned_date
  FROM 
    recycler_assignments ra
  JOIN 
    Request r ON ra.request_id = r.request_id
  JOIN 
    Donor d ON r.donor_id = d.donor_id
  WHERE 
    ra.recycler_id = p_recycler_id
  ORDER BY 
    ra.assigned_date DESC;
END $$

-- Procedure to get requests assigned to a recycler
CREATE PROCEDURE GetRecyclerRequests(
    IN p_recycler_id INT
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
    JOIN 
        recycler_assignments ra ON r.request_id = ra.request_id
    WHERE 
        ra.recycler_id = p_recycler_id
    ORDER BY 
        r.date_submitted DESC;
END $$

-- Procedure to assign a recycler to a request
CREATE PROCEDURE AssignRecyclerToRequest(
    IN p_request_id INT,
    IN p_recycler_id INT,
    IN p_admin_id INT
)
BEGIN
    -- First update the request status to processing
    UPDATE Request 
    SET 
        status = 'processing'
    WHERE 
        request_id = p_request_id;
    
    -- Insert the assignment
    INSERT INTO recycler_assignments (
        request_id, 
        recycler_id, 
        created_by
    ) VALUES (
        p_request_id,
        p_recycler_id,
        p_admin_id
    );
    
    -- Return success
    SELECT 'Success' AS result;
END $$



-- Procedure to complete a recycler assignment
CREATE PROCEDURE CompleteRecyclerAssignment(
    IN p_assignment_id INT,
    IN p_request_id INT
)
BEGIN
    -- Start transaction to ensure both updates succeed or fail together
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Update the request status to completed
    UPDATE Request
    SET 
        status = 'completed',
        date_resolved = CURRENT_DATE()
    WHERE 
        request_id = p_request_id;
    
    -- Update the assignment record
    UPDATE recycler_assignments
    SET 
        completed_date = CURRENT_TIMESTAMP()
    WHERE 
        assignment_id = p_assignment_id;
        
    COMMIT;
    
    -- Return success message
    SELECT 'Assignment completed successfully' AS message;
END $$

DELIMITER ;