import axios from "axios";
import { config } from "dotenv";
import { Request, Response } from "express";
import { mapArraytoObj } from "../../lib/google-apis/mapArrayToObj";
import {
  accessSheet,
  deleteRows,
  updateRow,
  writeDataToSheet,
} from "../../lib/google-apis/sheets";
import { Location } from "../../types";
import { sock } from "../..";
import { pool } from "../../postgres";
config();

const businessRange = "businesses!A1:W10000"; // Adjust the range according to your sheet
const productRange = "products!A1:Z10000"; // Adjust the range according to your sheet
const orderRange = "orders!A1:X10000"; // Adjust the range according to your sheet
const spreadsheetId = process.env.RECORDS_SPREADSHEET_ID as string;
const APP_URL = process.env.APP_URL as string;
const API_URL = process.env.API_URL as string;
const VILLEBIZ_BUSINESS_GROUP = process.env.VILLEBIZ_BUSINESS_GROUP as string;

async function reply(text: string, from: string, reaction?: string, location?: Location, msg?: any) {
  const messageOptions: any = {
    text: text,
    quoted: msg,
    react: {
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


export async function migrateBusinessesToDatabase(_: Request, res: Response) {
  try {
    const rows: any = await accessSheet(spreadsheetId, businessRange);
    if (rows.length <= 1) {
      return res.status(400).json({ message: "No business data found to migrate." });
    }

    const businesses = mapArraytoObj(rows);

    for (const business of businesses) {
      if (!business["Business Email"] || !business["Business Name"]) {
        console.warn("Skipping business with missing required fields:", business);
        continue;
      }

      const query = `
        INSERT INTO businesses (
          business_reference, business_name, business_logo, business_email, 
          business_owner, location_name, location_photo, location_lat_long, 
          business_description, till_number, paybill, paybill_account_number, 
          phone_number, reviews, created_at, views, status, paid
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        )
        ON CONFLICT (business_email) DO NOTHING;
      `;

      const values = [
        business["Business Reference"] || "",
        business["Business Name"]?.toString() || "",
        business["Business Logo"]?.toString() || "",
        business["Business Email"]?.toString() || "",
        business["Business Owner"]?.toString() || "",
        business["Location Name"]?.toString() || "",
        business["Location Photo"]?.toString() || "",
        business["Location lat_long"]?.toString() || "",
        business["Business Description"]?.toString() || "",
        parseInt(business["Till number"]) || 0,
        parseInt(business["Paybill"]) || 0,
        business["Paybill Account number"]?.toString() || "",
        business["Phone Number"]?.toString() || "",
        parseInt(business["Reviews"]) || 0,
        business["Created at"] || new Date().toISOString(),
        parseInt(business["Views"]) || 0,
        business["Status"]?.toString() || "active",
        parseFloat(business["Paid"]) || 0
      ];

      await pool.query(query, values);
    }

    res.status(200).json({ message: "Businesses migrated successfully." });
  } catch (error) {
    console.error("Error migrating businesses:", error);
    return res.status(500).json({ error: "Error migrating businesses", details: error });
  }
}

export async function getBusinesses(req: Request, res: Response) {
  try {
    const result: any = await accessSheet(spreadsheetId, businessRange);
    const data = mapArraytoObj(result);
    // Sort data by businesses, businesses with large reviews appears at the top
    data.sort((a: any, b: any) => b["Reviews"] - a["Reviews"]);
    return res.json({
      data,
      rows: result.length - 1,
      columns: result[0].length,
    });
  } catch (error: any) {
    console.error("Error:", error);
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
    
    const rows: any = await accessSheet(spreadsheetId, businessRange);
    
    // Check for duplicate email or business name
    for (const row of rows) {
      if (row.includes(business_email)) {
        return res.status(200).json({
          error: "A store with this email already exists.",
        });
      } else if (row.includes(business_name)) {
        return res.status(200).json({
          error: "A store with this name already exists.",
        });
      }
    }
    
    const reviews = 0;
    const views = 0;
    const status = "active";
    const paid = 0;
    
    const range = `businesses!A${rows.length + 1}`;
    const values = [
      [
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
        paid,
        0, // Balance Including Undelivered Orders
        0, // Total Earnings including Undelivered Orders
        0, // Total Earnings From Delivered Products
        0, // Total Earning From Orders Awaiting Delivery
        0, // Total Amount From Unpaid Orders
      ],
    ];
    
    await writeDataToSheet(spreadsheetId, range, values);
    
    return res.json({
      message: "Store created successfully",
    });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function searchBusiness(req: Request, res: Response) {
  try {
    const { location, owner } = req.query;
    const businessLocation = location as string;
    const businessOwner = owner as string;
    
    const rows: any = await accessSheet(spreadsheetId, businessRange);
    const headerRow = rows[0];
    const businesses = rows.slice(1);
    
    // Filter businesses by search criteria
    const filteredBusinesses = businesses.filter((business: any) => {
      // Business owner is at index 4, Location name is at index 5
      return (
        (!businessOwner || 
          business[4].toUpperCase() === businessOwner.toUpperCase()) &&
        (!businessLocation || 
          business[5].toUpperCase() === businessLocation.toUpperCase())
      );
    });

    // Map filtered rows to business objects
    const data = filteredBusinesses.map((business: any) => {
      const businessObj: any = {};
      headerRow.forEach((header: string, index: number) => {
        businessObj[header] = business[index];
      });
      return businessObj;
    });

    if (filteredBusinesses.length > 0) {
      return res.json(data);
    } else {
      const error = businessOwner
        ? `Cannot find a business with owner ${businessOwner}`
        : `Cannot find a business under this location ${businessLocation}`;
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
    const rows: any = await accessSheet(spreadsheetId, businessRange);
    const headerRow = rows[0];
    
    // Find the row with the specified business name (case insensitive)
    let businessRow = null;
    let rowIndex = -1;
    
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1].toLowerCase() === business_name.toLowerCase()) {
        businessRow = rows[i];
        rowIndex = i;
        break;
      }
    }
    
    if (!businessRow) {
      return res.status(404).json({ error: `No store under ${business_name} found` });
    }
    
    // Create a business object
    const business: any = {};
    headerRow.forEach((header: string, index: number) => {
      if (index < businessRow.length) {
        business[header] = businessRow[index];
      }
    });
    
    // Get products for this business
    const products: any = await accessSheet(spreadsheetId, productRange);
    const productHeaders = products[0];
    
    // Filter products for this business name
    const filteredProducts = products.slice(1).filter(
      (product: any) => product[6].toLowerCase() === business_name.toLowerCase()
    );
    
    // Sort products by Created at (descending)
    filteredProducts.sort(
      (a: any, b: any) => new Date(b[14]).getTime() - new Date(a[14]).getTime()
    );
    
    // Get orders for this business
    const orders: any = await accessSheet(spreadsheetId, orderRange);
    const orderHeaders = orders[0];
    
    // Filter orders for this business email (assuming business email is at index 3)
    const businessEmail = businessRow[3];
    const filteredOrders = orders.slice(1).filter(
      (order: any) => order[18] === businessEmail // Assuming business email is at index 18 in orders
    );
    
    // Sort orders by Created at (descending)
    filteredOrders.sort(
      (a: any, b: any) => new Date(b[6]).getTime() - new Date(a[6]).getTime()
    );
    
    // Calculate earnings and financials
    const paidOrders = filteredOrders.filter(
      (order: any) => order[7] === 'Paid' || order[7] === 'Delivered'
    );
    
    const deliveredOrders = filteredOrders.filter(
      (order: any) => order[7] === 'Delivered'
    );
    
    const paidAwaitingDelivery = filteredOrders.filter(
      (order: any) => order[7] === 'Paid'
    );
    
    const unpaidOrders = filteredOrders.filter(
      (order: any) => order[7] === 'Unpaid'
    );
    
    // Calculate total earnings
    const totalPaid = paidOrders.reduce(
      (sum: number, order: any) => sum + parseFloat(order[4] || 0), 0
    );
    
    const totalDelivered = deliveredOrders.reduce(
      (sum: number, order: any) => sum + parseFloat(order[4] || 0), 0
    );
    
    const totalAwaitingDelivery = paidAwaitingDelivery.reduce(
      (sum: number, order: any) => sum + parseFloat(order[4] || 0), 0
    );
    
    const totalUnpaid = unpaidOrders.reduce(
      (sum: number, order: any) => sum + parseFloat(order[4] || 0), 0
    );
    
    // Map products and orders to objects
    const mappedProducts = filteredProducts.map((product: any) => {
      const productObj: any = {};
      productHeaders.forEach((header: string, index: number) => {
        if (index < product.length) {
          productObj[header] = product[index];
        }
      });
      return productObj;
    });
    
    const mappedOrders = filteredOrders.map((order: any) => {
      const orderObj: any = {};
      orderHeaders.forEach((header: string, index: number) => {
        if (index < order.length) {
          orderObj[header] = order[index];
        }
      });
      return orderObj;
    });
    
    // Construct the final response object
    const data = {
      "Business Reference": business["Business Reference"],
      "Business Name": business["Business Name"],
      "Business Logo": business["Business Logo"],
      "Business Email": business["Business Email"],
      "Business Owner": business["Business Owner"],
      "Location Name": business["Location Name"],
      "Location Photo": business["Location Photo"],
      "Location lat_long": business["Location lat_long"],
      "Business Description": business["Business Description"],
      "Till number": business["Till number"],
      "Paybill": business["Paybill"],
      "Paybill Account number": business["Paybill Account number"],
      "Phone Number": business["Phone Number"],
      "Reviews": business["Reviews"],
      "Created at": business["Created at"],
      "Views": business["Views"],
      "Status": business["Status"],
      "Paid": totalDelivered,
      "Total Earnings including Undelivered Orders": totalPaid,
      "Total Earnings From Delivered Products": totalDelivered,
      "Total Earning From Orders Awaiting Delivery": totalAwaitingDelivery,
      "Total Amount From Unpaid Orders": totalUnpaid,
      products: mappedProducts,
      orders: mappedOrders,
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
    const rows: any = await accessSheet(spreadsheetId, businessRange);
    const products: any = await accessSheet(spreadsheetId, productRange);
    const orders: any = await accessSheet(spreadsheetId, orderRange);

    // Find the row index with the specified email
    let rowIndexToDelete = -1;
    let businessName = "";

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][3].toLowerCase() === email.toLowerCase()) {
        rowIndexToDelete = i;
        businessName = rows[i][1];
        break;
      }
    }

    if (rowIndexToDelete === -1) {
      return res.status(404).json({ error: `No record found` });
    }

    // Check if the business has any paid orders
    const hasPaidOrders = orders.slice(1).some(
      (order: any) =>
        order[18] === email && // Assuming business email is at index 18 in orders
        (order[7] === "Paid") // Assuming order status is at index 7
    );

    if (hasPaidOrders) {
      return res.status(400).json({
        error: `Cannot delete business with undelivered orders.`,
      });
    }

    // Delete all products associated with the business
    const productRowsToDelete = [];
    for (let i = 1; i < products.length; i++) {
      if (products[i][6] === businessName) {
      productRowsToDelete.push(i);
      }
    }

    // Delete products in reverse order (to maintain correct indexing)
    for (const productRowIndex of productRowsToDelete.reverse()) {
      await deleteRows(
      spreadsheetId,
      "products",
      productRowIndex,
      productRowIndex + 1
      );
    }

    // Delete all orders associated with the business
    const orderRowsToDelete = [];
    for (let i = 1; i < orders.length; i++) {
      if (orders[i][18] === email) { // Assuming business email is at index 18 in orders
      orderRowsToDelete.push(i);
      }
    }

    // Delete orders in reverse order (to maintain correct indexing)
    for (const orderRowIndex of orderRowsToDelete.reverse()) {
      await deleteRows(
      spreadsheetId,
      "orders",
      orderRowIndex,
      orderRowIndex + 1
      );
    }

    // Delete the business
    await deleteRows(
      spreadsheetId,
      "businesses",
      rowIndexToDelete,
      rowIndexToDelete + 1
    );

    // Update user type to "user"
    const userRows: any = await accessSheet(spreadsheetId, "users!A1:Z10000");
    let userRowIndexToUpdate = -1;

    for (let i = 1; i < userRows.length; i++) {
      if (userRows[i][2].toLowerCase() === email.toLowerCase()) {
        userRowIndexToUpdate = i;
        break;
      }
    }

    if (userRowIndexToUpdate !== -1) {
      const userRange = `users!A${userRowIndexToUpdate + 1}:Z${userRowIndexToUpdate + 1}`;
      const updatedUserRow = [...userRows[userRowIndexToUpdate]];
      updatedUserRow[3] = "user"; // Assuming column 4 (index 3) is the user type
      await updateRow(spreadsheetId, userRange, updatedUserRow);
    }

    return res.json({
      message: `Business, products, and user type updated successfully`,
    });
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
    
    const rows: any = await accessSheet(spreadsheetId, businessRange);
    
    // Find the row index with the specified email
    let rowIndexToUpdate = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][3].toLowerCase() === email.toLowerCase()) {
        rowIndexToUpdate = i;
        break;
      }
    }
    
    if (rowIndexToUpdate === -1) {
      return res.status(404).json({ error: `No store under ${email} found` });
    }
    
    const range = `businesses!A${rowIndexToUpdate + 1}:W${rowIndexToUpdate + 1}`;
    const updatedRow = [...rows[rowIndexToUpdate]]; // Clone the existing row
    
    // Update the specific fields
    updatedRow[1] = business_name;
    updatedRow[2] = business_logo;
    updatedRow[4] = business_owner;
    updatedRow[5] = location_name;
    updatedRow[6] = location_photo;
    updatedRow[7] = location_lat_long;
    updatedRow[8] = business_description;
    updatedRow[9] = till_number;
    updatedRow[10] = paybill;
    updatedRow[11] = paybill_account_number;
    updatedRow[12] = phone_number;
    updatedRow[13] = reviews;
    
    await updateRow(spreadsheetId, range, updatedRow);
    
    // Send notifications
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
    
    return res.json({ 
      message: `Store details updated successfully`, 
      data: {
        "Business Reference": updatedRow[0],
        "Business Name": updatedRow[1],
        "Business Logo": updatedRow[2],
        "Business Email": updatedRow[3],
        "Business Owner": updatedRow[4],
        "Location Name": updatedRow[5],
        "Location Photo": updatedRow[6],
        "Location lat_long": updatedRow[7],
        "Business Description": updatedRow[8],
        "Till number": updatedRow[9],
        "Paybill": updatedRow[10],
        "Paybill Account number": updatedRow[11],
        "Phone Number": updatedRow[12],
        "Reviews": updatedRow[13],
        "Created at": updatedRow[14],
        "Views": updatedRow[15],
        "Status": updatedRow[16],
      }
    });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}