import fs from 'fs';
import path from 'path';
import { pool, executeQuery } from './db';

// Function to read and execute SQL files
async function executeSqlFile(filePath: string): Promise<void> {
  try {
    console.log(`Executing SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split the SQL file by delimiter to handle triggers properly
    const statements = sql.split('DELIMITER //');
    
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i].trim();
      
      if (statement.includes('DELIMITER ;')) {
        // Handle trigger definition with custom delimiter
        const parts = statement.split('DELIMITER ;');
        const triggerBody = parts[0].replace(/END\s*\/\//, 'END');
        
        if (triggerBody.trim()) {
          try {
            await executeQuery(triggerBody);
            console.log('Executed trigger definition');
          } catch (error) {
            // If trigger already exists, that's ok
            if ((error as Error).message.includes('already exists')) {
              console.log('Trigger already exists, skipping');
            } else {
              throw error;
            }
          }
        }
        
        // Handle remaining SQL after the DELIMITER ;
        if (parts[1] && parts[1].trim()) {
          await executeQuery(parts[1].trim());
        }
      } else if (statement) {
        // Regular SQL statements
        await executeQuery(statement);
      }
    }
    
    console.log(`Successfully executed: ${filePath}`);
  } catch (error) {
    console.error(`Error executing SQL file ${filePath}:`, error);
    throw error;
  }
}

// Initialize the database with all trigger files
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('Setting up database tables and triggers...');
    
    const sqlDir = path.join(process.cwd(), 'app', 'sql2');
    
    // Execute files in specific order to handle dependencies
    const fileOrder = [
      'init.sql',           // Table creation first
      'triggers.sql',       // Basic triggers
      'audit_triggers.sql', // Audit triggers that create tables
      'notification_triggers.sql', // Notification system
      'validation_triggers.sql',   // Data validation triggers
    ];
    
    for (const fileName of fileOrder) {
      const filePath = path.join(sqlDir, fileName);
      if (fs.existsSync(filePath)) {
        await executeSqlFile(filePath);
      } else {
        console.warn(`Warning: File not found: ${filePath}`);
      }
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}