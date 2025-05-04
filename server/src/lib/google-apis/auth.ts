import axios from 'axios';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { config } from "dotenv"
config()

const KEY_URL = process.env.KEY_URL as string;
const KEY_PATH = path.join(__dirname, '/key/keyfile.json');

// Ensure the key directory exists
if (!fs.existsSync(path.join(__dirname, '/key'))) {
    fs.mkdirSync(path.join(__dirname, '/key'), { recursive: true });
}

// Function to download the key file
async function downloadKeyFile() {
    try {
        const response = await axios.get(KEY_URL, { responseType: 'stream' });
        const writer = fs.createWriteStream(KEY_PATH);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error: any) {
        console.error(`Error downloading key file: ${error.message}`);
        throw new Error(`Failed to download key file from ${KEY_URL}`);
    }
}

// Function to authorize with Google
export async function authorize() {
    try {
        if (!fs.existsSync(KEY_PATH)) {
            await downloadKeyFile();
        }
        const client = new google.auth.GoogleAuth({
            keyFile: KEY_PATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
        });
        const auth = await client.getClient();
        return auth;
    } catch (error: any) {
        console.error(`Error during authorization: ${error.message}`);
        throw new Error('Authorization failed');
    }
}

(async () => { 
    try { 
        if (!fs.existsSync(KEY_PATH)) {
            await downloadKeyFile();
            console.log("Key file downloaded")
        }
    } catch (error) { 
        console.error('Error downloading key file:', error);
    } 
})();
