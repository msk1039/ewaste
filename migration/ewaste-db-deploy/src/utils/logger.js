const fs = require('fs');
const path = require('path');

function logInfo(message) {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
}

function logError(message) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
}

function logToFile(message, logFilePath) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage, { encoding: 'utf8' });
}

module.exports = {
    logInfo,
    logError,
    logToFile
};