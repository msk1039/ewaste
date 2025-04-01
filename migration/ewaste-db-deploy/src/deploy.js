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

const sqlFiles = [
    '01-setup.sql',
    '02-tables.sql',
    '03-procedures.sql',
    '04-request.sql',
    '05-donor.sql',
    '06-educational-content.sql',
    '07-analysis.sql',
    '08-seed.sql',
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
        const filePath = path.join(__dirname, '../sql', file);
        logInfo(`Reading file ${filePath}`);
        
        const sqlContent = await fs.readFile(filePath, 'utf8');
        
        // Check if this is a file with stored procedures
        if (sqlContent.includes('DELIMITER') || sqlContent.includes('CREATE PROCEDURE')) {
            // Handle stored procedures by parsing them individually
            logInfo(`Handling stored procedures in ${file}`);
            
            // Step 1: Remove comments to simplify parsing
            let cleanedSql = sqlContent.replace(/--.*$/gm, '').trim();
            
            // Step 2: Extract and process each procedure separately
            // First, make sure we're not processing the USE statement as a procedure
            const useMatch = cleanedSql.match(/^USE\s+\w+;/i);
            let useStatement = '';
            if (useMatch) {
                useStatement = useMatch[0];
                cleanedSql = cleanedSql.substring(useMatch[0].length).trim();
            }
            
            // Now process the file without the DELIMITER statements
            // First execute the USE statement if it exists
            if (useStatement) {
                await connection.query(useStatement);
                logInfo(`Executed USE statement from ${file}`);
            }
            
            // Find all procedure definitions
            // We'll search for pattern CREATE PROCEDURE ... END$$
            const procedurePattern = /CREATE\s+PROCEDURE\s+\w+\s*\([^)]*\)\s*BEGIN[\s\S]*?END\s*(\$\$|;)/gi;
            const procedures = [];
            let match;
            
            while ((match = procedurePattern.exec(cleanedSql)) !== null) {
                let procedure = match[0];
                // Remove the DELIMITER markers and standardize to semicolons
                procedure = procedure.replace(/\$\$/g, ';');
                procedures.push(procedure);
            }
            
            // Execute each procedure
            for (const procedure of procedures) {
                try {
                    await connection.query(procedure);
                    logInfo(`Successfully created procedure from ${file}`);
                } catch (error) {
                    logError(`Error creating procedure: ${error.message}`);
                    logError(`Problem SQL: ${procedure}`);
                    throw error;
                }
            }
        } else {
            // For non-procedure files, execute directly
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
            database: process.env.DB_NAME, // Use DB_NAME directly instead of config.db.database
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