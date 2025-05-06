import { mapArraytoObj } from "../../lib/google-apis/mapArrayToObj";
import { Request, Response } from 'express';
import { accessSheet, writeDataToSheet, deleteRows, updateRow } from "../../lib/google-apis/sheets";
import { parse, isDate } from 'date-fns';
import axios from "axios"
import { config } from "dotenv"
import writeLog from "../../lib/writeLog";
import { pool } from "../../postgres";
config()

const businessRange = "businesses!A1:W10000"; // Adjust the range according to your sheet
const orderRange = 'orders!A1:X10000'; // Adjust the range according to your sheet
const productRange = 'products!A1:Z10000'; // Adjust the range according to your sheet
const spreadsheetId = process.env.RECORDS_SPREADSHEET_ID as string
const APP_URL = process.env.APP_URL as string
const API_URL = process.env.API_URL as string
const MESSAGING_SERVER =process.env.MESSAGING_SERVER as string

export async function migrateOrdersToPG(_:Request, res:Response) {
    try {
        const orders: any = await accessSheet(spreadsheetId, orderRange);
        const products: any = await accessSheet(spreadsheetId, productRange);

        const orderData = mapArraytoObj(orders);
        const productData = mapArraytoObj(products);

        for (const order of orderData) {
            const product = productData.find((prod: any) => prod['Product Reference'] === order['Product Reference']);

            const query = `
                INSERT INTO orders (
                    order_reference, product_reference, carrier_option, payment_method, total_price, quantity,
                    created_at, order_status, email, discount_code, full_name, location_lat_long, city, postal_code,
                    street_address, phone_number, discount, type, business_email, refund_amount, colors, sizes,
                    seller_total_earned_per_order, commission_earned
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22,
                    $23, $24
                )
                ON CONFLICT (order_reference) DO NOTHING;
            `;

            const values = [
                order['Order Reference'],
                order['Product Reference'],
                order['Carrier Option'],
                order['Payment Method'],
                parseInt(order['Total Price'])||0,
                parseInt(order['Quantity'])||1,
                order['Created at'],
                order['Order Status']||"",
                order['Email']||"",
                order['Discount Code']||"",
                order['Full Name']||"",
                order['Location Lat_long']||"",
                order['City']||"",
                order['Postal Code']||"",
                order['Street Address']||"",
                order['Phone Number']||"",
                parseInt(order['Discount'])||0,
                order['Type']||"",
                order['Business Email']||"",
                parseInt(order['Refund Amount']) || 0,
                order['Colors'],
                order['Sizes'],
                parseInt(order['Seller Total Earned']) || 0,
                parseInt(order['Commission']) || 0,
            ];

            await pool.query(query, values);
        }

        res.status(200).json({message:'Order migration completed successfully.'});
    } catch (error: any) {
        console.error('Error migrating orders:', error.message);
        res.status(500).json({error:"Error migrating orders", details:error})
    }
}

export async function getOrders(req: Request, res: Response) {
    try {
        const result: any = await accessSheet(spreadsheetId, orderRange);
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

        const productResult: any = await accessSheet(spreadsheetId, productRange);
        const productData = mapArraytoObj(productResult);

        const formattedOrders = data.map((order: any) => {
            const product = productData.find((prod: any) => prod['Product Reference'] === order['Product Reference']);
            return {
                'Order Reference': order['Order Reference'],
                'Carrier Option': order['Carrier Option'],
                'Payment Method': order['Payment Method'],
                'Total Price': order['Total Price'],
                'Quantity': order['Quantity'],
                'Created at': order['Created at'],
                'Order Status': order['Order Status'],
                'Email': order['Email'],
                'Discount Code': order['Discount Code'],
                'Full Name': order['Full Name'],
                'Location Lat_long': order['Location Lat_long'],
                'City': order['City'],
                'Postal Code': order['Postal Code'],
                'Street Address': order['Street Address'],
                'Phone Number': order['Phone Number'],
                'Discount': order['Discount'],
                'Type': order['Type'],
                'Colors':order['Colors'],
                'Sizes':order['Sizes'],
                'Product': product ? {
                    'Product Reference': product['Product Reference'],
                    'Product Photo': product['Product Photo'],
                    'Product Category': product['Product Category'],
                    'Product Name': product['Product Name'],
                    'Product Description': product['Product Description'],
                    'Product Price': product['Product Price'],
                    'Business Name': product['Business Name'],
                    'Business Location': product['Business Location'],
                    'Business Phone Number': product['Business Phone Number'],
                    'Business Till Number': product['Business Till Number'],
                    'Business Paybill': product['Business Paybill'],
                    'Business Paybill Account Number': product['Business Paybill Account Number'],
                    'Business Location Photo': product['Business Location Photo'],
                    'Business Location Lat_long': product['Business Location Lat_long'],
                    'Business Email': product['Business Email'],
                    'Discount Code': product['Discount Code'],
                    'Discount': product['Discount'],
                    'Availability': product['Availability'],
                    'Colors': product['Colours'],
                    'Sizes': product['Sizes'],
                    'Original Price': product['Original Price'] || '',
                } : {}
            };
        });

        return res.json({
            orders: formattedOrders,
            rows: result.length - 1,
            columns: result[0].length,
        });
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}


export async function getUserOrders(req: Request, res: Response) {
    try {
        const { email } = req.params;

        // Fetch orders
        const orderResult: any = await accessSheet(spreadsheetId, orderRange);
        const orderData = mapArraytoObj(orderResult);

        // Fetch products
        const productResult: any = await accessSheet(spreadsheetId, productRange);
        const productData = mapArraytoObj(productResult);

        // Ensure date format consistency and parse dates if necessary
        orderData.forEach((item: any) => {
            if (typeof item['Created at'] === 'string' && !isDate(new Date(item['Created at']))) {
                // Parse non-ISO date format (e.g., 'dd/MM/yyyy')
                const parsedDate = parse(item['Created at'], 'dd/MM/yyyy', new Date());
                item['Created at'] = parsedDate.toISOString().slice(0, 10); // Convert to ISO format
            }
        });

        // Filter orders by email
        const userOrders = orderData.filter((item: any) => item['Email'] === email);

        // Sort filtered orders by 'Created at' date in descending order
        userOrders.sort((a: any, b: any) => new Date(b['Created at']).getTime() - new Date(a['Created at']).getTime());

        // Map orders to the required format and attach the corresponding product details
        const formattedOrders = userOrders.map((order: any) => {
            const product = productData.find((prod: any) => prod['Product Reference'] === order['Product Reference']);
            return {
                'Order Reference': order['Order Reference'],
                'Carrier Option': order['Carrier Option'],
                'Payment Method': order['Payment Method'],
                'Total Price': order['Total Price'],
                'Quantity': order['Quantity'],
                'Created at': order['Created at'],
                'Order Status': order['Order Status'],
                'Email': order['Email'],
                'Discount Code': order['Discount Code'],
                'Full Name': order['Full Name'],
                'Location Lat_long': order['Location Lat_long'],
                'City': order['City'],
                'Postal Code': order['Postal Code'],
                'Street Address': order['Street Address'],
                'Phone Number': order['Phone Number'],
                'Discount': order['Discount'],
                'Type': order['Type'],
                'Colors':order['Colors'],
                'Sizes':order['Sizes'],
                'Product': product ? {
                    'Product Reference': product['Product Reference'],
                    'Product Photo': product['Product Photo'],
                    'Product Category': product['Product Category'],
                    'Product Name': product['Product Name'],
                    'Product Description': product['Product Description'],
                    'Product Price': product['Product Price'],
                    'Business Name': product['Business Name'],
                    'Business Location': product['Business Location'],
                    'Business Phone Number': product['Business Phone Number'],
                    'Business Till Number': product['Business Till Number'],
                    'Business Paybill': product['Business Paybill'],
                    'Business Paybill Account Number': product['Business Paybill Account Number'],
                    'Business Location Photo': product['Business Location Photo'],
                    'Business Location Lat_long': product['Business Location Lat_long'],
                    'Business Email': product['Business Email'],
                    'Discount Code': product['Discount Code'],
                    'Discount': product['Discount'],
                    'Availability': product['Availability'],
                    'Colors': product['Colours'],
                    'Sizes': product['Sizes'],
                    'Original Price': product['Original Price'] || '',
                } : {}
            };
        });

        return res.json(formattedOrders);
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

function convertDateToReadable(isoDate: string): string {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', // Full name of the day of the week
        year: 'numeric',
        month: 'long', // Full name of the month
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short' // Time zone name
    };
    const readableDate = date.toLocaleString('en-US', options);
    return readableDate;
}

export async function addOrder(req: Request, res: Response) {
    let orderAddedSuccessfully = false;
    let orderReference = '';

    try {
        const {
            order_reference,
            product_reference,
            carrier_option,
            payment_method,
            total_price,
            quantity,
            created_at,
            order_status,
            email,
            discount_code,
            full_name,
            location_lat_long,
            city,
            postal_code,
            street_address,
            phone_number,
            discount,
            type,
            business_email,
            colors,
            sizes,
            commission,
            seller_total_earned
        } = req.body;

        const rows: any = await accessSheet(spreadsheetId, orderRange);
        for (const row of rows) {
            if (row.includes(order_reference)) {
                return res.status(200).json({
                    error: "An order with this reference already exists.",
                });
            }
        }

        const range = `orders!A${rows.length + 1}`; // Starting cell for data
        const values = [
            [
                order_reference,
                product_reference,
                carrier_option,
                payment_method,
                total_price,
                quantity,
                created_at,
                order_status,
                email,
                discount_code,
                full_name,
                location_lat_long,
                city,
                postal_code,
                street_address,
                phone_number,
                discount,
                type,
                business_email,
                0,
                colors,
                sizes,
                seller_total_earned,
                commission,
            ]
        ];

        await writeDataToSheet(spreadsheetId, range, values);
        orderAddedSuccessfully = true;
        orderReference = order_reference;

        const businessRows: any = await accessSheet(spreadsheetId, businessRange);
        const businessRow = businessRows.find((row: any) => row[3] === business_email);
        const business_location= businessRow[5]

        const productRows: any = await accessSheet(spreadsheetId, productRange);
        const productRow = productRows.find((row: any) => row[0] === product_reference);
        const productImage = productRow ? `${API_URL}/api/thumbnail?id=${JSON.parse(productRow[1])[0]}&sz=w500` : 'https://imageplaceholder.net/100x100';
        const productName = productRow ? productRow[3] : 'Unknown Product';
        const product_description = productRow ? productRow[4] : 'No description available';

        const { data } = await axios.post(`${MESSAGING_SERVER}/orders`, {
            order_reference,
            product_reference,
            carrier_option,
            payment_method,
            total_price,
            quantity,
            created_at,
            order_status,
            email,
            discount_code,
            full_name,
            location_lat_long,
            city,
            postal_code,
            street_address,
            phone_number,
            discount,
            type,
            business_email,
            colors,
            sizes,
            product_image: productImage,
            product_name: productName,
            product_description,
            business_location,
            title:"Invoice"
        });
        
        if (data.error) {
            console.log(data.error);
        }
    } catch (error: any) {
        writeLog(error);
        console.error('Error:', error); // Log error
    }

    return res.json({
        message: orderAddedSuccessfully ? "Order added successfully" : "Failed to add order",
        reference: orderReference
    });
}

export async function getOrderByRef(req: Request, res: Response) {
    try {
        const { reference } = req.params;
        
        // Fetch all necessary data concurrently for better performance
        const [orderRows, businessRows, productRows]:any = await Promise.all([
            accessSheet(spreadsheetId, orderRange),
            accessSheet(spreadsheetId, businessRange),
            accessSheet(spreadsheetId, productRange)
        ]);

        // Find the order by reference
        const orderRowIndex = orderRows.findIndex((row: any) => row[0] === reference);
        if (orderRowIndex === -1) {
            return res.status(404).json({ error: `No order found with reference ${reference}` });
        }

        // Get product reference from the order
        const productReference = orderRows[orderRowIndex][1];
        if (!productReference) {
            return res.status(400).json({ error: `Order ${reference} has no associated product reference` });
        }

        // Find the product by reference
        const productRowIndex = productRows.findIndex((row: any) => row[0] === productReference);
        if (productRowIndex === -1) {
            return res.status(404).json({ error: `No product found with reference ${productReference}` });
        }
        console.log(productRows[productRowIndex][24],productReference)

        // Find the business using the business reference from the product
        const businessReference = productRows[productRowIndex][24];
        if (!businessReference) {
            return res.status(400).json({ error: `Product ${productReference} has no associated business reference` });
        }
        
        const businessRowIndex = businessRows.findIndex((row: any) => row[0] === businessReference);
        if (businessRowIndex === -1) {
            return res.status(404).json({ error: `No business found with reference ${businessReference}` });
        }

        // Construct the response with error handling for missing fields
        const orderRow = orderRows[orderRowIndex];
        const productRow = productRows[productRowIndex];
        const businessRow = businessRows[businessRowIndex];

        const data = {
            'Order Reference': orderRow[0] || '',
            'Carrier Option': orderRow[2] || '',
            'Payment Method': orderRow[3] || '',
            'Total Price': orderRow[4] || '',
            'Quantity': orderRow[5] || '',
            'Created at': orderRow[6] || '',
            'Order Status': orderRow[7] || '',
            'Email': orderRow[8] || '',
            'Discount Code': orderRow[9] || '',
            'Full Name': orderRow[10] || '',
            'Location Lat_long': orderRow[11] || '',
            'City': orderRow[12] || '',
            'Postal Code': orderRow[13] || '',
            'Street Address': orderRow[14] || '',
            'Phone Number': orderRow[15] || '',
            'Discount': orderRow[16] || '',
            'Type': orderRow[17] || '',
            'Colors': orderRow[20] || '',
            'Sizes': orderRow[21] || '',
            'Seller Total Earned': orderRow[22] || '',
            'Commission': orderRow[23] || '',
            'Product': {
                'Product Reference': productRow[0] || '',
                'Product Photo': productRow[1] || '',
                'Product Category': productRow[2] || '',
                'Product Name': productRow[3] || '',
                'Product Description': productRow[4] || '',
                'Product Price': productRow[5] || '',
                'Business Name': businessRow[1] || '',
                'Business Location': businessRow[5] || '',
                'Business Phone Number': businessRow[12] || '',
                'Business Till Number': businessRow[9] || '',
                'Business Paybill': businessRow[10] || '',
                'Business Paybill Account Number': businessRow[11] || '',
                'Business Location Photo': businessRow[6] || '',
                'Business Location Lat Long': businessRow[7] || '',
                'Business Email': businessRow[3] || '',
                'Discount Code': productRow[18] || '',
                'Discount': productRow[19] || '',
                'Availability': productRow[20] || '',
                'Colors': productRow[22] || '',
                'Sizes': productRow[23] || '',
                'Original Price': productRow[25] || '',
            }
        };

        return res.json(data);
    } catch (error: any) {
        writeLog(`Error in getOrderByRef: ${error.message}`);
        console.error('Error:', error);
        return res.status(500).json({ 
            error: 'An error occurred while retrieving the order information',
            details: error.message 
        });
    }
}

export async function sendNotice(req: Request,res:Response) {
    try {
        const { reference } = req.params;
        const { notice, to, reaction, location } = req.body;
        const rows: any = await accessSheet(spreadsheetId, orderRange);

        // Find the order by reference
        let rowIndex = -1;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0] === reference) {
                rowIndex = i;
                break;
            }
        }
        if (rowIndex === -1) {
            return res.status(404).json({ error: `No record found for reference ${reference}` });
        }

        const productRows: any = await accessSheet(spreadsheetId, productRange);
        let productIndex = -1;
        const productReference = rows[rowIndex][1];
        for (let i = 0; i < productRows.length; i++) {
            if (productRows[i][0] === productReference) {
                productIndex = i;
                break;
            }
        }
        if (productIndex === -1) {
            return res.status(404).json({ error: `No product found with reference ${productReference}` });
        }

        if (rows[rowIndex]) {
            const data: any = {
                'Order Reference': rows[rowIndex][0],
                'Carrier Option': rows[rowIndex][2],
                'Payment Method': rows[rowIndex][3],
                'Total Price': rows[rowIndex][4],
                'Quantity': rows[rowIndex][5],
                'Created at': rows[rowIndex][6],
                'Order Status': rows[rowIndex][7],
                'Email': rows[rowIndex][8],
                'Discount Code': rows[rowIndex][9],
                'Full Name': rows[rowIndex][10],
                'Location Lat_long': rows[rowIndex][11],
                'City': rows[rowIndex][12],
                'Postal Code': rows[rowIndex][13],
                'Street Address': rows[rowIndex][14],
                'Phone Number': rows[rowIndex][15],
                'Discount': rows[rowIndex][16],
                'Type': rows[rowIndex][17],
                'Product': {
                    'Product Reference': productRows[productIndex][0],
                    'Product Photo': productRows[productIndex][1],
                    'Product Category': productRows[productIndex][2],
                    'Product Name': productRows[productIndex][3],
                    'Product Description': productRows[productIndex][4],
                    'Product Price': productRows[productIndex][5],
                    'Business Name': productRows[productIndex][6],
                    'Business Location': productRows[productIndex][7],
                    'Business Phone Number': productRows[productIndex][8],
                    'Business Till Number': productRows[productIndex][9],
                    'Business Paybill': productRows[productIndex][10],
                    'Business Paybill Account Number': productRows[productIndex][11],
                    'Business Location Photo': productRows[productIndex][12],
                    'Business Location Lat_long': productRows[productIndex][13],
                    'Business Email': productRows[productIndex][17],
                    'Discount Code': productRows[productIndex][18],
                    'Discount': productRows[productIndex][19],
                    'Availability': productRows[productIndex][20],
                }
            };

            const businessRows: any = await accessSheet(spreadsheetId, businessRange);
            const businessRow = businessRows.find((row: any) => row[3] === data['Product']['Business Email']);
            const business_location= businessRow[5]

            const productImage = data['Product']['Product Photo'] ? `${API_URL}/api/thumbnail?id=${JSON.parse(data['Product']['Product Photo'])[0]}&sz=w500` : 'https://imageplaceholder.net/100x100';
            const response  =await axios.post(`${MESSAGING_SERVER}/notify/order`,{
                order_reference: data['Order Reference'],
                product_reference:data['Product']['Product Reference'],
                carrier_option:data['Carrier Option'],
                payment_method:data['Payment Method'],
                total_price:data['Total Price'],
                quantity:data['Quantity'],
                created_at:data['Created at'],
                order_status:data['Order Status'],
                email:data['Email'],
                discount_code:data['Discount Code'],
                full_name:data['Full Name'],
                location_lat_long:data['Location Lat_long'],
                city:data['City'],
                postal_code:data['Postal Code'], 
                street_address:data['Street Address'],
                phone_number:data['Phone Number'],
                discount:data['Discount'],
                type:data['Type'],
                business_email:data['Product']['Business Email'],
                colors:data['Product']['Colors'],
                sizes:data['Product']['Sizes'],
                product_image: productImage,
                product_name: data['Product']['Product Name'],  
                product_description:data['Product']['Product Description'],
                business_location,
                title:"Order Notice"
            })
            if(response.data.error){
                console.log(response.data.error)
            }
            return res.json({msg:"Notice sent successfully"});
        } else {
            return res.status(404).json({ error: `No record found for reference ${reference}` });
        }
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteOrderByRef(req: Request,res:Response) {
    try{
        const { reference } = req.params
        const rows:any = await accessSheet(spreadsheetId, orderRange)
        // Find the row index with the specific value 
        let rowIndexToDelete = -1; 
        for (let i = 0; i < rows.length; i++) { 
            if (rows[i][0] === reference) { 
                rowIndexToDelete = i; 
                break; 
            } 
        } 
        if (rowIndexToDelete === -1) { 
            return res.status(404).json({error:`No record found`})
        }
        const data:any= await deleteRows(spreadsheetId , 'orders', rowIndexToDelete, rowIndexToDelete+1)
        if(data){
            console.log(data)
            return res.json({message:`order delete successfull`})
        }else{
            return res.status(404).json({error:`No record found`})
        }
    }catch(error:any){
      console.error('Error:', error); // Return an error response
      return res.status(500).json({ error: error.message });
    }
}

export async function updateOrderByRef(req: Request,res:Response) {
    try{
        const { reference } = req.params
        // Clone the request body to avoid "Body is unusable" error 
        const requestBody = req.body; 
        const { 
            carrier_option,
            payment_method,
            total_price,
            quantity,
            order_status,
            location_lat_long,
            city,
            street_address,
            phone_number,
            type,
            postal_code,
            colors,
            sizes,
            commission,
            seller_total_earned
        } = requestBody
        const rows:any = await accessSheet(spreadsheetId, orderRange)
        // Find the row index with the specific value 
        let rowIndexToUpdate = -1; 
        for (let i = 0; i < rows.length; i++) { 
            if (rows[i][0] === reference) { 
                rowIndexToUpdate = i + 1; // Adjust to 1-based index
                break; 
            } 
        } 
        if (rowIndexToUpdate === -1) { 
            return res.status(404).json({error:`No record found`})
        }
        const range = `orders!A${rowIndexToUpdate}:X${rowIndexToUpdate}`; // Adjust this to the range of the row you want to update 
        const values = [
            rows[rowIndexToUpdate][0],
            rows[rowIndexToUpdate][1],
            carrier_option,
            payment_method,
            total_price,
            quantity,
            rows[rowIndexToUpdate][6],
            order_status,
            rows[rowIndexToUpdate][8],
            rows[rowIndexToUpdate][9],
            rows[rowIndexToUpdate][10],
            location_lat_long,
            city,
            postal_code,
            street_address,
            phone_number,
            rows[rowIndexToUpdate][16],
            type,
            rows[rowIndexToUpdate][18],
            rows[rowIndexToUpdate][19],
            colors,
            sizes,
            seller_total_earned,
            commission,
        ];
        const data:any= await updateRow(spreadsheetId, range,values)
        if(data){
            res.json({message:`Order details updated successfull`})
            //send order update email here
            const productRows: any = await accessSheet(spreadsheetId, productRange);
            const businessRows: any = await accessSheet(spreadsheetId, businessRange);
            const productReference = rows[rowIndexToUpdate][1];
            const businessEmail = rows[rowIndexToUpdate][18];
            const productRow = productRows.find((row: any) => row[0] === productReference);
            const businessRow = businessRows.find((row: any) => row[3] === businessEmail);
            const productImage = productRow ? `${API_URL}/api//thumbnail?id=${JSON.parse(productRow[1])[0]}&sz=w500` : 'https://imageplaceholder.net/100x100';
            const productName = productRow ? productRow[3] : 'Unknown Product';
            const business_location= businessRow[5]

            const { data } = await axios.post(`${MESSAGING_SERVER}/orders`, {
                order_reference: rows[rowIndexToUpdate][0],
                email: rows[rowIndexToUpdate][8],
                business_email: rows[rowIndexToUpdate][18],
                product_reference: rows[rowIndexToUpdate][1],
                carrier_option: carrier_option || rows[rowIndexToUpdate][2],
                payment_method: payment_method || rows[rowIndexToUpdate][3],
                total_price: total_price || rows[rowIndexToUpdate][4],
                quantity: quantity || rows[rowIndexToUpdate][5],
                created_at: rows[rowIndexToUpdate][6],
                order_status: order_status || rows[rowIndexToUpdate][7],
                discount_code: rows[rowIndexToUpdate][9],
                full_name: rows[rowIndexToUpdate][10],
                location_lat_long: location_lat_long || rows[rowIndexToUpdate][11],
                city: city || rows[rowIndexToUpdate][12],
                postal_code: postal_code || rows[rowIndexToUpdate][13],
                street_address: street_address || rows[rowIndexToUpdate][14],
                phone_number: phone_number || rows[rowIndexToUpdate][15],
                discount: rows[rowIndexToUpdate][16],
                type: type || rows[rowIndexToUpdate][17],
                colors: colors || rows[rowIndexToUpdate][20],
                sizes: sizes || rows[rowIndexToUpdate][21],
                seller_total_earned: seller_total_earned || rows[rowIndexToUpdate][22],
                commission: commission || rows[rowIndexToUpdate][23],
                product_image: productImage,
                product_name: productName,
                business_location,
                title: "Order Update"
            });
            
            if (data.error) {
                console.log(data.error);
            }
        }else{
            return res.status(404).json({error:`No record found`})
        }
    }catch(error:any){
      console.error('Error:', error); // Return an error response
      return res.status(500).json({ error: error.message });
    }
}
