const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const { logInfo, logError } = require('./utils/logger');

// Get database config from environment variables
const config = {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT, 10),
        // Modify the SSL options to handle self-signed certs
        ssl: {
            rejectUnauthorized: false
        }
    }
};

// Log connection info (remove passwords in production)
logInfo(`Connecting to database at ${config.db.host}:${config.db.port} as ${config.db.user}`);

// Updated SQL files array with proper ordering
const sqlFiles = [
    // Database initialization first
    'init.sql',
    
    // Core procedures 
    'auth_procedures.sql',
    'donor_procedures.sql',
    'request_procedures.sql',
    'recycler_procedures.sql',
    'educational_procedures.sql',
    
    // Extended functionality
    'educational_views_procedures.sql',
    'analytics_procedures.sql',
    
    // Triggers (after tables and procedures are set up)
    'validation_triggers.sql',
    'triggers.sql',
    'notification_triggers.sql',
    'audit_triggers.sql',
];

// Function to extract procedure definitions from SQL file
const extractProcedures = (sqlContent) => {
    const procedures = [];
    let currentProcedure = '';
    let insideProcedure = false;
    
    // Split by lines to process
    const lines = sqlContent.split('\n');
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip comments and empty lines
        if (trimmedLine.startsWith('--') || trimmedLine === '') {
            continue;
        }
        
        // Detect procedure start
        if (trimmedLine.match(/CREATE\s+PROCEDURE/i)) {
            insideProcedure = true;
            currentProcedure = trimmedLine;
            continue;
        }
        
        // Add line to current procedure
        if (insideProcedure) {
            currentProcedure += ' ' + trimmedLine;
            
            // Detect end of procedure
            if (trimmedLine.match(/END;?$/)) {
                procedures.push(currentProcedure);
                currentProcedure = '';
                insideProcedure = false;
            }
        }
    }
    
    return procedures;
};

const runSqlFile = async (connection, file) => {
    try {
        // Updated to use sql2 directory
        const filePath = path.join(__dirname, '../sql3', file);
        logInfo(`Reading file ${filePath}`);
        
        const sqlContent = await fs.readFile(filePath, 'utf8');
        
        // Check if this is a file with stored procedures, triggers, or other delimiter-based SQL
        if (sqlContent.includes('DELIMITER') || 
            sqlContent.includes('CREATE PROCEDURE') || 
            sqlContent.includes('CREATE TRIGGER')) {
            
            logInfo(`Handling special SQL definitions in ${file}`);
            
            // Extract the USE statement first
            const useMatch = sqlContent.match(/^USE\s+\w+;/im);
            let useStatement = '';
            if (useMatch) {
                useStatement = useMatch[0];
                await connection.query(useStatement);
                logInfo(`Executed USE statement from ${file}`);
            }
            
            // Split the file by DELIMITER statements
            const parts = sqlContent.split(/DELIMITER\s+[^\s]+/i);
            
            // The first part might contain setup SQL like USE statements
            // Execute each SQL statement in the first part separately
            if (parts[0] && parts[0].trim()) {
                const initialStatements = parts[0].split(';')
                    .filter(stmt => stmt.trim())
                    .map(stmt => stmt.trim() + ';');
                
                for (const stmt of initialStatements) {
                    if (stmt.trim() !== ';') {
                        try {
                            await connection.query(stmt);
                            logInfo(`Executed initialization statement from ${file}`);
                        } catch (error) {
                            logError(`Error executing initialization statement: ${error.message}`);
                            logError(`Problem SQL: ${stmt}`);
                            // Continue execution instead of failing completely
                        }
                    }
                }
            }
            
            // Now handle all the procedure and trigger definitions
            // Each definition is in a section between DELIMITER statements
            for (let i = 1; i < parts.length; i++) {
                const delimiterSection = parts[i].trim();
                
                // Skip empty sections
                if (!delimiterSection) continue;
                
                // Find all CREATE PROCEDURE or CREATE TRIGGER statements in this section
                const createStatements = delimiterSection.split(/(?=CREATE\s+(?:PROCEDURE|TRIGGER))/i);
                
                for (const statement of createStatements) {
                    // Skip empty statements
                    if (!statement.trim()) continue;
                    
                    // Extract just one complete procedure/trigger definition
                    // This will include everything from CREATE to END
                    const match = statement.match(/^(CREATE\s+(?:PROCEDURE|TRIGGER)[^;]+END)\s*[\$;]/is);
                    
                    if (match) {
                        const definition = match[1] + ';';  // Add standard semicolon terminator
                        
                        try {
                            await connection.query(definition);
                            logInfo(`Successfully created procedure/trigger from ${file}`);
                        } catch (error) {
                            logError(`Error creating procedure/trigger: ${error.message}`);
                            logError(`Problem SQL: ${definition}`);
                            throw error;
                        }
                    }
                }
            }
            
            logInfo(`Completed processing ${file}`);
        } else {
            // For non-procedure/trigger files, execute directly
            await connection.query(sqlContent);
            logInfo(`Successfully executed ${file}`);
        }
    } catch (error) {
        logError(`Error processing file ${file}: ${error.message}`);
        throw error;
    }
};

const deployDatabase = async () => {
    let connection;
    
    try {
        // Log that we're attempting connection
        logInfo('Attempting to connect to database...');
        
        // Use the correct database name from environment variables
        connection = await mysql.createConnection({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            // Don't specify a database initially - we'll create it in init.sql
            // database: process.env.DB_NAME,
            port: config.db.port,
            ssl: config.db.ssl,
            multipleStatements: true
        });
        
        logInfo('Connected to the database successfully.');

        for (const file of sqlFiles) {
            await runSqlFile(connection, file);
        }

        logInfo('All SQL files executed successfully.');
    } catch (error) {
        logError(`Deployment failed: ${error.message}`);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            logInfo('Database connection closed.');
        }
    }
};

deployDatabase();