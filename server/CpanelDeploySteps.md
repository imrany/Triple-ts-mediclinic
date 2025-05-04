#### How to deploy this nodejs app on cpanel
- Create a subdomain, i.e api.example.com
    - This will create a `api.example.com` on your root file manager
    - Open your file manager, in `api.example.com` upload your project files
    - File structure
        /build/
        /package.json
        /package-lock.json
    - visit [https://api.example.com](https://api.example.com)
    - Check if the file exist

    - `package.json` sample
    ```json
    {
        "name": "villebiz",
        "version": "0.0.3",
        "description": "Get affordable goods and services.",
        "main": "./build/index.js",
        "scripts": {
            "start": "node ./build/index.js"
        },
        "repository": {
            "type": "git",
            "url": "https://github.com/imrany/villebiz"
        },
        "keywords": [
            "Market",
            "Goods",
            "Services"
        ],
        "author": "imran",
        "license": "GNU GENERAL PUBLIC LICENSE",
        "dependencies": {
            "@google-cloud/local-auth": "^3.0.1",
            "@google/generative-ai": "^0.21.0",
            "axios": "^1.4.0",./
            "bcryptjs": "^2.4.3",
            "cors": "^2.8.5",
            "dotenv": "^16.3.1",
            "ejs": "^3.1.9",
            "express": "^4.18.2",
            "formidable": "^3.5.1",
            "google-auth-library": "^9.15.0",
            "google-drive-api": "^1.0.0",
            "google-spreadsheet": "^4.1.4",
            "googleapis": "^126.0.1",
            "jsonwebtoken": "^9.0.1",
            "marked": "^15.0.0",
            "multer": "^1.4.5-lts.1",
            "nodemailer": "^6.9.4",
            "socket.io": "^4.7.0"
        },
        "devDependencies": {
            "@types/bcryptjs": "^2.4.2",
            "@types/cors": "^2.8.13",
            "@types/dotenv": "^8.2.0",
            "@types/express": "^4.17.17",
            "@types/formidable": "^3.4.3",
            "@types/jsonwebtoken": "^9.0.2",
            "@types/multer": "^1.4.7",
            "@types/node": "^20.8.2",
            "@types/nodemailer": "^6.4.9",
            "nodemon": "^2.0.22",
            "ts-node": "^10.9.2",
            "typescript": "^5.7.2"
        }
    }
    ```

- Setup a nodejs on your cpanel
    - Set nodejs version: lastest, i.e nodejs version 22.8.0
    - Application mode: production
    - Application root: api.example.com/nod (where your package.json is located)
    - Application URL: api.example.com
    - Application startup file: build/index.js
    - Added your envirnment variables
    - Press create button
    - Stop the application
    - Run NPM install
    - Start application
    - Run Js script, select `start`
    - visit your link [https://api.example.com](https://api.example.com)
