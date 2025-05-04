import { config } from "dotenv";
import { Request, Response } from "express";
import { isDate, parse } from "date-fns";
import { pool } from "../../postgres";
import { v4 as uuidv4 } from 'uuid';
import { deleteFileFromDrive } from "../../lib/google-apis/drive";
config();

export async function getAdverts(_: Request, res: Response) {
  try {
    pool.query('SELECT * FROM adverts;', (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: `Failed to get adverts` });
        } else {
            const rows = data.rows;
            // Ensure date format consistency and parse dates if necessary 
            rows.forEach((item: any) => { 
                if (typeof item['created_at'] === 'string' && !isDate(new Date(item['created_at']))) { 
                    // Parse non-ISO date format (e.g., 'dd/mm/yyyy') 
                    const parsedDate = parse(item['created_at'], 'dd/MM/yyyy', new Date()); 
                    item['created_at'] = parsedDate.toISOString().slice(0, 10); // Convert to ISO format 
                } 
            });
        
            // Sort data by 'created_at' date in descending order 
            rows.sort((a: any, b: any) => new Date(b['created_at']).getTime() - new Date(a['created_at']).getTime());
            
            return res.json({
                data: rows,
                rows: rows.length,
                columns: rows.length > 0 ? Object.keys(rows[0]).length : 0,
            });
        }
    });
  } catch (error: any) {
    console.error("Error:", error); // Return an error res
    return res.status(500).json({ error: error.message });
  }
}

export async function insertAdverts(req: Request, res: Response) {
  try {
    const {media, link, type, email, fileType}=req.body
    const reference = `AD-${uuidv4().trim().split("-")[0]}`; // Generate a unique reference
    pool.query('INSERT INTO adverts (advert_reference, media, link, type, business_email, file_type) VALUES ($1, $2, $3, $4, $5, $6);',[reference,media,link, type, email, fileType], (error, data) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: `Failed to insert advert`, details:error });
      } else {
        return res.json({message:"Advert added successfully"});
      }
    });
  } catch (error: any) {
    console.error("Error:", error); // Return an error res
    return res.status(500).json({ error: error.message });
  }
}

export async function updateAdvert(req: Request, res: Response) {
  try {
    const {reference}=req.params;
    const {media, link, type, fileType} =req.body
    pool.query('UPDATE adverts SET media=$1, link=$2, type=$4, file_type=$5 WHERE advert_reference=$3;',[media, link, reference, type, fileType], (error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: `Failed to update advert`, details:error });
        } else {
            return res.json({message:"Advert updated successfully"});
        }
    });
  } catch (error: any) {
    console.error("Error:", error); // Return an error res
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteAdvertByRef(req: Request, res: Response) {
  try {
    const {reference}=req.params;
    pool.query('DELETE FROM adverts WHERE advert_reference=$1 RETURNING *;',[reference], async(error,data) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: `Failed to delete advert`, details:error });
        } else {
          await deleteFileFromDrive(data.rows[0].media)
          return res.json({message:"Advert deleted successfully"});
        }
    });
  } catch (error: any) {
    console.error("Error:", error); // Return an error res
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteAdvertByEmail(req: Request, res: Response) {
  try {
    const {email}=req.params;
    pool.query('DELETE FROM adverts WHERE business_email=$1 RETURNING *;',[email], async(error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: `Failed to delete advert`, details:error });
        } else {
          const adverts=data.rows
          adverts.forEach(async(advert:any)=>{
            await deleteFileFromDrive(advert.media)
          })
          return res.json({message:"Advert deleted successfully"});
        }
    });
  } catch (error: any) {
    console.error("Error:", error); // Return an error res
    return res.status(500).json({ error: error.message });
  }
}
