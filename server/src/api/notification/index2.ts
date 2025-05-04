import { Request, Response } from "express";
import { config } from "dotenv";
import { isDate, parse } from "date-fns";
import { pool } from "../../postgres";
config();

export async function sendMessage(req: Request, res: Response) {
  try {
    const { notification_ref, body, title, icon, to, from } = req.body;
    pool.query(`INSERT INTO notifications (notification_reference, body, to, from, title, icon ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,[
        notification_ref,
        body,
        to,
        from,
        title,
        icon
    ],(error,results)=>{
        if(error){
            console.log(error)
            return res.status(500).json({error:"Failed to send notice"})
        }else{
            return res.json({message:"Notifice sent"})
        }
    })
  } catch (error: any) {
    console.error("Error:", error); // Return an error response
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteNotificationByRef(req: Request,res:Response) {
    try{
        const { reference } = req.params
        const result = await pool.query(`DELETE FROM notifications WHERE notification_reference = $1;`, [reference]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: `No rnotice found` });
        }

        return res.json({message:`notification delete successfull`})
    }catch(error:any){
      console.error('Error:', error); // Return an error response
      return res.status(500).json({ error: error.message });
    }
}

export async function getAllUserNotifications(req: Request, res: Response) {
  try {
    const { email } = req.params;
    if (email) {
      const result = await pool.query(`SELECT * FROM notifications WHERE to = $1;`, [email]);
      const notifications = result.rows;

      // Sort notifications by 'sent_on' date in descending order
      notifications.sort((a: any, b: any) => new Date(b.sent_on).getTime() - new Date(a.sent_on).getTime());
      return res.json({ notifications });

    } else {
      return res.status(401).json({ error: "You are not authorized" });
    }
  } catch (error: any) {
    console.error("Error:", error); // Return an error response
    return res.status(500).json({ error: error.message });
  }
}
export async function getUserNotificationByRef(req: Request, res: Response) {
    try {
        const { email } = req.params;
        if (email) {
            const result = await pool.query(`SELECT * FROM notifications WHERE "to" = $1;`, [email]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: `No notification found, create account instead` });
            }
            return res.json({ notifications: result.rows });
        } else {
            return res.status(401).json({ error: "You are not authorized" });
        }
    } catch (error: any) {
        console.error("Error:", error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function getNotificationByRef(req: Request, res: Response) {
    try {
        const { reference } = req.params;
        const result = await pool.query(`SELECT * FROM notifications WHERE notification_reference = $1;`, [reference]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: `No notification found with reference ${reference}` });
        }
        return res.json({ notification: result.rows[0] });
    } catch (error: any) {
        console.error("Error:", error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function getNotifications(req: Request, res: Response) {
    try {
        const result = await pool.query(`SELECT * FROM notifications;`);
        const notifications = result.rows;

        // Ensure date format consistency and parse dates if necessary
        notifications.forEach((item: any) => {
            if (typeof item.sent_on === "string" && !isDate(new Date(item.sent_on))) {
                const parsedDate = parse(item.sent_on, "dd/MM/yyyy", new Date());
                item.sent_on = parsedDate.toISOString().slice(0, 10); // Convert to ISO format
            }
        });

        // Sort data by 'sent_on' date in descending order
        notifications.sort((a: any, b: any) => new Date(b.sent_on).getTime() - new Date(a.sent_on).getTime());
        return res.json({
            notifications,
            rows: notifications.length,
        });
    } catch (error: any) {
        console.error("Error:", error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function updateNotificationByRef(req: Request, res: Response) {
    try {
        const { reference } = req.params;
        const { body, title, opened_on } = req.body;
        await pool.query(
            `UPDATE notifications SET body = $1, title = $2, opened_on = $3 WHERE notification_reference = $4;`,
            [body, title, opened_on, reference]
        );

        return res.json({ message: `Notification updated successfully` });
    } catch (error: any) {
        console.error("Error:", error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}
