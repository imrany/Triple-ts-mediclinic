import { pool } from '../../postgres';
import { Request, Response } from 'express';
import formidable from "formidable";
import { mapArraytoObj } from "../../lib/google-apis/mapArrayToObj";
import { accessSheet, writeDataToSheet, deleteRows, updateRow } from "../../lib/google-apis/sheets";
import { parse, isDate } from 'date-fns';
import axios from "axios"
import { config } from "dotenv"
config()

const productRange = 'products!A1:Z10000'; // Adjust the range according to your sheet
const businessRange = "businesses!A1:W10000"; // Adjust the range according to your sheet
const orderRange = 'orders!A1:T10000'; // Adjust the range according to your sheet
const spreadsheetId = process.env.RECORDS_SPREADSHEET_ID as string
const APP_URL=process.env.APP_URL as string;
const API_URL=process.env.API_URL as string;
const VILLEBIZ_BUSINESS_GROUP=process.env.VILLEBIZ_BUSINESS_GROUP as string;


export async function migrateProductsToPG(req: Request, res: Response) {
    try {
        const rows: any = await accessSheet(spreadsheetId, productRange);
        try {
            for (let i = 1; i < rows.length; i++) {
                const product = rows[i];
                const query = `
                    INSERT INTO products (
                        product_reference, product_photo, product_category, product_name, product_description,
                        product_price, created_at, views, business_email, discount_code,
                        discount, availability, updated_at, colours, sizes, store_ref, original_price
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
                    )
                    ON CONFLICT (product_reference) DO NOTHING;
                `;

                const values = [
                    product[0], JSON.stringify(product[1] || [""]), product[2], product[3], product[4],
                    parseInt(product[5] || "0"), product[14] ? new Date(product[14]).toISOString() : new Date().toISOString(), parseInt(product[15] || "0"), product[17], product[18],
                    parseInt(product[19] || "0"), product[20] || "available", product[21] ? new Date(product[21]).toISOString() : new Date().toISOString(), product[22] || null, product[23] || null,
                    product[24], parseInt(product[25] || "0")
                ];

                await pool.query(query, values);
            }

            res.json({ message: 'Products migrated successfully to PostgreSQL database.' });
        } catch (error) {
            console.error('Error during migration:', error);
            res.status(500).json({ error: 'Error during migration.', details:error });
        } 
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getProducts(req: Request,res:Response) {
    try{
        const result:any = await accessSheet(spreadsheetId, productRange)
        const data=mapArraytoObj(result)

        // Ensure date format consistency and parse dates if necessary 
        data.forEach((item:any) => { 
            if (typeof item['Updated at'] === 'string' && !isDate(new Date(item['Updated at']))) { 
                // Parse non-ISO date format (e.g., 'dd/mm/yyyy') 
                const parsedDate = parse(item['Updated at'] || "", 'dd/MM/yyyy', new Date()); 
                item['Updated at'] = parsedDate.toISOString().slice(0, 10); // Convert to ISO format 
            } 
        });

        // Sort data by 'Updated at' date in descending order 
        // Calculate product sales and ratings
        data.forEach((item: any) => {
            const productOrders = result.filter((row: any) => row['Product Reference'] === item['Product Reference']);
            const deliveredOrders = productOrders.filter((order: any) => order['Order Status'] === 'Delivered');
            item['Product Sales'] = deliveredOrders.length;

            const totalOrders = productOrders.length;
            item['Product Rating'] = totalOrders >= 10 ? 5 : (totalOrders / 10) * 5;
        });

        // Sort data by 'Updated at' date in descending order
        data.sort((a: any, b: any) => new Date(b['Updated at']).getTime() - new Date(a['Updated at']).getTime());
        
        // Extract all unique product categories 
        const categories = [...new Set(data.map((item: any) => item['Product Category']))];

        return res.json({
            data,
            rows:result.length,
            categories,
        })
    }catch(error:any){
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function search(req: Request, res: Response) {
    try {
        const { category, name, location, business } = req.query;
        const productName = name as string | undefined;
        const productLocation = location as string | undefined;
        const businessName = business as string | undefined;

        const rows: any = await accessSheet(spreadsheetId, productRange);
        const businessRow: any = await accessSheet(spreadsheetId, businessRange);
        const products = rows.slice(1);
        
        // Filter products by search
        const filteredProducts = products.filter((product: any) => {
            return (
                (!businessName || product[6].toUpperCase().includes(businessName.toUpperCase())) && 
                (!productLocation || product[7].toUpperCase().includes(productLocation.toUpperCase())) && 
                (!productName || product[3].toUpperCase().includes(productName.toUpperCase())) && 
                (!category || product[2].toUpperCase() === (category as string).toUpperCase())
            );
        });

        if (filteredProducts.length > 0) {
            const data = filteredProducts.map((product: any) => {
                // Find the corresponding business for each product
                let businessRowIndex = -1;
                for (let i = 0; i < businessRow.length; i++) {
                    if (businessRow[i][0] === product[24]) {
                        businessRowIndex = i;
                        break;
                    }
                }

                // Handle case where business isn't found
                if (businessRowIndex === -1) {
                    return {
                        'Product Reference': product[0] || "",
                        'Product Photo': product[1] || "",
                        'Product Category': product[2] || "",
                        'Product Name': product[3] || "",
                        'Product Description': product[4] || "",
                        'Product Price': product[5] || "",
                        'Business Name': product[6] || "",
                        'Business Location': product[7] || "",
                        'Business reference': product[24] || "",
                    };
                }

                // Return product with business data
                return {
                    'Product Reference': product[0] || "",
                    'Product Photo': product[1] || "",
                    'Product Category': product[2] || "",
                    'Product Name': product[3] || "",
                    'Product Description': product[4] || "",
                    'Product Price': product[5] || "",
                    'Business Name': businessRow[businessRowIndex][1] || "",
                    'Business Location': businessRow[businessRowIndex][5] || "",
                    'Business Phone Number': businessRow[businessRowIndex][12] || "",
                    'Business Till Number': businessRow[businessRowIndex][9] || "",
                    'Business Paybill': businessRow[businessRowIndex][10] || "",
                    'Business Paybill Account Number': businessRow[businessRowIndex][11] || "",
                    'Business Location Photo': businessRow[businessRowIndex][6] || "",
                    'Business Location Lat Long': businessRow[businessRowIndex][7] || "",
                    'Business Email': businessRow[businessRowIndex][3] || "",
                    'Availability': product[20] || "",
                    'Colors': product[22] || "",
                    'Sizes': product[23] || "",
                    'Business reference': product[24] || "",
                    'Original Price': product[25] || "",
                };
            });

            // Calculate product sales and ratings
            data.forEach((item: any) => {
                const productOrders = rows.filter((row: any) => row[0] === item['Product Reference']);
                const deliveredOrders = productOrders.filter((order: any) => order[7] === 'Delivered');
                item['product_sales'] = deliveredOrders.length;

                const totalOrders = productOrders.length;
                item['product_rating'] = totalOrders >= 100 ? 5 : (totalOrders / 100) * 5;
            });

            return res.json(data);
        } else {
            const error = category
                ? `Cannot find a product under category ${category}`
                : productName ? `Cannot find a product with name ${productName}`
                : productLocation ? `Cannot find a product under this location ${productLocation}`
                : `Cannot find a product by ${businessName}`;
            return res.status(404).json({ error });
        }
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function addProduct(req: Request, res: Response) {
    try {
        const form = formidable({
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024 // 10MB
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing the form:', err);
                return res.status(400).json({ error: 'Error parsing the form' });
            }

            const field: any = fields;
            const product_reference = field.product_reference[0];
            const product_category = field.product_category[0];
            const product_photo_id = field.product_photo_id[0];
            const product_name = field.product_name[0];
            const product_description = field.product_description[0];
            const product_price = Number(field.product_price[0]);
            const original_price = Number(field.original_price[0]);
            const created_at = field.created_at[0];
            const business_email = field.business_email[0];
            const discount_code = field.discount_code[0];
            const discount = field.discount[0];
            const colors = (product_category === "Shoes" || product_category === "Slides") ? field.colors[0] : "";
            const sizes = (product_category === "Shoes" || product_category === "Slides") ? field.sizes[0] : "";
            const store_ref = field.store_ref[0];

            // Get business info from business sheet
            const businessRows: any = await accessSheet(spreadsheetId, businessRange);
            let businessRow = null;
            
            for (let i = 1; i < businessRows.length; i++) {
                if (businessRows[i][3] === business_email) {
                    businessRow = businessRows[i];
                    break;
                }
            }
            
            if (!businessRow) {
                return res.status(404).json({ error: "No business found with the provided email" });
            }

            const business_name = businessRow[1];
            const business_location = businessRow[5];
            const business_phone_number = businessRow[12];
            const business_till_number = businessRow[9];
            const business_paybill = businessRow[10];
            const business_paybill_account_number = businessRow[11];
            const business_location_photo = businessRow[6];
            const business_location_lat_long = businessRow[7];

            // Check if the product reference already exists
            const rows: any = await accessSheet(spreadsheetId, productRange);
            for (const row of rows) {
                if (row.includes(`REF-${product_reference}`)) {
                    return res.status(200).json({
                        error: "A product with this reference already exists.",
                    });
                }
            }

            const range = `products!A${rows.length + 1}`; // Starting cell for data
            const values = [
                [
                    `REF-${product_reference}`,
                    product_photo_id, product_category, product_name, product_description,
                    product_price, business_name, business_location, business_phone_number,
                    business_till_number, business_paybill, business_paybill_account_number,
                    business_location_photo, business_location_lat_long, created_at, 0, 0, business_email, discount_code,
                    discount, "available", created_at, colors, sizes, store_ref, original_price
                ]
            ];

            await writeDataToSheet(spreadsheetId, range, values);

            // Send response immediately after writing to the sheet
            res.json({
                message: "Product added successfully"
            });
        });
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getProductByRef(req: Request, res: Response) {
    try {
        const { reference } = req.params;
        const rows: any = await accessSheet(spreadsheetId, productRange);
        const businessRow: any = await accessSheet(spreadsheetId, businessRange);
        
        // Find the row index with the specific value 
        let rowIndex = -1; 
        for (let i = 0; i < rows.length; i++) { 
            if (rows[i][0] === reference) { 
                rowIndex = i; 
                break; 
            } 
        } 

        if (rowIndex === -1) { 
            return res.status(404).json({ error: `No record found with reference ${reference}` });
        }

        // Find the business row
        let businessRowIndex = -1; 
        for (let i = 0; i < businessRow.length; i++) { 
            if (businessRow[i][0] === rows[rowIndex][24]) { 
                businessRowIndex = i; 
                break; 
            } 
        }

        // Fetch order rows
        const orderRows: any = await accessSheet(spreadsheetId, orderRange);
        const orderData = mapArraytoObj(orderRows);

        // Filter orders that match the product reference and have "Paid" status
        const orders = orderData.filter((ord: any) => ord['Product Reference'] === rows[rowIndex][0] && ord['Order Status'] === "Paid");
        
        // Calculate total sales for the business
        let totalSales = 0;
        for (const order of orderData) {
            if (order['Business Email'] === rows[rowIndex][17] && 
                (order['Status'] === 'Paid' || order['Status'] === 'Delivered')) {
                totalSales += Number(order['Seller Total Earned Per Order'] || 0);
            }
        }

        // Calculate product sales and ratings
        const productOrders = orderData.filter((row: any) => row['Product Reference'] === rows[rowIndex][0]);
        const deliveredOrders = productOrders.filter((order: any) => order['Order Status'] === 'Delivered');
        const productSales = deliveredOrders.length;
        const totalOrders = productOrders.length;
        const productRating = totalOrders >= 10 ? 5 : (totalOrders / 10) * 5;

        // Constructing the response data
        const data: any = {
            'Product Reference': rows[rowIndex][0] || '',
            'Product Photo': rows[rowIndex][1] || '',
            'Product Category': rows[rowIndex][2] || '',
            'Product Name': rows[rowIndex][3] || '',
            'Product Description': rows[rowIndex][4] || '',
            'Product Price': rows[rowIndex][5] || '',
            'Business Name': businessRow[businessRowIndex][1] || '',
            'Business Location': businessRow[businessRowIndex][5] || '',
            'Business Phone Number': businessRow[businessRowIndex][12] || '',
            'Business Till Number': businessRow[businessRowIndex][9] || '',
            'Business Paybill': businessRow[businessRowIndex][10] || '',
            'Business Paybill Account Number': businessRow[businessRowIndex][11] || '',
            'Business Location Photo': businessRow[businessRowIndex][6] || '',
            'Business Location Lat Long': businessRow[businessRowIndex][7] || '',
            'Business Email': businessRow[businessRowIndex][3] || '',
            'Discount Code': rows[rowIndex][18] || '',
            'Discount': rows[rowIndex][19] || '',
            'Availability': rows[rowIndex][20] || '',
            'Colors': rows[rowIndex][22] || '',
            'Sizes': rows[rowIndex][23] || '',
            'Sales': totalSales || 0,
            'Product Sales': productSales,
            'Product Rating': productRating,
            'Business Reference': rows[rowIndex][24] || '',
            'Original Price': rows[rowIndex][25] || '',
            'Orders': orders // Include the filtered orders
        };

        return res.json(data);
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteProductByRef(req: Request, res: Response) {
    try {
        const { reference } = req.params;
        const rows: any = await accessSheet(spreadsheetId, productRange);
        const orderRows: any = await accessSheet(spreadsheetId, orderRange);
        
        // Find the row index with the specific value 
        let rowIndexToDelete = -1; 
        for (let i = 0; i < rows.length; i++) { 
            if (rows[i][0] === reference) { 
                rowIndexToDelete = i; 
                break; 
            } 
        } 
        
        if (rowIndexToDelete === -1) { 
            return res.status(404).json({error:`No record found with reference ${reference}`});
        }

        // Check if there are paid orders related to the product
        const paidOrders = [];
        for (let i = 1; i < orderRows.length; i++) {
            if (orderRows[i][1] === reference && orderRows[i][7] === "Paid") {
                paidOrders.push(orderRows[i]);
            }
        }

        if (paidOrders.length > 0) {
            return res.status(400).json({ error: `Cannot delete product with reference ${reference} as it has paid undelivered orders` });
        }

        // Find the rows with the specific product reference and "Unpaid" status
        const orderRowsToDelete = [];
        for (let i = 1; i < orderRows.length; i++) {
            if (orderRows[i][1] === reference && orderRows[i][7] === "Unpaid") {
                orderRowsToDelete.push(i);
            }
        }

        // Delete the unpaid orders in reverse order to avoid index shifting
        if (orderRowsToDelete.length > 0) {
            for (let i = orderRowsToDelete.length - 1; i >= 0; i--) {
                await deleteRows(spreadsheetId, 'orders', orderRowsToDelete[i], orderRowsToDelete[i] + 1);
            }
        }

        // Delete the product
        const data: any = await deleteRows(spreadsheetId, 'products', rowIndexToDelete, rowIndexToDelete + 1);
        
        if (data) {
            return res.json({message:`Product deleted successfully`});
        } else {
            return res.status(404).json({error:`No record found with reference ${reference}`});
        }
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function updateProductByRef(req: Request, res: Response) {
    try {
        const { reference } = req.params;
        const {
            product_photo, product_category, product_name, product_description,
            product_price, availability, updated_at, colors, sizes, original_price
        } = req.body;

        const rows: any = await accessSheet(spreadsheetId, productRange);
        
        // Find the row index with the specific value 
        let rowIndexToUpdate = -1; 
        for (let i = 0; i < rows.length; i++) { 
            if (rows[i][0] === reference) { 
                rowIndexToUpdate = i;
                break; 
            } 
        } 
        
        if (rowIndexToUpdate === -1) { 
            return res.status(404).json({error:`No product found with reference ${reference}`});
        }

        // Get the current row data
        const currentRowData = rows[rowIndexToUpdate];
        
        // Get business information
        const businessRows: any = await accessSheet(spreadsheetId, businessRange);
        let businessRow = null;
        
        for (let i = 1; i < businessRows.length; i++) {
            if (businessRows[i][0] === currentRowData[24]) {
                businessRow = businessRows[i];
                break;
            }
        }
        
        if (!businessRow) {
            return res.status(404).json({ error: "No business found for this product" });
        }

        const range = `products!A${rowIndexToUpdate+1}:Z${rowIndexToUpdate+1}`; // Range of the row
        
        // Create values array preserving existing values not being updated
        const values = [
            currentRowData[0], // Product Reference (unchanged)
            product_photo || currentRowData[1],
            product_category || currentRowData[2],
            product_name || currentRowData[3],
            product_description || currentRowData[4],
            product_price || currentRowData[5],
            currentRowData[6], // Business Name
            currentRowData[7], // Business Location
            currentRowData[8], // Business Phone Number
            currentRowData[9], // Business Till Number
            currentRowData[10], // Business Paybill
            currentRowData[11], // Business Paybill Account Number
            currentRowData[12], // Business Location Photo
            currentRowData[13], // Business Location Lat Long
            currentRowData[14], // Created At
            currentRowData[15], // Views
            currentRowData[16], // Another field
            currentRowData[17], // Business Email
            currentRowData[18], // Discount Code
            currentRowData[19], // Discount
            availability || currentRowData[20],
            updated_at || currentRowData[21],
            colors || currentRowData[22],
            sizes || currentRowData[23],
            currentRowData[24], // Store Ref
            original_price || currentRowData[25]
        ];

        const data: any = await updateRow(spreadsheetId, range, values);
        
        if (data) {
            // Send notification
            return res.json({message:`Product details updated successfully`});
        } else {
            return res.status(404).json({error:`No product found with reference ${reference}`});
        }
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}