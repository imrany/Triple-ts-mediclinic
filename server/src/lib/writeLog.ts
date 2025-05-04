import fs from 'fs';
import path from 'path';

// Define the log file path
const logFilePath = path.join(__dirname, '../../logs.txt');

// Function to write log messages
function writeLog(message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

export default writeLog;
