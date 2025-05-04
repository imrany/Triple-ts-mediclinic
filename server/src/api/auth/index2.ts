import { genSalt, hash, compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { config } from "dotenv";
import axios from "axios";
import schedule from "node-schedule";
import { pool } from "../../postgres";
import { addToGroup } from "../../whatsapp/handles";
import { isDate, parse } from "date-fns";
config();

const APP_URL = process.env.APP_URL as string;
const MESSAGING_SERVER = process.env.MESSAGING_SERVER as string;
const VILLEBIZ_BUSINESS_GROUP=process.env.VILLEBIZ_BUSINESS_GROUP as string;

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
        pool.query(
            `SELECT * FROM users;`, 
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Failed to get users" });
                }

                const data = result.rows;

                // Ensure date format consistency and parse dates if necessary
                data.forEach((item: any) => {
                    if (typeof item['created_at'] === 'string' && !isDate(new Date(item['created_at']))) {
                    // Parse non-ISO date format (e.g., 'dd/MM/yyyy')
                    const parsedDate = parse(item['created_at'], 'dd/MM/yyyy', new Date());
                    item['created_at'] = parsedDate.toISOString().slice(0, 10); // Convert to ISO format
                    }
                });

                // Sort data by 'created_at' date in descending order
                data.sort((a: any, b: any) => new Date(b['created_at']).getTime() - new Date(a['created_at']).getTime());
                
                data.map(async(user: any) => {
                    const whatsapp_number=user.whatsapp_number||user.phone_number
                    if(user.status!=="Banned"&&whatsapp_number){
                        try{
                            const add=await addToGroup(VILLEBIZ_BUSINESS_GROUP,[`${whatsapp_number}@s.whatsapp.net`])
                            console.log(add)
                        }catch(error){
                            console.log(error)
                            return res.status(500).json({error:"Failed to add user to the villebiz whatsapp group", details:error})
                        }
                    }
                });
                return res.json({message:`All ${data.length} users were added to the Villebiz Whatsapp group`});
            })
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function getUsers(req: Request, res: Response) {
    try {
        pool.query(
            `SELECT * FROM users;`, 
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Failed to get users" });
                }

                const data = result.rows;

                // Ensure date format consistency and parse dates if necessary
                data.forEach((item: any) => {
                    if (typeof item['created_at'] === 'string' && !isDate(new Date(item['created_at']))) {
                    // Parse non-ISO date format (e.g., 'dd/MM/yyyy')
                    const parsedDate = parse(item['created_at'], 'dd/MM/yyyy', new Date());
                    item['created_at'] = parsedDate.toISOString().slice(0, 10); // Convert to ISO format
                    }
                });

                // Sort data by 'created_at' date in descending order
                data.sort((a: any, b: any) => new Date(b['created_at']).getTime() - new Date(a['created_at']).getTime());
                const users = data.map((user: any) => {
                    console.log(user)
                    return {
                        'user reference':user.user_reference,
                        'photo':user.photo,
                        'username':user.username,
                        'email':user.email,
                        'full name':user.full_name,
                        'phone number':user.phone_number,
                        'location name':user.location_name,
                        'location lat_long':user.location_lat_long,
                        'account balance':user.account_balance,
                        'type':user.type,
                        'status':user.status,
                        'whatsapp number':user.whatsapp_number
                    };
                });
        
                return res.json({
                    users,
                    rows: data.length,
                    columns: data.length > 0 ? Object.keys(data[0]).length : 0,
                });
            }
        );
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function passwordReset(req: Request, res: Response) {
    try {
        const { new_password, old_password, email } = req.body;
        if (email && new_password) {
            try {
                const userResult = await pool.query(
                    "SELECT * FROM users WHERE email = $1", // Ensure 'users' table and 'email' column exist in the database
                    [email]
                );
                if (userResult.rowCount === 0) {
                    return res.status(404).json({ error: "No user found, create account instead" });
                }

                const user = userResult.rows[0];
                const salt = await genSalt(10);
                const hashedPassword = await hash(new_password, salt);

                if (old_password) {
                    if (await compare(old_password, user.password)) {
                        await pool.query(
                            "UPDATE users SET password = $1 WHERE email = $2",
                            [hashedPassword, email]
                        );
                        const { data } = await axios.post(`${MESSAGING_SERVER}/password_reset`, {
                            password: new_password,
                            email,
                            username: user.username,
                        });
                        if (data.error) {
                            return res.json({ error: "Fail to update password" });
                        }
                        return res.json({ message: "Password updated" });
                    } else {
                        return res.status(401).json({ error: "You have entered the wrong old password, try again!" });
                    }
                } else {
                    await pool.query(
                        "UPDATE users SET password = $1 WHERE email = $2",
                        [hashedPassword, email]
                    );
                    const { data } = await axios.post(`${MESSAGING_SERVER}/password_reset`, {
                        password: new_password,
                        email,
                        username: user.username,
                    });
                    if (data.error) {
                        return res.json({ error: "Fail to update password" });
                    }
                    return res.json({ message: "Password updated" });
                }
            } catch(error) {
                console.log(error)
                return res.status(500).json({ error: `Failed to update password, try again later`})
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
            try {
                const userResult = await pool.query(
                    "SELECT * FROM users WHERE email = $1",
                    [email]
                );
                if (userResult.rowCount === 0) {
                    return res.status(404).json({ error: "No user found, create account instead" });
                }

                const user = userResult.rows[0];
                if (await compare(password, user.password)) {
                    const token = generateToken(user.id, period);
                    await pool.query(
                        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = $1",
                        [email]
                    );
                    return res.json({
                        data: {
                            email: user.email,
                            token,
                        },
                    });
                } else {
                    return res.status(401).json({ error: "You have entered the wrong password" });
                }
            }catch(error) {
                console.log(error)
                return res.status(500).json({ error: `Failed to sign in, try again later`})
            }
        } else {
            return res.status(408).json({ error: "Enter all the required fields" });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}


export async function getUserDetails(req: Request,res:Response) {
    try{
        const { email } = req.params
        if(email){
            const userResult = await pool.query(
                `SELECT u.*, o.*, b.* 
                 FROM users u 
                 LEFT JOIN orders o 
                 ON (u.email = o.email OR u.phone_number = o.phone_number OR u.email = b.email)
                 WHERE u.email = $1`,
                [email]
            );
            if (userResult.rowCount === 0) {
                return res.status(404).json({ error: "No user found, create account instead" });
            }

            const user = userResult.rows[0];
            const ordersResult = await pool.query(
                "SELECT SUM(total_price) as spending FROM orders WHERE email = $1 AND (status = 'paid' OR status = 'delivered')",
                [email]
            );
            const spending = ordersResult.rows[0]?.spending || 0;

            const data: any = {
                'user reference': user.user_reference,
                'photo': user.photo,
                'username': user.username,
                'email': user.email,
                'full name': user.full_name,
                'phone number': user.phone_number,
                'location name': user.location_name,
                'location lat_long': user.location_lat_long,
                'spending': spending, // sum of all paid orders.total_price
                'type': user.type,
                'status': user.status,
            };

            if(data['type']==='seller'){
                const ordersResult = await pool.query(
                    "SELECT SUM(seller_total_earned_per_order) as paid FROM orders WHERE business_email = $1 AND status = 'Delivered'",
                    [email]
                );
                const paid = ordersResult.rows[0]?.paid || 0;
                const businessData: any = { 
                    'business reference': user.business_reference, 
                    'business name': user.business_name, 
                    'business logo': user.business_logo, 
                    'business email': user.business_email, 
                    'business owner': user.business_owner, 
                    'business location': user.business_location, 
                    'location photo': user.location_photo, 
                    'location lat_long': user.location_lat_long, 
                    'business description': user.business_description, 
                    'till number': user.till_number,
                    'paybill': user.paybill, 
                    'paybill account number': user.paybill_account_number, 
                    'phone number': user.phone_number, 
                    'status':user.status,
                    'paid':paid, // sum of all paid orders.seller_total_earned_per_order
                }; 
                    
                data['business details'] = businessData; // Append business data to user data 
                
                return res.json({ 
                    msg: `Welcome ${data['username']}`, 
                    data
                });
            }else{
                return res.json({
                    msg:`Welcome ${data['username']}`,
                    data
                })
            }
        }else {
            return res.status(401).json({ error: "You are not authorized" });
        }
    }catch(error:any){
        console.error('Error:', error); // Return an error response
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

            const userResult:any = await pool.query(
                "SELECT * FROM users WHERE email = $1 OR phone_number = $2 OR username = $3",
                [email, phone_number, username]
            );

            if (userResult && userResult.rowCount > 0) {
                const existingUser = userResult.rows[0];
                if (existingUser.email === email) {
                    return res.status(200).json({ error: "A user with this email already exists." });
                } else if (existingUser.phone_number === phone_number) {
                    return res.status(200).json({ error: "A user with this phone number already exists." });
                } else if (existingUser.username === username) {
                    return res.status(200).json({ error: "This username is not available, try another." });
                }
            }

            const type = "user"; // user, admin, or seller
            const userAddress: any = location_lat_long ? await getCityName(location_lat_long) : location_name;
            const displayName = userAddress && userAddress.display_name ? userAddress.display_name : location_name;
            if (!displayName) {
                return res.status(500).json({ error: "Unable to retrieve city name from coordinates" });
            }

            const newUser = await pool.query(
                `INSERT INTO users (
                    user_reference, photo, username, email, password, full_name, phone_number, location_name, location_lat_long, type, 
                    status, agreed_to_terms_and_conditions, whatsapp_consent, whatsapp_number
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
                ) RETURNING *`,
                [
                    `REF-${userResult.rowCount+1}`, photo, username, email, hashedPassword, full_name, 
                    phone_number, displayName, location_lat_long, type,
                    "active", agreed_to_terms_and_conditions, whatsapp_consent, whatsapp_number
                ]
            );

            const user = newUser.rows[0];
            const { data } = await axios.post(`${MESSAGING_SERVER}/welcome`, {
                email: user.email,
                username: user.username
            });

            if (data.error) {
                console.log({ error: data.error });
            }

            if(whatsapp_consent&&whatsapp_number){
                try{
                    const add=await addToGroup(VILLEBIZ_BUSINESS_GROUP,[`${whatsapp_number}@s.whatsapp.net`])
                    console.log(add)
                }catch(error){
                    console.log(error)
                }
            }

            return res.json({
                data: {
                    email: user.email,
                    token: generateToken(user.user_reference)
                }
            });
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
            const userResult:any = await pool.query(
                "SELECT * FROM users WHERE email = $1",
                [email]
            );

            if (userResult.rowCount > 0 && (usage === "log_in" || usage === "register")) {
                return res.status(200).json({
                    error: "A user with this email already exists, try signing in",
                });
            } else {
                const { data } = await axios.post(`${MESSAGING_SERVER}/verify_email`, {
                    email,
                    code,
                });
                if (data.error) {
                    return res.json({ error: `Fail to sign up` });
                } else {
                    return res.json({
                        email,
                        code,
                    });
                }
            }
        } else {
            return res.status(408).json({ error: "Please enter your email address" });
        }
    } catch (error: any) {
        console.error("Error:", error); // Return an error response
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

        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: `No account under ${email} found, create a new account instead` });
        }

        const userAddress: any = location_lat_long ? await getCityName(location_lat_long) : location_name;
        const displayName = userAddress && userAddress.display_name ? userAddress.display_name : location_name;

        const updatedUser:any = await pool.query(
            `UPDATE users SET 
                photo = $1, 
                username = $2, 
                full_name = $3, 
                phone_number = $4, 
                location_name = $5, 
                location_lat_long = $6, 
                type = $7 
             WHERE email = $8 RETURNING *`,
            [
                photo,
                username,
                full_name,
                phone_number,
                displayName,
                location_lat_long,
                type,
                email,
            ]
        );

        if (updatedUser.rowCount > 0) {
            return res.json({ message: `Account details updated`, data: updatedUser.rows[0] });
        } else {
            return res.status(404).json({ error: `Failed to update account details for ${email}` });
        }
    } catch (error: any) {
        console.error("Error:", error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function sendMarketingEmails(req: Request, res: Response) {
    try {
        const { frequency } = req.query; // 'weekly' or 'monthly'
        if (!frequency || (frequency !== "weekly" && frequency !== "monthly")) {
            return res.status(400).json({ error: "Invalid frequency. Use 'weekly' or 'monthly'." });
        }

        const userResult = await pool.query(
            "SELECT email, full_name FROM users WHERE status = 'active'"
        );

        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: "No active users found to send emails." });
        }

        const users = userResult.rows;
        const emailPromises = users.map(async (user: any) => {
            const { email, full_name } = user;
            const { data } = await axios.post(`${MESSAGING_SERVER}/send_marketing_email`, {
                email,
                fullName: full_name,
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
    const code = gen.length === 6 ? gen : `${Math.floor(Math.random() * 10)}${gen}`
    return code;
}

// Schedule weekly marketing emails
schedule.scheduleJob("0 9 * * 1", async () => {
    console.log("Sending weekly marketing emails...");
    try {
        const userResult = await pool.query(
            "SELECT email, full_name FROM users WHERE status = 'active'"
        );

        if (userResult.rowCount === 0) {
            console.log("No active users found to send weekly emails.");
            return;
        }

        const users = userResult.rows;
        const emailPromises = users.map(async (user: any) => {
            const { email, full_name } = user;
            const { data } = await axios.post(`${MESSAGING_SERVER}/send_marketing_email`, {
                email,
                fullName: full_name,
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
        const userResult = await pool.query(
            "SELECT email, full_name FROM users WHERE status = 'active'"
        );

        if (userResult.rowCount === 0) {
            console.log("No active users found to send monthly emails.");
            return;
        }

        const users = userResult.rows;
        const emailPromises = users.map(async (user: any) => {
            const { email, full_name } = user;
            const { data } = await axios.post(`${MESSAGING_SERVER}/send_marketing_email`, {
                email,
                fullName: full_name,
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

        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        ).catch((err) => {
            console.error("Error fetching user:", err);
            throw new Error("Database error while fetching user");
        });

        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: `No user found with email ${email}` });
        }

        try {
            // Delete products associated with the business
            await pool.query(
                "DELETE FROM products WHERE business_email = $1",
                [email]
            );
        } catch (err) {
            console.error("Error deleting products:", err);
            return res.status(500).json({ error: "Failed to delete associated products" });
        }

        try {
            // Delete the business associated with the user
            await pool.query(
                "DELETE FROM businesses WHERE business_email = $1",
                [email]
            );
        } catch (err) {
            console.error("Error deleting business:", err);
            return res.status(500).json({ error: "Failed to delete associated business" });
        }

        try {
            // Delete the user
            await pool.query(
                "DELETE FROM users WHERE email = $1",
                [email]
            );
        } catch (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({ error: "Failed to delete user" });
        }

        return res.json({ message: `User with email ${email} and associated business/products have been deleted successfully` });
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
