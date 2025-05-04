import { Request, Response } from 'express';
import { parse, isDate } from 'date-fns';
import axios from "axios"
import { config } from "dotenv"
import writeLog from "../../lib/writeLog";
import { sock } from "../..";
import { Location } from "../../types";
import { pool } from '../../postgres';
config()

const APP_URL = process.env.APP_URL as string
const API_URL = process.env.API_URL as string
const MESSAGING_SERVER =process.env.MESSAGING_SERVER as string

async function reply(text: string, from: string, reaction: string | null, location: Location | null, msg: any) {
    const messageOptions: any = {
        text: text,
        quoted: msg,
        react: msg && msg.key ? {
            text: reaction || '✅',
            key: msg.key
        } : undefined
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

export async function getOrders(req: Request, res: Response) {
    try {
        pool.query(
            `SELECT orders.*, products.* 
             FROM orders 
             INNER JOIN products 
             ON orders.product_reference = products.product_reference`, 
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Failed to get orders" });
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
                const formattedOrders = data.map((order: any) => {
                    const product = order; // Ensure 'product' is derived from 'order'
                    return {
                        'Order Reference': order['order_reference'],
                        'Carrier Option': order['carrier_option'],
                        'Payment Method': order['payment_method'],
                        'Total Price': order['total_price'],
                        'Quantity': order['quantity'],
                        'created_at': order['created_at'],
                        'Order Status': order['order_status'],
                        'Email': order['email'],
                        'Discount Code': order['discount_code'],
                        'Full Name': order['full_name'],
                        'Location Lat_long': order['location_lat_long'],
                        'City': order['city'],
                        'Postal Code': order['postal_code'],
                        'Street Address': order['street_address'],
                        'Phone Number': order['phone_number'],
                        'Discount': order['discount'],
                        'Type': order['type'],
                        'Colors':order['colors'],
                        'Sizes':order['sizes'],
                        'Product': product ? {
                            'Product Reference': product['product_reference'],
                            'Product Photo': product['product_photo'],
                            'Product Category': product['product_category'],
                            'Product Name': product['product_name'],
                            'Product Description': product['product_description'],
                            'Product Price': product['product_price'],
                            'Business Name': product['business_name'],
                            'Business Location': product['business_location'],
                            'Business Phone Number': product['business_phone_number'],
                            'Business Till Number': product['business_till_number'],
                            'Business Paybill': product['business_paybill'],
                            'Business Paybill Account Number': product['business_paybill_account_number'],
                            'Business Location Photo': product['business_location_photo'],
                            'Business Location Lat_long': product['business_location_lat_long'],
                            'Business Email': product['business_email'],
                            'Discount Code': product['discount_code'],
                            'Discount': product['discount'],
                            'Availability': product['availability'],
                            'Colors': product['colours'],
                            'Sizes': product['sizes'],
                            'Original Price': product['original_price'] || '',
                        } : {}
                    };
                });
        
                return res.json({
                    orders: formattedOrders,
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


export async function getUserOrders(req: Request, res: Response) {
    try {
        const { email } = req.params;

        pool.query(
            `SELECT orders.*, products.* 
             FROM orders 
             INNER JOIN products 
             ON orders.product_reference = products.product_reference 
             WHERE orders.email = $1`, 
            [email], 
            (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Failed to get user orders" });
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

                // Map orders to the required format and attach the corresponding product details
                const formattedOrders = data.map((order: any) => {
                    const product = order; // Ensure 'product' is derived from 'order'
                    return {
                        'Order Reference': order['order_reference'],
                        'Carrier Option': order['carrier_option'],
                        'Payment Method': order['payment_method'],
                        'Total Price': order['total_price'],
                        'Quantity': order['quantity'],
                        'created_at': order['created_at'],
                        'Order Status': order['order_status'],
                        'Email': order['email'],
                        'Discount Code': order['discount_code'],
                        'Full Name': order['full_name'],
                        'Location Lat_long': order['location_lat_long'],
                        'City': order['city'],
                        'Postal Code': order['postal_code'],
                        'Street Address': order['street_address'],
                        'Phone Number': order['phone_number'],
                        'Discount': order['discount'],
                        'Type': order['type'],
                        'Colors': order['colors'],
                        'Sizes': order['sizes'],
                        'Product': product ? {
                            'Product Reference': product['product_reference'],
                            'Product Photo': product['product_photo'],
                            'Product Category': product['product_category'],
                            'Product Name': product['product_name'],
                            'Product Description': product['product_description'],
                            'Product Price': product['product_price'],
                            'Business Name': product['business_name'],
                            'Business Location': product['business_location'],
                            'Business Phone Number': product['business_phone_number'],
                            'Business Till Number': product['business_till_number'],
                            'Business Paybill': product['business_paybill'],
                            'Business Paybill Account Number': product['business_paybill_account_number'],
                            'Business Location Photo': product['business_location_photo'],
                            'Business Location Lat_long': product['business_location_lat_long'],
                            'Business Email': product['business_email'],
                            'Discount Code': product['discount_code'],
                            'Discount': product['discount'],
                            'Availability': product['availability'],
                            'Colors': product['colours'],
                            'Sizes': product['sizes'],
                            'Original Price': product['original_price'] || '',
                        } : {}
                    };
                });

                return res.json({
                    orders: formattedOrders,
                    rows: data.length,
                    columns: data.length > 0 ? Object.keys(data[0]).length : 0,
                });
            }
        );
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

        // Check if the order already exists
        const existingOrder = await pool.query(
            `SELECT * FROM orders WHERE order_reference = $1`,
            [order_reference]
        );

        if (existingOrder.rows.length > 0) {
            return res.status(200).json({
                error: "An order with this reference already exists.",
            });
        }

        // Insert the new order into the database
        await pool.query(
            `INSERT INTO orders (
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
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
            )`,
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
                colors,
                sizes,
                commission,
                seller_total_earned
            ]
        );

        orderAddedSuccessfully = true;
        orderReference = order_reference;

        // Notify the messaging server
        const { data } = await axios.post(`${MESSAGING_SERVER}/orders`, {
            order_reference,
            email,
            business_email,
        });

        if (data.error) {
            console.log(data.error);
        }

        // Send notification email
        await axios.post(`${API_URL}/api/send_notification`, {
            title: `Order placed confirmation`,
            body: `${full_name} has placed ${order_status} order on a product worth Kes ${total_price}, please check your email`,
            link: `${APP_URL}/orders/${order_reference}`,
            email: business_email,
        });

        // Send WhatsApp notification
        await reply(
            `Dear customer,\n\nThank you for placing an order with us! We are excited to process your order, but we noticed that the payment is still pending. 🎉\n\nTo complete your purchase, please click the link below and proceed with the payment:\n\n${APP_URL}/orders/${order_reference}\n\nOnce your payment is confirmed, we will process your order and arrange for delivery within 1-3 business days.\n\nIf you have any questions or need further assistance, please don't hesitate to reach out.\n\nThank you for choosing us!\n\nBest regards, The Villebiz Team ${APP_URL}`, 
            `${phone_number}@s.whatsapp.net`,
            "✨",
            null,
            null
        );
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

        // Query the database for the order by reference
        const orderQuery = `
            SELECT orders.*, products.*, businesses.*
            FROM orders
            INNER JOIN products ON orders.product_reference = products.product_reference
            INNER JOIN businesses ON products.business_email = businesses.business_email
            WHERE orders.order_reference = $1
        `;

        const result = await pool.query(orderQuery, [reference]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `No order found with reference ${reference}` });
        }

        const order = result.rows[0];

        // Construct the response
        const data = {
            'Order Reference': order.order_reference || '',
            'Carrier Option': order.carrier_option || '',
            'Payment Method': order.payment_method || '',
            'Total Price': order.total_price || '',
            'Quantity': order.quantity || '',
            'Created at': order.created_at || '',
            'Order Status': order.order_status || '',
            'Email': order.email || '',
            'Discount Code': order.discount_code || '',
            'Full Name': order.full_name || '',
            'Location Lat_long': order.location_lat_long || '',
            'City': order.city || '',
            'Postal Code': order.postal_code || '',
            'Street Address': order.street_address || '',
            'Phone Number': order.phone_number || '',
            'Discount': order.discount || '',
            'Type': order.type || '',
            'Colors': order.colors || '',
            'Sizes': order.sizes || '',
            'Seller Total Earned': order.seller_total_earned || '',
            'Commission': order.commission || '',
            'Product': {
                'Product Reference': order.product_reference || '',
                'Product Photo': order.product_photo || '',
                'Product Category': order.product_category || '',
                'Product Name': order.product_name || '',
                'Product Description': order.product_description || '',
                'Product Price': order.product_price || '',
                'Business Name': order.business_name || '',
                'Business Location': order.business_location || '',
                'Business Phone Number': order.business_phone_number || '',
                'Business Till Number': order.business_till_number || '',
                'Business Paybill': order.business_paybill || '',
                'Business Paybill Account Number': order.business_paybill_account_number || '',
                'Business Location Photo': order.business_location_photo || '',
                'Business Location Lat Long': order.business_location_lat_long || '',
                'Business Email': order.business_email || '',
                'Discount Code': order.discount_code || '',
                'Discount': order.discount || '',
                'Availability': order.availability || '',
                'Colors': order.colours || '',
                'Sizes': order.sizes || '',
                'Original Price': order.original_price || '',
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

export async function sendNotice(req: Request, res: Response) {
    try {
        const { reference } = req.params;
        const { notice, to, reaction, location } = req.body;

        // Query the database for the order by reference
        const orderQuery = `
            SELECT orders.*, products.*
            FROM orders
            INNER JOIN products ON orders.product_reference = products.product_reference
            WHERE orders.order_reference = $1
        `;
        const result = await pool.query(orderQuery, [reference]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `No record found for reference ${reference}` });
        }

        const order = result.rows[0];

        const data: any = {
            'Order Reference': order.order_reference,
            'Carrier Option': order.carrier_option,
            'Payment Method': order.payment_method,
            'Total Price': order.total_price,
            'Quantity': order.quantity,
            'Created at': order.created_at,
            'Order Status': order.order_status,
            'Email': order.email,
            'Discount Code': order.discount_code,
            'Full Name': order.full_name,
            'Location Lat_long': order.location_lat_long,
            'City': order.city,
            'Postal Code': order.postal_code,
            'Street Address': order.street_address,
            'Phone Number': order.phone_number,
            'Discount': order.discount,
            'Type': order.type,
            'Product': {
                'Product Reference': order.product_reference,
                'Product Photo': order.product_photo,
                'Product Category': order.product_category,
                'Product Name': order.product_name,
                'Product Description': order.product_description,
                'Product Price': order.product_price,
                'Business Name': order.business_name,
                'Business Location': order.business_location,
                'Business Phone Number': order.business_phone_number,
                'Business Till Number': order.business_till_number,
                'Business Paybill': order.business_paybill,
                'Business Paybill Account Number': order.business_paybill_account_number,
                'Business Location Photo': order.business_location_photo,
                'Business Location Lat_long': order.business_location_lat_long,
                'Business Email': order.business_email,
                'Discount Code': order.discount_code,
                'Discount': order.discount,
                'Availability': order.availability,
            }
        };

        const response = await axios.post(`${MESSAGING_SERVER}/notify/order`, {
            order_reference: reference,
            email: data['Email'],
            full_name: data['Full Name'],
            product_reference: data['Product']['Product Reference'],
            quantity: data["Quantity"],
            total_price: data['Total Price'],
            order_status: data['Order Status'],
            payment_method: data['Payment Method'],
            carrier_option: data['Carrier Option'],
            created_at: data['Created at'],
            discount_code: data['Discount Code'],
            discount: data['Discount'],
            street_address: data['Street Address'],
            city: data['City'],
            postal_code: data['Postal Code'],
            phone_number: data['Phone Number']
        });

        if (response.data.error) {
            console.log(response.data.error);
        }

        await reply(notice, `${to}@s.whatsapp.net`, reaction, location, null);
        return res.json({ msg: "Notice sent successfully" });
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteOrderByRef(req: Request, res: Response) {
    try {
        const { reference } = req.params;

        // Delete the order from the database
        const deleteQuery = `DELETE FROM orders WHERE order_reference = $1 RETURNING *`;
        const result = await pool.query(deleteQuery, [reference]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: `No record found for reference ${reference}` });
        }

        return res.json({ message: `Order deleted successfully` });
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function updateOrderByRef(req: Request, res: Response) {
    try {
        const { reference } = req.params;
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
        } = req.body;

        // Update the order in the database
        const updateQuery = `
            UPDATE orders
            SET 
                carrier_option = $1,
                payment_method = $2,
                total_price = $3,
                quantity = $4,
                order_status = $5,
                location_lat_long = $6,
                city = $7,
                street_address = $8,
                phone_number = $9,
                type = $10,
                postal_code = $11,
                colors = $12,
                sizes = $13,
                commission = $14,
                seller_total_earned = $15
            WHERE order_reference = $16
            RETURNING *
        `;
        const result = await pool.query(updateQuery, [
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
            seller_total_earned,
            reference
        ]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: `No record found for reference ${reference}` });
        }

        const updatedOrder = result.rows[0];

        // Send notification email
        await axios.post(`${API_URL}/api/send_notification`, {
            title: `Order update`,
            body: `${updatedOrder.full_name} has updated ${order_status} order on a product worth Kes ${total_price}`,
            link: `${APP_URL}/orders/${updatedOrder.order_reference}`,
            email: updatedOrder.business_email
        });

        // Send WhatsApp notification
        try {
            await reply(
                `Dear customer, You've updated ${order_status} order.\nClick here to view your order: ${APP_URL}/orders/${updatedOrder.order_reference} 🌟`,
                `${phone_number}@s.whatsapp.net`,
                null,
                null,
                null
            );
        } catch (notificationError) {
            console.error('Error sending WhatsApp notifications:', notificationError);
        }

        return res.json({ message: `Order details updated successfully` });
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
