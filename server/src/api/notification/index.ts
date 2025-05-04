import { pool } from "../../postgres";
import { Request, Response } from "express";
import {
  accessSheet,
  writeDataToSheet,
  updateRow,
  deleteRows,
} from "../../lib/google-apis/sheets";
import { config } from "dotenv";
import { mapArraytoObj } from "../../lib/google-apis/mapArrayToObj";
import { isDate, parse } from "date-fns";
config();

const spreadsheetId = process.env.RECORDS_SPREADSHEET_ID as string;
const notificationRange = "notifications!A1:H10000";

export async function migrateNotificationsToPG(req: Request, res: Response) {
  try {
    const rows: any = await accessSheet(spreadsheetId, notificationRange);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No notifications found to migrate" });
    }

    try {
      for (let i = 1; i < rows.length; i++) {
        const [
          notification_ref,
          body,
          to,
          from,
          title,
          icon,
          sent_on,
          opened_on,
        ] = rows[i];

        const query = `
          INSERT INTO notifications (
            notification_reference,
            body,
            "to",
            "from",
            title,
            icon,
            sent_on,
            opened_on
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (notification_reference) DO NOTHING;
        `;

        await pool.query(query, [
          notification_ref,
          body,
          to,
          from,
          title,
          icon,
          sent_on,
          opened_on
        ]);
      }

      return res.json({ message: "Notifications migrated successfully" });
    } catch (error) {
      console.error("Error during migration:", error);
      return res.status(500).json({ error: "Migration failed" });
    } 
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const { notification_ref, body, title, icon, to, from } = req.body;
    const rows: any = await accessSheet(spreadsheetId, notificationRange);
    
    // Check if notification already exists
    let existingRowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === notification_ref) {
        existingRowIndex = i;
        break;
      }
    }
    
    if (existingRowIndex !== -1) {
      return res.status(400).json({ error: "This notification already exists" });
    }
    
    // Create new notification at the end of the sheet
    const newRowIndex = rows.length + 1;
    const range = `notifications!A${newRowIndex}`;
    const sent_on = new Date().toISOString();
    
    const values = [
      [
        notification_ref,
        body,
        to,
        from,
        title,
        icon,
        sent_on,
        null // opened_on is initially null
      ]
    ];
    
    await writeDataToSheet(spreadsheetId, range, values);
    return res.json({ message: "Notice sent" });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteNotificationByRef(req: Request, res: Response) {
  try {
    const { reference } = req.params;
    const rows: any = await accessSheet(spreadsheetId, notificationRange);
    
    // Find the row index with the specific reference
    let rowIndexToDelete = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === reference) {
        rowIndexToDelete = i;
        break;
      }
    }
    
    if (rowIndexToDelete === -1) {
      return res.status(404).json({ error: "No notice found" });
    }
    
    // Delete the row
    const result = await deleteRows(spreadsheetId, 'notifications', rowIndexToDelete, rowIndexToDelete + 1);
    
    if (result) {
      return res.json({ message: "Notification delete successful" });
    } else {
      return res.status(500).json({ error: "Failed to delete notification" });
    }
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getAllUserNotifications(req: Request, res: Response) {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(401).json({ error: "You are not authorized" });
    }
    
    const rows: any = await accessSheet(spreadsheetId, notificationRange);
    const notifications: any[] = [];
    
    // Skip header row (i=1)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][2] === email) { // Check if notification is for this email (to field)
        const notification = {
          notification_reference: rows[i][0],
          body: rows[i][1],
          to: rows[i][2],
          from: rows[i][3],
          title: rows[i][4],
          icon: rows[i][5],
          sent_on: rows[i][6],
          opened_on: rows[i][7]
        };
        notifications.push(notification);
      }
    }
    
    // Sort notifications by 'sent_on' date in descending order
    notifications.sort((a: any, b: any) => 
      new Date(b.sent_on).getTime() - new Date(a.sent_on).getTime()
    );
    
    return res.json({ notifications });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getUserNotificationByRef(req: Request, res: Response) {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(401).json({ error: "You are not authorized" });
    }
    
    const rows: any = await accessSheet(spreadsheetId, notificationRange);
    const notifications: any[] = [];
    
    // Skip header row (i=1)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][2] === email) { // Check if notification is for this email (to field)
        const notification = {
          notification_reference: rows[i][0],
          body: rows[i][1],
          to: rows[i][2],
          from: rows[i][3],
          title: rows[i][4],
          icon: rows[i][5],
          sent_on: rows[i][6],
          opened_on: rows[i][7]
        };
        notifications.push(notification);
      }
    }
    
    if (notifications.length === 0) {
      return res.status(404).json({ error: "No notification found, create account instead" });
    }
    
    return res.json({ notifications });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getNotificationByRef(req: Request, res: Response) {
  try {
    const { reference } = req.params;
    const rows: any = await accessSheet(spreadsheetId, notificationRange);
    
    // Skip header row (i=1)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === reference) {
        const notification = {
          notification_reference: rows[i][0],
          body: rows[i][1],
          to: rows[i][2],
          from: rows[i][3],
          title: rows[i][4],
          icon: rows[i][5],
          sent_on: rows[i][6],
          opened_on: rows[i][7]
        };
        
        return res.json({ notification });
      }
    }
    
    return res.status(404).json({ error: `No notification found with reference ${reference}` });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getNotifications(req: Request, res: Response) {
  try {
    const result: any = await accessSheet(spreadsheetId, notificationRange);
    
    if (!result || result.length <= 1) {
      return res.json({
        notifications: [],
        rows: 0
      });
    }
    
    const data = mapArraytoObj(result);
    
    // Ensure date format consistency and parse dates if necessary
    data.forEach((item: any) => {
      if (typeof item.sent_on === 'string' && !isDate(new Date(item.sent_on))) {
        // Parse non-ISO date format (e.g., 'dd/MM/yyyy')
        const parsedDate = parse(item.sent_on, 'dd/MM/yyyy', new Date());
        item.sent_on = parsedDate.toISOString().slice(0, 10); // Convert to ISO format
      }
    });
    
    // Sort data by 'sent_on' date in descending order
    data.sort((a: any, b: any) => 
      new Date(b.sent_on).getTime() - new Date(a.sent_on).getTime()
    );
    
    return res.json({
      notifications: data,
      rows: data.length
    });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export async function updateNotificationByRef(req: Request, res: Response) {
  try {
    const { reference } = req.params;
    const { body, title, opened_on } = req.body;
    
    const rows: any = await accessSheet(spreadsheetId, notificationRange);
    
    // Find the row with matching reference
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === reference) {
        rowIndex = i + 1; // +1 because sheets are 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: "No notification found" });
    }
    
    // Construct updated row values
    const updatedValues = [
      reference,                // notification_reference (unchanged)
      body || rows[rowIndex-1][1], // use new body or keep old if not provided
      rows[rowIndex-1][2],      // to (unchanged)
      rows[rowIndex-1][3],      // from (unchanged)
      title || rows[rowIndex-1][4], // use new title or keep old if not provided
      rows[rowIndex-1][5],      // icon (unchanged)
      rows[rowIndex-1][6],      // sent_on (unchanged)
      opened_on || rows[rowIndex-1][7] // use new opened_on or keep old if not provided
    ];
    
    const range = `notifications!A${rowIndex}:H${rowIndex}`;
    await updateRow(spreadsheetId, range, updatedValues);
    
    return res.json({ message: "Notification updated successfully" });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Optional function to migrate from PostgreSQL to Google Sheets
export async function migrateFromPG(req: Request, res: Response) {
  try {
    const { pgData } = req.body;
    
    if (!pgData || !Array.isArray(pgData)) {
      return res.status(400).json({ error: "Invalid data format" });
    }
    
    // Get existing data to determine where to start
    const rows: any = await accessSheet(spreadsheetId, notificationRange);
    const startRow = rows.length + 1;
    
    // Prepare data for insertion
    const values = pgData.map(notification => [
      notification.notification_reference,
      notification.body,
      notification.to,
      notification.from,
      notification.title,
      notification.icon,
      notification.sent_on,
      notification.opened_on
    ]);
    
    const range = `notifications!A${startRow}`;
    await writeDataToSheet(spreadsheetId, range, values);
    
    return res.json({ message: "Data migrated successfully" });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}