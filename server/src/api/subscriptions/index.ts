import { Request, Response } from "express"
import * as webpush from "web-push";
import { db } from "./sqlite"
import { config } from "dotenv";
config();

const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY as string;
const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY as string;
const TRANSPORTER = process.env.TRANSPORTER as string;

webpush.setVapidDetails(`mailto:${TRANSPORTER}`, PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

export async function subscribe(req: Request, res: Response) {
    try {
        const { endpoint, keys, role, email } = req.body;

        // Validate the subscription object
        if (!endpoint || !keys || !keys.p256dh || !keys.auth || !role || !email) {
            console.error('Invalid subscription data:', req.body);
            return res.status(400).json({ error: 'Invalid subscription data.' });
        }

        // Check if the subscription already exists
        db.get(
            `SELECT email, role FROM subscriptions WHERE endpoint = ?`,
            [endpoint],
            (err, row: any) => {
                if (err) {
                    console.error('Error checking subscription:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                if (!row) {
                    // Insert the new subscription
                    db.run(
                        `INSERT INTO subscriptions (endpoint, keys_p256dh, keys_auth, role, email) VALUES (?, ?, ?, ?, ?)`,
                        [endpoint, keys.p256dh, keys.auth, role, email],
                        function (err) {
                            if (err) {
                                console.error('Error saving subscription:', err);
                                return res.status(500).json({ error: `Internal Server Error: ${err}` });
                            }
                            return res.status(201).json({ message: 'Subscribed successfully.' });
                        }
                    );
                } else if (row.email !== email || row.role !== role) {
                    // Update the subscription if email or role has changed
                    db.run(
                        `UPDATE subscriptions SET email = ?, role = ? WHERE endpoint = ?`,
                        [email, role, endpoint],
                        function (err) {
                            if (err) {
                                console.error('Error updating subscription:', err);
                                return res.status(500).json({ error: `Internal Server Error: ${err}` });
                            }
                            return res.status(200).json({ message: 'Subscription updated successfully.' });
                        }
                    );
                } else {
                    // No changes needed
                    return res.status(200).json({ message: 'No updates needed. Already subscribed.' });
                }
            }
        );
    } catch (error: any) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: error.message });
    }
}



export function unSubscribe(req:Request, res:Response){
    const { endpoint } = req.body;
    db.run(`DELETE FROM subscriptions WHERE endpoint = ?`, endpoint, function(err) {
        if (err) {
            console.error('Error deleting subscription:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Subscription deleted' });
        }
    });
};

export async function sendNotification(req: Request, res: Response) {
    try {
        const { title, body, link, icon, forSellers, forAdmins, email } = req.body; 
        const notificationPayload = JSON.stringify({ title, body, link, icon });

        // Construct the query based on filters
        let query = 'WHERE 1=1'; // Default to include all roles, parameterized values will be added below
        const params: any[] = [];
        
        if (!forSellers && !forAdmins && !email) {
            query += ' AND role IN ("admin", "seller", "user", "guest")';
        }
        if (forSellers) {
            query += ' AND role IN ("admin", "seller")';
        }
        if (forAdmins) {
            query += ' AND role = "admin"';
        }
        if (email) {
            query += ' AND (role = "admin" OR email = ?)';
            params.push(email);
        }
        
        // Fetch subscriptions
        const subscriptions = await new Promise<any[]>((resolve, reject) => {
            db.all(`SELECT DISTINCT endpoint, keys_p256dh, keys_auth FROM subscriptions ${query}`, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            });
        });
        if (subscriptions.length === 0) {
            return res.status(404).json({ message: "No subscriptions found for the specified criteria." });
        }

        // Send notifications
        await Promise.all(
            subscriptions.map(async (subscription) => {
                const pushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.keys_p256dh as string,
                        auth: subscription.keys_auth as string,
                    },
                };

                try {
                    await webpush.sendNotification(pushSubscription as webpush.PushSubscription, notificationPayload);
                } catch (err: any) {
                    console.error("Error sending notification:", err);
                }
            })
        );
        return res.status(200).json({ message: "Notifications sent successfully." });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

