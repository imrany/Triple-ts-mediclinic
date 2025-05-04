import { Request, Response } from 'express';
import formidable from "formidable";
import { parse, isDate } from 'date-fns';
import axios from "axios"
import { config } from "dotenv"
import { Location } from '../../types';
import { sock } from '../..';
import { pool } from '../../postgres';
config()

const APP_URL=process.env.APP_URL as string;
const API_URL=process.env.API_URL as string;
const VILLEBIZ_BUSINESS_GROUP=process.env.VILLEBIZ_BUSINESS_GROUP as string;

async function reply(text: string, from: string, reaction: string|null, location: Location|null, msg: any) {
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

export async function getProducts(req: Request,res:Response) {
    try{
        pool.query(`SELECT * FROM products`,(error,results)=>{
            if(error){
                console.log(error)
                return res.status(500).json({error:"Failed to get products"})
            }
            const data=results.rows

            // Ensure date format consistency and parse dates if necessary 
            data.forEach((item:any) => { 
                if (typeof item['updated_at'] === 'string' && !isDate(new Date(item['updated_at']))) { 
                    // Parse non-ISO date format (e.g., 'dd/mm/yyyy') 
                    const parsedDate = parse(item['updated_at'] || "", 'dd/MM/yyyy', new Date()); item['updated_at'] = parsedDate.toISOString().slice(0, 10); // Convert to ISO format 
                } 
            });
    
            // Sort data by 'Created at' date in descending order 
            data.sort((a: any, b: any) => new Date(b['updated_at']).getTime() - new Date(a['updated_at']).getTime());
            
            // Extract all unique product categories 
            const categories = [...new Set(data.map((item: any) => item['product_category']))];
    
            return res.json({
                data,
                rows:data.length,
                categories,
            })
        })
    }catch(error:any){
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

// category is "food" for /api/products/search?category=food
export async function search(req: Request, res: Response) {
    try {
        const { category, name, location, business } = req.query;
        const productName = name as string | undefined;
        const productLocation = location as string | undefined;
        const businessName = business as string | undefined;

        pool.query(`SELECT * FROM products`, (error, results) => {
            if (error) {
                console.error('Error fetching products:', error);
                return res.status(500).json({ error: "Failed to fetch products" });
            }

            const products = results.rows;

            // Filter products by search
            const filteredProducts = products.filter((product: any) => {
                return (
                    (!businessName || product.business_name.toUpperCase().includes(businessName.toUpperCase())) &&
                    (!productLocation || product.business_location.toUpperCase().includes(productLocation.toUpperCase())) &&
                    (!productName || product.product_name.toUpperCase().includes(productName.toUpperCase())) &&
                    (!category || product.product_category.toUpperCase() === category.toString().toUpperCase())
                );
            });

            if (filteredProducts.length > 0) {
                return res.json(filteredProducts);
            } else {
                const error = category
                    ? `Cannot find a product under category ${category}`
                    : productName ? `Cannot find a product with name ${productName}`
                    : productLocation ? `Cannot find a product under this location ${productLocation}`
                    : `Cannot find a product by ${businessName}`;
                return res.status(404).json({ error });
            }
        });
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
            const product_reference = `REF-${field.product_reference[0]}`;
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

            pool.query(
                `SELECT * FROM businesses WHERE business_email = $1`,
                [business_email],
                async(businessError, businessResults) => {
                    if (businessError) {
                        console.error('Error fetching business:', businessError);
                        return res.status(500).json({ error: "Failed to fetch business details" });
                    }

                    if (businessResults.rows.length === 0) {
                        return res.status(404).json({ error: "No business found with the provided email" });
                    }

                    const business = businessResults.rows[0];
                    pool.query(
                        `INSERT INTO products (
                            product_reference, product_photo, product_category, product_name, product_description,
                            product_price, created_at, business_email, discount_code, discount, availability, colours, sizes, store_ref, original_price
                        ) VALUES (
                            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'available', $12, $13, $14, $15
                        );`,
                        [
                            product_reference, product_photo_id, product_category, product_name, product_description,
                            product_price, created_at, business_email, discount_code, discount, colors, sizes, store_ref, original_price
                        ],
                        async (insertError) => {
                            if (insertError) {
                                console.error('Error inserting product:', insertError);
                                return res.status(500).json({ error: "Failed to add product" });
                            }
                            
                            res.json({
                                message: "Product added successfully"
                            });
        
                            try {
                                await axios.post(`${API_URL}/api/send_notification`, {
                                    title: `${business.business_name.trim().replace(/_/g, ' ')} added a new product`,
                                    body: `Here's ${product_name}, priced at Kes ${product_price}`,
                                    link: `${APP_URL}/products/${product_reference}`,
                                    icon: `${API_URL}/api/products/images/${product_photo_id}`
                                });
        
                                await reply(
                                    `${business.business_name.trim().replace(/_/g, ' ')} added a new product.\n\n*${product_name.trim()}*, priced at *Kes ${product_price}*.\n\n${API_URL}/products/${product_reference}`,
                                    `${VILLEBIZ_BUSINESS_GROUP}`,
                                    '🎉',
                                    null,
                                    null
                                );
                            } catch (notificationError) {
                                console.error('Error sending notifications:', notificationError);
                            }
                        }
                    );

                }
            );

            
        });
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getProductByRef(req: Request, res: Response) {
    try {
        const { reference } = req.params;

        // Fetch product details
        const productQuery = `SELECT * FROM products WHERE product_reference = $1`;
        const productResult = await pool.query(productQuery, [reference]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: `No product found with reference ${reference}` });
        }

        const product = productResult.rows[0];

        // Fetch business details
        const businessQuery = `SELECT * FROM businesses WHERE business_email = $1`;
        const businessResult = await pool.query(businessQuery, [product.business_email]);

        if (businessResult.rows.length === 0) {
            return res.status(404).json({ error: `No business found for product reference ${reference}` });
        }

        const business = businessResult.rows[0];

        // Fetch orders related to the product
        const ordersQuery = `
            SELECT * FROM orders 
            WHERE product_reference = $1 AND order_status = 'Paid'
        `;
        const ordersResult = await pool.query(ordersQuery, [reference]);
        const orders = ordersResult.rows;

        const sales= await pool.query(
            "SELECT SUM(seller_total_earned_per_order) as paid FROM orders WHERE business_email = $1 AND (status = 'Paid' OR status = 'Delivered')",
            [product.business_email]
        );
        // Construct response data
        const data: any = {
            'Product Reference': product.product_reference,
            'Product Photo': product.product_photo,
            'Product Category': product.product_category,
            'Product Name': product.product_name,
            'Product Description': product.product_description,
            'Product Price': product.product_price,
            'Business Name': business.business_name,
            'Business Location': business.business_location,
            'Business Phone Number': business.business_phone_number,
            'Business Till Number': business.business_till_number,
            'Business Paybill': business.business_paybill,
            'Business Paybill Account Number': business.business_paybill_account_number,
            'Business Location Photo': business.business_location_photo,
            'Business Location Lat Long': business.business_location_lat_long,
            'Business Email': business.business_email,
            'Discount Code': product.discount_code,
            'Discount': product.discount,
            'Availability': product.availability,
            'Colors': product.colours,
            'Sizes': product.sizes,
            'Sales':sales.rows[0]?.paid||0,
            'Business Reference': product.store_ref,
            'Original Price': product.original_price,
            'Orders': orders
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

        // Check if there are paid orders related to the product
        const checkPaidOrdersQuery = `
            SELECT * FROM orders 
            WHERE product_reference = $1 AND order_status = 'Paid'
        `;
        const paidOrdersResult = await pool.query(checkPaidOrdersQuery, [reference]);

        if (paidOrdersResult.rows.length > 0) {
            return res.status(400).json({ error: `Cannot delete product with reference ${reference} as it has paid undelivered orders` });
        }

        // Delete unpaid orders related to the product
        try {
            const deleteOrdersQuery = `
            DELETE FROM orders 
            WHERE product_reference = $1 AND order_status = 'Unpaid'
            `;
            await pool.query(deleteOrdersQuery, [reference]);
        } catch (error) {
            console.error('Error deleting unpaid orders:', error);
        }

        // Delete the product
        const deleteProductQuery = `DELETE FROM products WHERE product_reference = $1`;
        await pool.query(deleteProductQuery, [reference]);

        return res.json({ message: `Product deleted successfully` });
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

        const updateProductQuery = `
            UPDATE products
            SET 
                product_photo = $1,
                product_category = $2,
                product_name = $3,
                product_description = $4,
                product_price = $5,
                availability = $6,
                updated_at = $7,
                colours = $8,
                sizes = $9,
                original_price = $10
            WHERE product_reference = $11
        `;
        await pool.query(updateProductQuery, [
            product_photo, product_category, product_name, product_description,
            product_price, availability, updated_at, colors, sizes, original_price, reference
        ]);

        return res.json({ message: `Product details updated successfully` });
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
