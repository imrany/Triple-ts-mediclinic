import axios from "axios";
import { config } from "dotenv";
import { Request, Response } from "express";
import { Location } from "../../types";
import { sock } from "../..";
import { pool } from "../../postgres";
config();

const APP_URL = process.env.APP_URL as string;
const API_URL = process.env.API_URL as string;
const VILLEBIZ_BUSINESS_GROUP=process.env.VILLEBIZ_BUSINESS_GROUP as string;

async function reply(text: string, from: string, reaction?: string, location?: Location, msg?: any) {
  const messageOptions: any = {
    text: text,
    quoted: msg,
    react:{
        text: reaction || '✅',
    }
  };

  if (location) {
    messageOptions.location = {
      degreesLatitude: location.degreesLatitude,
      degreesLongitude: location.degreesLongitude,
      name: location.name,
      address: location.address
    };
  }

  return (await sock).sendMessage(from, messageOptions);
}

export async function getBusinesses(req: Request, res: Response) {
  try {
    pool.query('SELECT * FROM businesses;', (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: `Failed to get stores` });
        } else {
            const rows = data.rows;
            // Sort data by businesses, businesses with large reviews appears at the top
            rows.sort((a: any, b: any) => b["reviews"] - a["reviews"]);
            return res.json({
                data: rows,
                rows: rows.length,
                columns: rows.length > 0 ? Object.keys(rows[0]).length : 0,
            });
        }
    })
  } catch (error: any) {
    console.error("Error:", error); // Return an error res
    return res.status(500).json({ error: error.message });
  }
}

export async function addBusiness(req: Request, res: Response) {
    try {
        const {
            business_name,
            business_owner,
            location_name,
            location_lat_long,
            business_description,
            till_number,
            paybill,
            paybill_account_number,
            business_logo,
            location_photo,
            phone_number,
            business_email,
            created_at,
        } = req.body;

        const reviews = 0;
        const views = 0;
        const status = "active";
        const paid = 0;

        const result = await pool.query( `
            INSERT INTO businesses (
                business_reference, business_name, business_logo, business_email, business_owner,
                location_name, location_photo, location_lat_long, business_description, till_number,
                paybill, paybill_account_number, phone_number, reviews, created_at, views, status, paid
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
            )
            RETURNING *;
        `
            ,[
                `REF-${Date.now()}`, // Generate a unique reference
                business_name,
                business_logo,
                business_email,
                business_owner,
                location_name,
                location_photo,
                location_lat_long,
                business_description,
                till_number,
                paybill,
                paybill_account_number,
                phone_number,
                reviews,
                created_at,
                views,
                status,
                paid
            ]
        );

        return res.json({
            message: "Store created successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function searchBusiness(req: Request, res: Response) {
    try {
        const { location, owner } = req.query;

        let query = "SELECT * FROM businesses WHERE 1=1";
        const values: any[] = [];

        if (location) {
            query += " AND UPPER(location_name) = UPPER($1)";
            values.push(location);
        }

        if (owner) {
            query += values.length > 0 ? " AND UPPER(business_owner) = UPPER($2)" : " AND UPPER(business_owner) = UPPER($1)";
            values.push(owner);
        }

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            return res.json(result.rows);
        } else {
            const error = owner
                ? `Cannot find a business with owner ${owner}`
                : `Cannot find a business under this location ${location}`;
            return res.status(404).json({ error });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getBusiness(req: Request, res: Response) {
    try {
        const { business_name } = req.params;

        const query = `
            SELECT * FROM businesses WHERE LOWER(business_name) = LOWER($1);
        `;
        const values = [business_name];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `No store under ${business_name} found` });
        }

        const business = result.rows[0];

        const productsQuery = `
            SELECT * FROM products WHERE LOWER(business_name) = LOWER($1) ORDER BY created_at DESC;
        `;
        const productsResult = await pool.query(productsQuery, values);

        const ordersQuery = `
            SELECT * FROM orders WHERE LOWER(business_email) = LOWER($1) ORDER BY created_at DESC;
        `;
        const ordersValues = [business.business_email];
        const ordersResult = await pool.query(ordersQuery, ordersValues);

        const paid = await pool.query(
            "SELECT SUM(seller_total_earned_per_order) as paid FROM orders WHERE business_email = $1 AND (status = 'Paid' OR status = 'Delivered')",
            [ordersValues]
        );

        const TotalEarningsFromDeliveredProducts = await pool.query(
            "SELECT SUM(seller_total_earned_per_order) as paid FROM orders WHERE business_email = $1 AND  status = 'Delivered'",
            [ordersValues]
        );

        const TotalEarningsFromProductsAwaitingDelivered = await pool.query(
            "SELECT SUM(seller_total_earned_per_order) as paid FROM orders WHERE business_email = $1 AND  status = 'Paid'",
            [ordersValues]
        );

        const TotalEarningsFromUnpaidProducts= await pool.query(
            "SELECT SUM(seller_total_earned_per_order) as paid FROM orders WHERE business_email = $1 AND  status = 'Unpaid'",
            [ordersValues]
        );

        const data = {
            "Business Reference": business.business_reference,
            "Business Name": business.business_name,
            "Business Logo": business.business_logo,
            "Business Email": business.business_email,
            "Business Owner": business.business_owner,
            "Location Name": business.location_name,
            "Location Photo": business.location_photo,
            "Location lat_long": business.location_lat_long,
            "Business Description": business.business_description,
            "Till number": business.till_number,
            Paybill: business.paybill,
            "Paybill Account number": business.paybill_account_number,
            "Phone Number": business.phone_number,
            Reviews: business.reviews,
            "Created at": business.created_at,
            Views: business.views,
            Status: business.status,
            Paid: TotalEarningsFromDeliveredProducts.rows[0]?.paid||0,
            "Total Earnings including Undelivered Orders": paid.rows[0]?.paid||0,
            "Total Earnings From Delivered Products": TotalEarningsFromDeliveredProducts.rows[0]?.paid||0,
            "Total Earning From Orders Awaiting Delivery": TotalEarningsFromProductsAwaitingDelivered.rows[0]?.paid||0,
            "Total Amount From Unpaid Orders": TotalEarningsFromUnpaidProducts.rows[0]?.paid||0,
            products: productsResult.rows,
            orders: ordersResult.rows,
        };

        return res.json(data);
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteBusiness(req: Request, res: Response) {
    try {
        const email = req.params.email;
        const queries = [
            `DELETE FROM businesses WHERE LOWER(business_email) = LOWER($1) RETURNING *;`,
            `DELETE FROM products WHERE business_email = $1;`,
            `UPDATE users SET user_type = 'user' WHERE LOWER(email) = LOWER($1);`
        ];
        const values = [email];

        const businessResult = await pool.query(queries[0], values);

        if (businessResult.rows.length === 0) {
            return res.status(404).json({ error: `No record found` });
        }

        try {
            await pool.query(queries[1], [businessResult.rows[0].business_email]);
            await pool.query(queries[2], [businessResult.rows[0].business_email]);
            return res.json({ message: `Business, products, and user type updated successfully` });
        } catch (error) {
            console.error("Error deleting products or updating user type:", error);
            return res.status(500).json({ error: "Failed to delete associated products or update user type" });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function updateBusiness(req: Request, res: Response) {
    try {
        const email = req.params.email;
        const {
            business_name,
            business_owner,
            location_name,
            location_lat_long,
            business_description,
            till_number,
            paybill,
            paybill_account_number,
            business_logo,
            location_photo,
            phone_number,
            reviews,
        } = req.body;

        const query = `
            UPDATE businesses
            SET
                business_name = $1,
                business_owner = $2,
                location_name = $3,
                location_lat_long = $4,
                business_description = $5,
                till_number = $6,
                paybill = $7,
                paybill_account_number = $8,
                business_logo = $9,
                location_photo = $10,
                phone_number = $11,
                reviews = $12
            WHERE LOWER(business_email) = LOWER($13)
            RETURNING *;
        `;
        const values = [
            business_name,
            business_owner,
            location_name,
            location_lat_long,
            business_description,
            till_number,
            paybill,
            paybill_account_number,
            business_logo,
            location_photo,
            phone_number,
            reviews,
            email,
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `No store under ${email} found` });
        }

        const updatedBusiness = result.rows[0];

        await axios.post(`${API_URL}/api/send_notification`, {
            title: `${business_name.replace("_", " ")}'s store has been updated`,
            body: `Check it out, ${business_name.replace("_", " ")}'s store here`,
            link: `${APP_URL}/stores/${business_name}`,
        });

        try {
            await reply(
                `${business_name.replace("_", " ")}'s store has been updated.\n\nCheck it out, ${business_name.replace("_", " ")}'s store here.\n\nClick the link to view:\n\n${API_URL}/stores/${business_name}\n\nThank you for choosing us!\n\nBest regards, The Villebiz Team ${APP_URL}`,
                `${VILLEBIZ_BUSINESS_GROUP}`,
                '🎉'
            );
        } catch (notificationError) {
            console.error('Error sending WhatsApp notifications:', notificationError);
        }

        return res.json({ message: `Store details updated successfully`, data: updatedBusiness });
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
