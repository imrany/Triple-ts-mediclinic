import { config } from "dotenv";
import { Request, Response } from "express";
import { mapArraytoObj } from "../../lib/google-apis/mapArrayToObj";
import {
  accessSheet,
} from "../../lib/google-apis/sheets";
import { isDate, parse } from "date-fns";
import { pool } from "../../postgres";
config();

const advertsRange = "adverts!A1:G10000"; // Adjust the range according to your sheet
const spreadsheetId = process.env.RECORDS_SPREADSHEET_ID as string;

export async function migrateAdvertsToPg(adverts: any[]) {
  try {
    for (const advert of adverts) {
      const { 
        "Created at": CreatedAt, 
        "Advert Reference": AdvertReference, 
        Media, 
        Link, 
        Type, 
        "Business Email": BusinessEmail,
        Filetype
      } = advert;

      await pool.query(
      `INSERT INTO adverts (
        advert_reference, 
        media, 
        link, 
        type, 
        business_email, 
        created_at,
        file_type
      )
      VALUES ($1, $2, $3, $4, $5, $6,$7)
      ON CONFLICT (advert_reference) DO NOTHING`,
      [
        AdvertReference, 
        Media, 
        Link || '/', 
        Type || 'in-app', 
        BusinessEmail||"", 
        CreatedAt || new Date().toISOString(),
        Filetype
      ]
      );

      // Ensure required fields are not null
      if (!AdvertReference || !Media || !BusinessEmail) {
        throw new Error("Missing required fields: advert_reference, image, or business_email");
      }
    }

    console.log("Adverts migrated successfully.");
  } catch (error) {
    console.error("Error migrating adverts:", error);
    throw error;
  }
}

export async function handleMigrateAdverts(req: Request, res: Response) {
  try {
    const result: any = await accessSheet(spreadsheetId, advertsRange);
    const data = mapArraytoObj(result);

    // Ensure date format consistency and parse dates if necessary
    data.forEach((item: any) => {
      if (typeof item['Created at'] === 'string' && !isDate(new Date(item['Created at']))) {
        const parsedDate = parse(item['Created at'], 'dd/MM/yyyy', new Date());
        item['Created at'] = parsedDate.toISOString().slice(0, 10);
      }
    });

    await migrateAdvertsToPg(data);

    return res.json({ message: "Adverts migrated successfully." });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getAdverts(req: Request, res: Response) {
  try {
    const result:any = await accessSheet(spreadsheetId, advertsRange)
    const data=mapArraytoObj(result)

    // Ensure date format consistency and parse dates if necessary 
    data.forEach((item:any) => { 
        if (typeof item['Created at'] === 'string' && !isDate(new Date(item['Created at']))) { 
            // Parse non-ISO date format (e.g., 'dd/mm/yyyy') 
            const parsedDate = parse(item['Created at'], 'dd/MM/yyyy', new Date()); item['Created at'] = parsedDate.toISOString().slice(0, 10); // Convert to ISO format 
        } 
    });

    // Sort data by 'Created at' date in descending order 
    data.sort((a: any, b: any) => new Date(b['Created at']).getTime() - new Date(a['Created at']).getTime());
    
    return res.json({
        data,
        rows:result.length,
        columns:result[0].length,
    })
  } catch (error: any) {
    console.error("Error:", error); // Return an error res
    return res.status(500).json({ error: error.message });
  }
}