import { pool } from "../../postgres";
import { genSalt, hash, compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { config } from "dotenv";
import axios from "axios";
import schedule from "node-schedule";
import { accessSheet, writeDataToSheet, updateRow, deleteRows } from "../../lib/google-apis/sheets";
import { isDate, parse } from "date-fns";
import { addToGroup } from "../../whatsapp/handles";
import { mapArraytoObj } from "../../lib/google-apis/mapArrayToObj";
config();

const spreadsheetId = process.env.RECORDS_SPREADSHEET_ID as string;
const APP_URL = process.env.APP_URL as string;
const MESSAGING_SERVER = process.env.MESSAGING_SERVER as string;
const VILLEBIZ_BUSINESS_GROUP = process.env.VILLEBIZ_BUSINESS_GROUP as string;
const userRange = 'users!A1:R10000';
const businessRange = 'businesses!A1:W10000';
const productsRange = 'products!A1:Z10000';
const ordersRange = 'orders!A1:X10000';

export async function migrateUsersToPg(_: Request, res: Response) {
    try {
        const rows: any = await accessSheet(spreadsheetId, userRange);
        const data = mapArraytoObj(rows);
        try {
            for (const user of data) {
                const query = `
                    INSERT INTO users (
                        user_reference, photo, username, email, password, full_name, phone_number, 
                        location_name, location_lat_long, type, created_at, 
                        last_login, status, agreed_to_terms_and_conditions, email_marketing_consent, whatsapp_consent, whatsapp_number
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
                    ) ON CONFLICT (email) DO NOTHING;
                `;

                const values = [
                    user["user reference"] || "",
                    user["photo"] || "",
                    user["username"] || "",
                    user["email"] || "",
                    user["password"] || "",
                    user["full name"] || "",
                    user["phone number"] || "",
                    user["location name"] || "",
                    user["location lat_long"] || "",
                    user["type"] || "user",
                    user["Created at"] || null,
                    user["Last Login"] || null,
                    user["Status"] || "active",
                    user["Agreed ToTerms and Conditions"] || true,
                    user["Email Marketing Consent"] || true,
                    user["Whatsapp Notification Consent"] || false,
                    user["Whatsapp Number"] || 0,
                ];

                await pool.query(query, values);
            }

            res.json({ message: "Users migrated successfully to PostgreSQL database." });
        } catch (error) {
            await pool.query("ROLLBACK");
            console.error("Error during migration:", error);
            res.status(500).json({ error: "Failed to migrate users to PostgreSQL database." });
        }
    } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}

async function getCityName(coordinates: string) {
    const coord = coordinates.trim().split(",");
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coord[0]}&lon=${coord[1]}`;
    try {
        const { data } = await axios.get(url);
        if (data && data.address && data.address.city) {
            return data;
        }
        console.log("City not found");
        return null;
    } catch (error: any) {
        console.log("Error:", error);
        return null;
    }
}

const generateToken = (id: string, period?: string) => {
    return sign({ id }, `${process.env.JWT_SECRET}`, {
        expiresIn: period || "10d",
    });
};

export async function addAllUsersToVillebizWhatsappGroup(_: Request, res: Response) {
    try {
        const result: any = await accessSheet(spreadsheetId, userRange);
        const data = mapArraytoObj(result);

        // Ensure date format consistency and parse dates if necessary
        data.forEach((item: any) => {
            if (typeof item['Created at'] === 'string' && !isDate(new Date(item['Created at']))) {
                // Parse non-ISO date format (e.g., 'dd/MM/yyyy')
                const parsedDate = parse(item['Created at'], 'dd/MM/yyyy', new Date());
                item['Created at'] = parsedDate.toISOString().slice(0, 10); // Convert to ISO format
            }
        });

        // Sort data by 'Created at' date in descending order
        data.sort((a: any, b: any) => new Date(b['Created at']).getTime() - new Date(a['Created at']).getTime());

        data.map(async(user: any) => {
            const whatsapp_number = user["Whatsapp Number"] || user["phone number"];
            if (user["Status"] !== "Banned" && whatsapp_number) {
                try {
                    const add = await addToGroup(VILLEBIZ_BUSINESS_GROUP, [`${whatsapp_number}@s.whatsapp.net`]);
                    console.log(add);
                } catch(error) {
                    console.log(error);
                    return res.status(500).json({error: "Failed to add user to the villebiz whatsapp group", details: error});
                }
            }
        });

        return res.json({message: `All ${result.length - 1} users were added to the Villebiz Whatsapp group`});
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getUsers(_: Request, res: Response) {
    try {
        const result: any = await accessSheet(spreadsheetId, userRange);
        const data = mapArraytoObj(result);

        // Ensure date format consistency and parse dates if necessary
        data.forEach((item: any) => {
            if (typeof item['Created at'] === 'string' && !isDate(new Date(item['Created at']))) {
                // Parse non-ISO date format (e.g., 'dd/MM/yyyy')
                const parsedDate = parse(item['Created at'], 'dd/MM/yyyy', new Date());
                item['Created at'] = parsedDate.toISOString().slice(0, 10); // Convert to ISO format
            }
        });

        // Sort data by 'Created at' date in descending order
        data.sort((a: any, b: any) => new Date(b['Created at']).getTime() - new Date(a['Created at']).getTime());

        const users = data.map((user: any) => {
            console.log(user);
            return {
                'user reference': user["user reference"] || "",
                'photo': user["photo"] || "",
                'username': user["username"] || "",
                'email': user["email"] || "",
                'full name': user["full name"] || "",
                'phone number': user["phone number"] || "",
                'location name': user["location name"] || "",
                'location lat_long': user["location lat_long"] || "",
                'account balance': user["account balance"] || "",
                'type': user["type"] || "",
                'status': user["Status"] || "",
                'whatsapp number': user["Whatsapp Number"] || "",
            };
        });

        return res.json({
            users,
            rows: result.length - 1,
            columns: result[0].length,
        });
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function passwordReset(req: Request, res: Response) {
    try {
        const { new_password, old_password, email } = req.body;
        if (email && new_password) {
            const rows: any = await accessSheet(spreadsheetId, userRange);
            let rowIndex = -1;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i][3] === email) {
                    rowIndex = i;
                    break;
                }
            }
            if (rowIndex === -1) {
                return res.status(404).json({ error: "No user found, create account instead" });
            }

            const range = `users!A${rowIndex+1}`;
            const salt = await genSalt(10);
            const hashedPassword = await hash(new_password, salt);
            const values = [
                rows[rowIndex][0],
                rows[rowIndex][1], rows[rowIndex][2], rows[rowIndex][3], hashedPassword, rows[rowIndex][5], rows[rowIndex][6], 
                rows[rowIndex][7], rows[rowIndex][8], rows[rowIndex][9], rows[rowIndex][10], rows[rowIndex][11], 
                rows[rowIndex][12], rows[rowIndex][13], rows[rowIndex][14], rows[rowIndex][15], rows[rowIndex][16], rows[rowIndex][17]
            ];

            if (old_password) {
                if (await compare(old_password, rows[rowIndex][4])) {
                    const { data } = await axios.post(`${MESSAGING_SERVER}/password_reset`, {
                        password: new_password,
                        email,
                        username: rows[rowIndex][2]
                    });
                    if (data.error) {
                        return res.json({ error: "Fail to update password" });
                    } else {
                        await updateRow(spreadsheetId, range, values);
                        return res.json({ message: "Password updated" });
                    }
                } else {
                    return res.status(401).json({ error: "You have entered the wrong old password, try again!" });
                }
            } else {
                const { data } = await axios.post(`${MESSAGING_SERVER}/password_reset`, {
                    password: new_password,
                    email,
                    username: rows[rowIndex][2]
                });
                if (data.error) {
                    return res.json({ error: "Fail to update password" });
                } else {
                    await updateRow(spreadsheetId, range, values);
                    return res.json({ message: "Password updated" });
                }
            }
        } else {
            return res.status(408).json({ error: "Enter all the required fields" });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function signIn(req: Request, res: Response) {
    try {
        const { password, email, period } = req.body;
        if (email && password) {
            const rows: any = await accessSheet(spreadsheetId, userRange);
            let rowIndex = -1;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i][3] === email) {
                    rowIndex = i;
                    break;
                }
            }
            if (rowIndex === -1) {
                return res.status(404).json({ error: "No user found, create account instead" });
            }

            const currentDate = new Date().toISOString();
            const range = `users!A${rowIndex + 1}:R${rowIndex + 1}`;
            const values = [
                rows[rowIndex][0], rows[rowIndex][1], rows[rowIndex][2], rows[rowIndex][3],
                rows[rowIndex][4], rows[rowIndex][5], rows[rowIndex][6], rows[rowIndex][7],
                rows[rowIndex][8], rows[rowIndex][9], rows[rowIndex][10], rows[rowIndex][11],
                currentDate, rows[rowIndex][13], rows[rowIndex][14], rows[rowIndex][15], 
                rows[rowIndex][16], rows[rowIndex][17]
            ];

            if (await compare(password, rows[rowIndex][4])) {
                await updateRow(spreadsheetId, range, values);
                const token = generateToken(rows[rowIndex][0], period);
                
                return res.json({
                    data: {
                        email: rows[rowIndex][3],
                        token
                    }
                });
            } else {
                return res.status(401).json({ error: "You have entered the wrong password" });
            }
        } else {
            return res.status(408).json({ error: "Enter all the required fields" });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getUserDetails(req: Request, res: Response) {
    try {
        const { email } = req.params;
        if (email) {
            const rowsUsers: any = await accessSheet(spreadsheetId, userRange);
            let rowIndex = -1;
            for (let i = 0; i < rowsUsers.length; i++) {
                if (rowsUsers[i][3] === email) {
                    rowIndex = i;
                    break;
                }
            }
            if (rowIndex === -1) {
                return res.status(404).json({ error: "No user found, create account instead" });
            }

            // Calculate spending from orders
            const rowsOrders: any = await accessSheet(spreadsheetId, ordersRange);
            let totalSpending = 0;

            for (let i = 1; i < rowsOrders.length; i++) {
                if (
                    (rowsOrders[i][8] === email || rowsOrders[i][10] === rowsUsers[rowIndex][5]) &&
                    (rowsOrders[i][7] === 'Paid' || rowsOrders[i][7] === 'Delivered')
                ) {
                    totalSpending += parseFloat(rowsOrders[i][4] || 0);
                }
            }

            const data: any = {
                'user reference': rowsUsers[rowIndex][0],
                'photo': rowsUsers[rowIndex][1],
                'username': rowsUsers[rowIndex][2],
                'email': rowsUsers[rowIndex][3],
                'full name': rowsUsers[rowIndex][5],
                'phone number': rowsUsers[rowIndex][6],
                'location name': rowsUsers[rowIndex][7],
                'location lat_long': rowsUsers[rowIndex][8],
                'spending': totalSpending,
                'type': rowsUsers[rowIndex][10],
                'status': rowsUsers[rowIndex][13],
            };

            if (data['type'] === 'seller') {
                const rowsBusiness: any = await accessSheet(spreadsheetId, businessRange);
                let rowBusinessIndex = -1;
                for (let i = 0; i < rowsBusiness.length; i++) {
                    if (rowsBusiness[i][3] === email) {
                        rowBusinessIndex = i;
                        break;
                    }
                }

                if (rowBusinessIndex !== -1) {
                    let totalPaid = 0;
                    let totalPaidButNoTDelivered = 0;
                    let totalUnPaid = 0;
                    for (let i = 1; i < rowsOrders.length; i++) {
                        if (rowsOrders[i][18] === email && rowsOrders[i][7] === 'Delivered') {
                            totalPaid += parseFloat(rowsOrders[i][22] || 0);
                        }
                        if (rowsOrders[i][18] === email && rowsOrders[i][7] === 'Paid') {
                            totalPaidButNoTDelivered += parseFloat(rowsOrders[i][22] || 0);
                        }
                        if (rowsOrders[i][18] === email && rowsOrders[i][7] === 'Unpaid') {
                            totalUnPaid += parseFloat(rowsOrders[i][22] || 0);
                        }
                    }

                    const businessData: any = {
                        'business reference': rowsBusiness[rowBusinessIndex][0],
                        'business name': rowsBusiness[rowBusinessIndex][1],
                        'business logo': rowsBusiness[rowBusinessIndex][2],
                        'business email': rowsBusiness[rowBusinessIndex][3],
                        'business owner': rowsBusiness[rowBusinessIndex][4],
                        'business location': rowsBusiness[rowBusinessIndex][5],
                        'location photo': rowsBusiness[rowBusinessIndex][6],
                        'location lat_long': rowsBusiness[rowBusinessIndex][7],
                        'business description': rowsBusiness[rowBusinessIndex][8],
                        'till number': rowsBusiness[rowBusinessIndex][9],
                        'paybill': rowsBusiness[rowBusinessIndex][10],
                        'paybill account number': rowsBusiness[rowBusinessIndex][11],
                        'phone number': rowsBusiness[rowBusinessIndex][12],
                        'status': rowsBusiness[rowBusinessIndex][16],
                        'paid': totalPaid,
                        "totalUnPaid": totalUnPaid,
                        "total paid but not delivered": totalPaidButNoTDelivered
                    };

                    data['business details'] = businessData;
                }

                return res.json({
                    msg: `Welcome ${data['username']}`,
                    data
                });
            } else if (data['type'] === 'admin') {
                const rowsBusinesses: any = await accessSheet(spreadsheetId, businessRange);
                const rowsTransactions: any = await accessSheet(spreadsheetId, ordersRange);

                const allBusinesses = rowsBusinesses.slice(1).map((row: any) => ({
                    'business reference': row[0],
                    'business name': row[1],
                    'business email': row[3],
                    'status': row[16],
                }));

                const allOrders = rowsOrders.slice(1).map((row: any) => ({
                    'order reference': row[0],
                    'customer email': row[8],
                    'status': row[7],
                    'total price': row[4],
                }));

                const allUsers = rowsUsers.slice(1).map((row: any) => ({
                    'user reference': row[0],
                    'username': row[2],
                    'email': row[3],
                    'status': row[13],
                }));

                const allTransactions = rowsTransactions.slice(1).map((row: any) => ({
                    'transaction reference': row[0],
                    'amount': row[4],
                    'status': row[7],
                }));

                return res.json({
                    msg: `Welcome ${data['username']}`,
                    data: {
                        ...data,
                        allBusinesses,
                        allOrders,
                        allUsers,
                        allTransactions,
                    }
                });
            } else {
                return res.json({
                    msg: `Welcome ${data['username']}`,
                    data
                });
            }
        } else {
            return res.status(401).json({ error: "You are not authorized" });
        }
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function signUp(req: Request, res: Response) {
    try {
        const { 
            username, full_name, photo, email, phone_number, location_name, location_lat_long, password, agreed_to_terms_and_conditions,
            whatsapp_number, whatsapp_consent
        } = req.body;
        
        if (username && full_name && photo && email && phone_number && location_name && password && agreed_to_terms_and_conditions) {
            const salt = await genSalt(10);
            const hashedPassword = await hash(password, salt);

            const rows: any = await accessSheet(spreadsheetId, userRange);
            const emailExists = rows.some((row: any) => row.includes(email));
            const phoneExists = rows.some((row: any) => row.includes(phone_number));
            const usernameExists = rows.some((row: any) => row.includes(username));
            
            if (emailExists) {
                return res.status(200).json({ error: "A user with this email already exists." });
            } else if (phoneExists) {
                return res.status(200).json({ error: "A user with this phone number already exists." });
            } else if (usernameExists) {
                return res.status(200).json({ error: "This username is not available, try another." });
            }

            const type = "user"; // user, admin, or seller
            const range = `users!A${rows.length + 1}`;

            const userAddress: any = location_lat_long ? await getCityName(location_lat_long) : location_name;
            const displayName = userAddress && userAddress.display_name ? userAddress.display_name : location_name;
            if (!displayName) {
                return res.status(500).json({ error: "Unable to retrieve city name from coordinates" });
            }

            const currentDate = new Date().toISOString();
            const accountBalance = "0"; // Default account balance
            
            const values = [
                [
                    `REF-${rows.length + 2}`, photo, username, email, hashedPassword, full_name, 
                    phone_number, displayName, location_lat_long, accountBalance, type, 
                    currentDate, currentDate, "active", agreed_to_terms_and_conditions, true, whatsapp_consent, whatsapp_number
                ]
            ];

            const result = await writeDataToSheet(spreadsheetId, range, values);
            if (result) {
                const newRows: any = await accessSheet(spreadsheetId, userRange);
                let rowIndex = -1;
                for (let i = 0; i < newRows.length; i++) {
                    if (newRows[i][3] === email) {
                        rowIndex = i;
                        break;
                    }
                }
                
                const { data } = await axios.post(`${MESSAGING_SERVER}/welcome`, {
                    email,
                    username: newRows[rowIndex][2]
                });
                
                if (data.error) {
                    console.log({ error: data.error });
                }

                if (whatsapp_consent && whatsapp_number) {
                    try {
                        const add = await addToGroup(VILLEBIZ_BUSINESS_GROUP, [`${whatsapp_number}@s.whatsapp.net`]);
                        console.log(add);
                    } catch (error) {
                        console.log(error);
                    }
                }

                return res.json({
                    data: {
                        email: newRows[rowIndex][3],
                        token: generateToken(newRows[rowIndex][0])
                    }
                });
            } else {
                return res.status(500).json({ error: "Sign up failed, try again" });
            }
        } else {
            return res.status(408).json({ error: "Enter all the required fields" });
        }
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function verifEmail(req: Request, res: Response) {
    try {
        const { email } = req.body;
        const { usage } = req.query;
        if (email) {
            const code = createCode();
            const rows: any = await accessSheet(spreadsheetId, userRange);
            const emailExists = rows.some((row: any) => row.includes(email));

            if (emailExists && (usage === "log_in" || usage === "register")) {
                return res.status(200).json({
                    error: "A user with this email already exists, try signing in",
                });
            } else {
                const { data } = await axios.post(`${MESSAGING_SERVER}/verify_email`, {
                    email,
                    code
                });
                if (data.error) {
                    return res.json({ error: `Fail to sign up` });
                } else {
                    return res.json({
                        email,
                        code
                    });
                }
            }
        } else {
            return res.status(408).json({ error: "Please enter your email address" });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function updateUserDetails(req: Request, res: Response) {
    try {
        const email = req.params.email;
        const {
            photo,
            username,
            full_name,
            phone_number,
            location_name,
            location_lat_long,
            type,
        } = req.body;

        const rows: any = await accessSheet(spreadsheetId, userRange);
        let rowIndexToUpdate = -1;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][3] === email) {
                rowIndexToUpdate = i;
                break;
            }
        }
        
        if (rowIndexToUpdate === -1) {
            return res.status(404).json({ error: `No account under ${email} found, create a new account instead` });
        }
        
        const range = `users!A${rowIndexToUpdate+1}:R${rowIndexToUpdate+1}`;

        const userAddress: any = location_lat_long ? await getCityName(location_lat_long) : location_name;
        const displayName = userAddress && userAddress.display_name ? userAddress.display_name : location_name;

        const values = [
            rows[rowIndexToUpdate][0],
            photo, username, email, rows[rowIndexToUpdate][4], full_name, phone_number, 
            displayName, location_lat_long, rows[rowIndexToUpdate][9], type,
            rows[rowIndexToUpdate][11], rows[rowIndexToUpdate][12], rows[rowIndexToUpdate][13], 
            rows[rowIndexToUpdate][14], rows[rowIndexToUpdate][15], rows[rowIndexToUpdate][16], rows[rowIndexToUpdate][17]
        ];
        
        const result = await updateRow(spreadsheetId, range, values);
        if (result) {
            // Fetch the updated user to return in the response
            const updatedRows: any = await accessSheet(spreadsheetId, userRange);
            let updatedRowIndex = -1;
            for (let i = 0; i < updatedRows.length; i++) {
                if (updatedRows[i][3] === email) {
                    updatedRowIndex = i;
                    break;
                }
            }
            
            const updatedUser = {
                'user reference': updatedRows[updatedRowIndex][0],
                'photo': updatedRows[updatedRowIndex][1],
                'username': updatedRows[updatedRowIndex][2],
                'email': updatedRows[updatedRowIndex][3],
                'full name': updatedRows[updatedRowIndex][5],
                'phone number': updatedRows[updatedRowIndex][6],
                'location name': updatedRows[updatedRowIndex][7],
                'location lat_long': updatedRows[updatedRowIndex][8],
                'account balance': updatedRows[updatedRowIndex][9],
                'type': updatedRows[updatedRowIndex][10],
                'status': updatedRows[updatedRowIndex][13],
            };
            
            return res.json({ message: `Account details updated`, data: updatedUser });
        } else {
            return res.status(404).json({ error: `Failed to update account details for ${email}` });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function sendMarketingEmails(req: Request, res: Response) {
    try {
        const { frequency } = req.query; // 'weekly' or 'monthly'
        if (!frequency || (frequency !== "weekly" && frequency !== "monthly")) {
            return res.status(400).json({ error: "Invalid frequency. Use 'weekly' or 'monthly'." });
        }

        const rows: any = await accessSheet(spreadsheetId, userRange);
        const users = rows.filter((row: any) => row[3] && row[13] === "active"); // Filter active users with email

        if (users.length === 0) {
            return res.status(404).json({ error: "No active users found to send emails." });
        }

        const emailPromises = users.map(async (user: any) => {
            const email = user[3];
            const fullName = user[5];
            const { data } = await axios.post(`${MESSAGING_SERVER}/send_marketing_email`, {
                email,
                fullName,
                frequency,
            });
            return data;
        });

        const results = await Promise.all(emailPromises);

        const failedEmails = results.filter((result: any) => result.error);
        if (failedEmails.length > 0) {
            console.log("Failed to send emails to:", failedEmails);
        }

        return res.json({
            message: `Marketing emails sent to ${users.length - failedEmails.length} users.`,
            failedEmails,
        });
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

function createCode(): string {
    const date = new Date();
    const randomPart = Math.floor(10 + Math.random() * 90);
    const gen = `${String(date.getSeconds()+randomPart)}${date.getSeconds()}${randomPart}`.slice(0,6);
    const code = gen.length === 6 ? gen : `${Math.floor(Math.random() * 10)}${gen}`;
    return code;
}

// Schedule weekly marketing emails
schedule.scheduleJob("0 9 * * 1", async () => {
    console.log("Sending weekly marketing emails...");
    try {
        const rows: any = await accessSheet(spreadsheetId, userRange);
        const users = rows.filter((row: any) => row[3] && row[13] === "active");

        if (users.length === 0) {
            console.log("No active users found to send weekly emails.");
            return;
        }

        const emailPromises = users.map(async (user: any) => {
            const email = user[3];
            const fullName = user[5];
            const { data } = await axios.post(`${MESSAGING_SERVER}/send_marketing_email`, {
                email,
                fullName,
                frequency: "weekly",
            });
            return data;
        });

        const results = await Promise.all(emailPromises);
        const failedEmails = results.filter((result: any) => result.error);

        console.log(`Weekly marketing emails sent to ${users.length - failedEmails.length} users.`);
        if (failedEmails.length > 0) {
            console.log("Failed to send weekly emails to:", failedEmails);
        }
    } catch (error: any) {
        console.log("Error sending weekly marketing emails:", error.message);
    }
});

// Schedule monthly marketing emails
schedule.scheduleJob("0 9 1 * *", async () => {
    console.log("Sending monthly marketing emails...");
    try {
        const rows: any = await accessSheet(spreadsheetId, userRange);
        const users = rows.filter((row: any) => row[3] && row[13] === "active");

        if (users.length === 0) {
            console.log("No active users found to send monthly emails.");
            return;
        }

        const emailPromises = users.map(async (user: any) => {
            const email = user[3];
            const fullName = user[5];
            const { data } = await axios.post(`${MESSAGING_SERVER}/send_marketing_email`, {
                email,
                fullName,
                frequency: "monthly",
            });
            return data;
        });

        const results = await Promise.all(emailPromises);
        const failedEmails = results.filter((result: any) => result.error);

        console.log(`Monthly marketing emails sent to ${users.length - failedEmails.length} users.`);
        if (failedEmails.length > 0) {
            console.log("Failed to send monthly emails to:", failedEmails);
        }
    } catch (error: any) {
        console.log("Error sending monthly marketing emails:", error.message);
    }
});

export async function deleteUser(req: Request, res: Response) {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ error: "Email is required to delete a user" });
        }

        const rows: any = await accessSheet(spreadsheetId, userRange);
        let rowIndex = -1;

        // Find the user by email
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][3] === email) {
                rowIndex = i;
                break;
            }
        }

        if (rowIndex === -1) {
            return res.status(404).json({ error: `No user found with email ${email}` });
        }

        const userType = rows[rowIndex][10]; // Check user type (user, seller, admin)

        // If the user is a seller, check for paid orders and delete their business/products if applicable
        if (userType === "seller") {
            const orders: any = await accessSheet(spreadsheetId, ordersRange);
            const hasPaidOrders = orders.some(
                (order: any) => order[18] === email && (order[7] === "Paid")
            );

            if (hasPaidOrders) {
                return res.status(400).json({
                    error: `Cannot delete seller with email ${email} as they have undelivered orders.`,
                });
            }

            const businessRows: any = await accessSheet(spreadsheetId, businessRange);
            let businessRowIndex = -1;

            // Find the business associated with the seller
            for (let i = 0; i < businessRows.length; i++) {
                if (businessRows[i][3] === email) {
                    businessRowIndex = i;
                    break;
                }
            }

            if (businessRowIndex !== -1) {
                await deleteRows(spreadsheetId, "businesses", businessRowIndex + 1, businessRowIndex + 1);
                console.log(`Business associated with ${email} deleted.`);
            }

            // Delete products associated with the business email
            const productRows: any = await accessSheet(spreadsheetId, productsRange);
            const productRowsToDelete = [];

            for (let i = 0; i < productRows.length; i++) {
                // Assuming business_email is at index 3 in products
                if (productRows[i][3] === email) {
                    productRowsToDelete.push(i + 1);
                }
            }

            if (productRowsToDelete.length > 0) {
                await deleteRows(spreadsheetId, "products", Math.min(...productRowsToDelete), Math.max(...productRowsToDelete));
                console.log(`Products associated with ${email} deleted.`);
            }

            // Delete orders associated with the seller
            const orderRows: any = await accessSheet(spreadsheetId, ordersRange);
            const orderRowsToDelete = [];

            for (let i = 0; i < orderRows.length; i++) {
                if (orderRows[i][18] === email) {
                    orderRowsToDelete.push(i + 1);
                }
            }

            if (orderRowsToDelete.length > 0) {
                await deleteRows(spreadsheetId, "orders", Math.min(...orderRowsToDelete), Math.max(...orderRowsToDelete));
                console.log(`Orders associated with ${email} deleted.`);
            }
        }

        // Delete the user
        await deleteRows(spreadsheetId, "users", rowIndex + 1, rowIndex + 1);

        return res.json({ message: `User with email ${email} and associated business/products have been deleted successfully` });
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}