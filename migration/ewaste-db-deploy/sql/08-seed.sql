USE myapp;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Feedback;
TRUNCATE TABLE Total_EWaste;
TRUNCATE TABLE Request;
TRUNCATE TABLE Volunteer;
TRUNCATE TABLE Educational_Content;
TRUNCATE TABLE Recycling_Program;
TRUNCATE TABLE Recycler;
TRUNCATE TABLE Donor;
TRUNCATE TABLE Admin;
TRUNCATE TABLE User;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Admin data
INSERT INTO Admin (name, email, password) VALUES 
('John Admin', 'john.admin@ewaste.com', '$2a$10$XgF4UM8OPGlIUTwY0JQ6d.NPnVj4JqR1rU.bT4KsdEwKY/ZLVqqLa'),  -- password: admin123
('Sarah Manager', 'sarah.manager@ewaste.com', '$2a$10$Cjd7TKwQkGTQANtHxfeKBOgqcJ1gYLoPRKvzgCjTLjNW5.8v0vT2y'),  -- password: manager456
('Alex Supervisor', 'alex.supervisor@ewaste.com', '$2a$10$pH3zTYKZ.4aqV8ut1Nd11.jKjlSvHu2xSQYgT9KgiuOCGcO6QzJPK');  -- password: super789

-- Insert Donor data
INSERT INTO Donor (name, email, phone_no, address, donor_type, password) VALUES 
('Michael Brown', 'michael.brown@example.com', '555-123-4567', '123 Pine St, Portland, OR', 'individual', '$2a$10$tXwEJx9MCw9EaX1QHvm8r.4jlDzgasJPvHkHxyNgFL4vtbv4wSf4a'),  -- password: donor123
('TechCorp Inc', 'donations@techcorp.com', '555-987-6543', '456 Oak Ave, Seattle, WA', 'business', '$2a$10$5ThKhF8OJyq47BQSeVuRN.oZEjSJ6J4/J.xwqgpK.UMfLz7HKv9dK'),  -- password: tech456
('Green University', 'green.uni@edu.org', '555-567-8901', '789 Maple Rd, San Francisco, CA', 'organization', '$2a$10$pWU2VJZ14cFphhPPZCXy4OF9GQRrVqpM3FQwxA.EY2JsTYVJ8g5Oe'),  -- password: green789
('Emily Johnson', 'emily.j@example.com', '555-234-5678', '321 Cedar Ln, Austin, TX', 'individual', '$2a$10$hWz9DCwPnT.coDjx3EhFhepu.V3z9K0zA9WCGQz/5dbX0QvjUY9aC'),  -- password: emily123
('Office Supplies Ltd', 'recycle@officesupplies.com', '555-345-6789', '654 Birch St, Chicago, IL', 'business', '$2a$10$RQmW.u0xhufCvoXFE1NqS.HZkZOcE5TJFYLmGpZ/j8aU5SSgJ/4Ui');  -- password: office456

-- Insert User data (if needed)
INSERT INTO User (name, email, phone, address, user_type, password) VALUES
('Michael Brown', 'michael.brown@example.com', '555-123-4567', '123 Pine St, Portland, OR', 'donor', '$2a$10$tXwEJx9MCw9EaX1QHvm8r.4jlDzgasJPvHkHxyNgFL4vtbv4wSf4a'),
('John Admin', 'john.admin@ewaste.com', '555-111-2222', '100 Admin Blvd, New York, NY', 'admin', '$2a$10$XgF4UM8OPGlIUTwY0JQ6d.NPnVj4JqR1rU.bT4KsdEwKY/ZLVqqLa'),
('Lisa Helper', 'lisa.helper@volunteer.org', '555-333-4444', '200 Helper Ave, Boston, MA', 'volunteer', '$2a$10$7v2wGLq5rVBgd.q9X1p4Y.f1hJfyEDR.93HQa1YDKwvqMn.5VGzlm');  -- password: vol123

-- Insert Recycler data
INSERT INTO Recycler (name, phone_no, email, service_area, quantity) VALUES
('EcoRecycle Solutions', '555-111-2222', 'info@ecorecycle.com', 'Portland', 150),
('GreenTech Recyclers', '555-333-4444', 'contact@greentech.com', 'Seattle', 275),
('Urban E-Cycle', '555-555-6666', 'service@urbancycle.com', 'San Francisco', 320),
('TechSalvage Inc', '555-777-8888', 'info@techsalvage.com', 'Austin', 185),
('CircuitBreakers LLC', '555-999-0000', 'hello@circuitbreakers.com', 'Chicago', 210);

-- Insert Recycling Program data
INSERT INTO Recycling_Program (name, description, requirements, start_date, end_date, admin_id) VALUES
('Community E-Waste Drive', 'Monthly collection event for local residents', 'Residents must bring ID and proof of address', '2025-04-15', '2025-04-20', 1),
('Corporate Recycling Initiative', 'Program for businesses to recycle old equipment', 'Business license required for participation', '2025-05-01', '2025-07-30', 2),
('School Tech Refresh', 'Helping schools recycle outdated computers', 'Valid school ID required', '2025-06-10', '2025-08-25', 3),
('E-Waste Education Series', 'Workshops and collection events', 'Registration required for workshops', '2025-09-05', '2025-12-10', 1),
('Neighborhood Collection Program', 'Weekly pickup service in select neighborhoods', 'Must schedule pickup 48 hours in advance', '2025-05-15', '2025-11-15', 2);

-- Insert Volunteer data
INSERT INTO Volunteer (name, age, address, occupation, program_id) VALUES
('Lisa Helper', 28, '200 Helper Ave, Boston, MA', 'Teacher', 1),
('David Green', 35, '456 Volunteer St, Portland, OR', 'IT Specialist', 2),
('Maria Santos', 22, '789 Giving Ln, Seattle, WA', 'Student', 3),
('James Wilson', 42, '321 Community Rd, San Francisco, CA', 'Engineer', 4),
('Priya Patel', 31, '654 Support Ave, Austin, TX', 'Graphic Designer', 5),
('Robert Kim', 25, '987 Assist St, Chicago, IL', 'Retail Worker', 1),
('Sophia Garcia', 29, '234 Eco Dr, Boston, MA', 'Environmental Scientist', 2);

-- Insert Educational Content data
INSERT INTO Educational_Content (title, description, upload_date, admin_id) VALUES
('E-Waste Basics', 'Learn about what constitutes e-waste and why proper recycling matters', '2025-03-10', 1),
('The Dangers of Improper E-Waste Disposal', 'Understanding environmental and health risks of e-waste', '2025-03-15', 2),
('Reuse Before Recycle', 'Tips for extending the life of your electronics', '2025-03-20', 3),
('E-Waste and Climate Change', 'How proper electronics disposal helps fight climate change', '2025-03-25', 1),
('Recycling Process Explained', 'A step-by-step guide to what happens to your donated electronics', '2025-04-01', 2);

-- Insert Request data
INSERT INTO Request (donor_id, waste_type, description, date_submitted, date_resolved, status, service_area) VALUES
(1, 'Computers', '3 desktop computers and 2 laptops', '2025-03-01', '2025-03-10', 'completed', 'Portland'),
(2, 'Office Equipment', '10 printers and 5 scanners', '2025-03-05', NULL, 'approved', 'Seattle'),
(3, 'Lab Equipment', '20 old tablet computers', '2025-03-08', NULL, 'processing', 'San Francisco'),
(4, 'Personal Electronics', '2 smartphones and 1 tablet', '2025-03-12', NULL, 'pending', 'Austin'),
(5, 'Office Cleanup', '15 monitors, 12 keyboards, 8 CPU towers', '2025-03-15', '2025-03-20', 'rejected', 'Chicago'),
(1, 'Home Electronics', '1 TV, 2 DVD players', '2025-03-18', NULL, 'pending', 'Portland'),
(2, 'Network Equipment', '3 routers, 5 switches, 10 network cables', '2025-03-22', NULL, 'approved', 'Seattle');

-- Insert Total E-Waste data
INSERT INTO Total_EWaste (type, `condition`, recycler_id) VALUES
('Desktop Computer', 'used', 1),
('Laptop', 'damaged', 2),
('Smartphone', 'used', 3),
('Tablet', 'used', 4),
('Printer', 'damaged', 5),
('Monitor', 'used', 1),
('Television', 'damaged', 2),
('Scanner', 'used', 3),
('Router', 'used', 4),
('Hard Drive', 'damaged', 5),
('CPU Tower', 'used', 1),
('Keyboard', 'damaged', 2),
('Mouse', 'used', 3),
('Speaker', 'used', 4),
('Power Supply', 'damaged', 5);

-- Insert Feedback data
INSERT INTO Feedback (donor_id, ratings, comments, date) VALUES
(1, 5, 'Excellent service! Pickup was prompt and staff was friendly.', '2025-03-11'),
(2, 4, 'Good experience overall. Would use the service again.', '2025-03-14'),
(3, 5, 'Very professional handling of our equipment. Thank you!', '2025-03-16'),
(4, 3, 'Service was okay but took longer than expected.', '2025-03-19'),
(5, 2, 'Disappointed that my request was rejected without much explanation.', '2025-03-21'),
(1, 5, 'Second time using the service - consistently excellent!', '2025-03-25');