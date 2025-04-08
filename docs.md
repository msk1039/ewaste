# Database Triggers in E-Waste Management System

## Overview

This document explains how database triggers are implemented and utilized in the E-Waste Management System. Triggers are special stored procedures that automatically execute when certain events occur in the database. In our application, triggers play a crucial role in maintaining data integrity, automating workflows, and enabling real-time feature updates.

## Types of Triggers Used

Our system implements several types of triggers:

1. **Validation Triggers**: Execute before INSERT or UPDATE operations to validate data
2. **Notification Triggers**: Generate notifications when specific events occur
3. **Audit Triggers**: Track changes to important data for historical records
4. **Automation Triggers**: Automatically update related records

## Detailed Implementation

### 1. Validation Triggers

Validation triggers ensure data integrity by checking values before they are inserted or updated in the database.

#### Request Validation

```sql
CREATE TRIGGER before_request_insert
BEFORE INSERT ON Request
FOR EACH ROW
BEGIN
    -- Validate service area is not empty
    IF NEW.service_area IS NULL OR NEW.service_area = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Service area cannot be empty';
    END IF;
    
    -- Validate waste type is not empty
    IF NEW.waste_type IS NULL OR NEW.waste_type = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Waste type cannot be empty';
    END IF;
    
    -- Ensure donor exists
    IF NEW.donor_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Donor WHERE donor_id = NEW.donor_id) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid donor ID';
    END IF;
    
    -- Enforce logical date constraints
    IF NEW.date_resolved IS NOT NULL AND NEW.date_resolved < NEW.date_submitted THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Resolution date cannot be earlier than submission date';
    END IF;
END
```

**How it works**: When a donor creates a new request through the frontend (`/app/requests/new`), the validation trigger automatically checks that:
- Service area is specified
- Waste type is provided
- The donor ID exists in the database
- Date constraints are logical

If any validation fails, the database rejects the operation and returns an error that's handled by the API endpoint.

#### Volunteer Age Validation

```sql
CREATE TRIGGER before_volunteer_insert
BEFORE INSERT ON Volunteer
FOR EACH ROW
BEGIN
    -- Validate age is reasonable
    IF NEW.age IS NOT NULL AND (NEW.age < 16 OR NEW.age > 100) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Volunteer age must be between 16 and 100';
    END IF;
END
```

**How it works**: When registering new volunteers, this trigger enforces age restrictions, ensuring only appropriate age ranges are accepted.

### 2. Notification Triggers

Notification triggers automatically create records in notification tables when important events occur.

#### Educational Content Notifications

```sql
CREATE TRIGGER after_educational_content_insert
AFTER INSERT ON Educational_Content
FOR EACH ROW
BEGIN
    INSERT INTO Content_Notifications (content_id, title)
    VALUES (NEW.content_id, NEW.title);
END
```

**How it works**: 
1. When an admin adds new educational content through the admin panel (`/app/admin/educational-content/new`), the trigger automatically creates a notification record.
2. The frontend periodically checks for new notifications via the API endpoint (`/api/educational-content/notifications`).
3. The `ContentNotifications` component displays these notifications to users.
4. When notifications are sent to users, they are marked as "sent" through the API endpoint (`/api/educational-content/notifications/[id]/mark-sent`).

### 3. Audit Triggers

Audit triggers maintain historical records of important changes.

#### Request Status History

```sql
CREATE TRIGGER after_request_status_change
AFTER UPDATE ON Request
FOR EACH ROW
BEGIN
    -- Only log if the status actually changed
    IF OLD.status != NEW.status THEN
        INSERT INTO Request_Status_History (request_id, old_status, new_status)
        VALUES (NEW.request_id, OLD.status, NEW.status);
    END IF;
END
```

**How it works**:
1. Whenever a request status changes (e.g., from "pending" to "approved" or "processing" to "completed"), this trigger logs the change.
2. The frontend can display this history in the request detail view using the `RequestStatusHistory` component.
3. This provides transparency and accountability by maintaining an audit trail of all status changes.

<!-- #### Feedback Statistics

```sql
CREATE TRIGGER after_feedback_insert
AFTER INSERT ON Feedback
FOR EACH ROW
BEGIN
    DECLARE donor_category VARCHAR(20);
    
    -- Get the donor type
    SELECT donor_type INTO donor_category
    FROM Donor WHERE donor_id = NEW.donor_id;
    
    -- Update statistics
    INSERT INTO Feedback_Stats (donor_type, average_rating, feedback_count, last_updated)
    VALUES (
        donor_category,
        (SELECT AVG(ratings) FROM Feedback WHERE donor_id IN 
            (SELECT donor_id FROM Donor WHERE donor_type = donor_category)),
        (SELECT COUNT(*) FROM Feedback WHERE donor_id IN 
            (SELECT donor_id FROM Donor WHERE donor_type = donor_category)),
        NOW()
    )
    ON DUPLICATE KEY UPDATE
        average_rating = (SELECT AVG(ratings) FROM Feedback WHERE donor_id IN 
                        (SELECT donor_id FROM Donor WHERE donor_type = donor_category)),
        feedback_count = feedback_count + 1,
        last_updated = NOW();
END
```

**How it works**:
1. When donors submit feedback, this trigger automatically aggregates statistics by donor type.
2. The admin analytics dashboard can display these statistics without having to recalculate them each time. -->

### 4. Automation Triggers

Automation triggers streamline workflows by automatically updating related data.

#### E-Waste Quantity Management

```sql
CREATE TRIGGER after_ewaste_assigned
AFTER INSERT ON Total_EWaste
FOR EACH ROW
BEGIN
    IF NEW.recycler_id IS NOT NULL THEN
        UPDATE Recycler
        SET quantity = quantity + 1
        WHERE recycler_id = NEW.recycler_id;
    END IF;
END
```

**How it works**:
1. When new e-waste is added to the system and assigned to a recycler, this trigger automatically increments the recycler's quantity count.
2. Similar triggers handle updates (`after_ewaste_update`) and deletions (`after_ewaste_delete`) to keep the recycler quantities accurate.
3. This provides real-time inventory tracking without requiring explicit update code in the application.

#### Request Status Automation

```sql
CREATE TRIGGER after_recycler_assignment
AFTER INSERT ON recycler_assignments
FOR EACH ROW
BEGIN
    UPDATE Request
    SET status = 'processing'
    WHERE request_id = NEW.request_id;
END
```

**How it works**:
1. When an admin assigns a request to a recycler through the admin dashboard, this trigger automatically updates the request status to "processing".
2. This ensures consistency between the assignment and status without requiring multiple database operations from the application code.

```sql
CREATE TRIGGER after_assignment_completed
AFTER UPDATE ON recycler_assignments
FOR EACH ROW
BEGIN
    -- Check if completed_date was just updated from NULL to a value
    IF OLD.completed_date IS NULL AND NEW.completed_date IS NOT NULL THEN
        UPDATE Request
        SET 
            status = 'completed',
            date_resolved = CURRENT_DATE
        WHERE request_id = NEW.request_id;
    END IF;
END
```

**How it works**:
1. When a recycler marks an assignment as completed, this trigger updates the corresponding request status.
2. The `CompleteRecyclerAssignment` stored procedure is called from the recycler dashboard to mark assignments as complete.
3. The request status and resolution date are automatically updated by the trigger.

### 5. View Count Tracking

Our system uses triggers to track and update content view statistics.

```sql
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
END
```

**How it works**:
1. When a user views educational content, the API endpoint (`/api/educational-content/[id]/views`) inserts a record into the `Content_Views` table.
2. This trigger then updates or creates an entry in the `Popular_Content` table.
3. The admin analytics dashboard can display popular content without having to recalculate view counts each time.

## Frontend Integration

### Educational Content Views Example

The educational content view counting demonstrates a complete trigger workflow:

1. **Frontend Request**: When a user visits an educational content page (`/app/educational-content/[id]`), the page component fetches content details:

```typescript
// From /app/educational-content/[id]/page.tsx
useEffect(() => {
  async function fetchContentDetail() {
    const id = await params.id;
    try {
      // The view is automatically recorded by the API when fetching content
      const response = await fetch(`/api/educational-content/${id}`);
      // ...
    }
  }
  fetchContentDetail();
}, [params.id]);
```

2. **API Endpoint**: The API endpoint fetches the content and records the view:

```typescript
// This would be in the /api/educational-content/[id]/route.ts
// When fetching content, the API also records a view
await pool.execute("INSERT INTO Content_Views (content_id) VALUES (?)", [contentId]);
```

3. **Trigger Activation**: This insert operation activates the `after_content_view` trigger.

4. **Data Update**: The trigger automatically updates the `Popular_Content` table.

5. **Analytics Access**: The admin dashboard can then display popular content stats based on the automatically maintained data.

## Conclusion

Database triggers provide several benefits in our E-Waste Management System:

1. **Data Integrity**: Validation triggers ensure that only valid data enters our system.
2. **Automation**: Workflow triggers reduce the need for complex application logic to maintain related data.
3. **Audit Trails**: History triggers maintain important change records for accountability.
4. **Real-time Features**: Notification triggers enable timely updates to users without polling.

By implementing business logic at the database level, we ensure consistency regardless of which part of the application is accessing the data, while reducing the amount of code needed in the application layer.