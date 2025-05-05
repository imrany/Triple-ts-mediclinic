import { Request, Response } from 'express';
import axios from "axios"
import { config } from "dotenv";
import { accessSheet, writeDataToSheet, updateRow } from "../../../lib/google-apis/sheets";
import { mapArraytoObj } from "../../../lib/google-apis/mapArrayToObj";
import { pool } from '../../../postgres';
config()

const PAYHERO_USERNAME=process.env.PAYHERO_USERNAME as string
const PAYHERO_PASSWORD=process.env.PAYHERO_PASSWORD as string
const PAYHERO_CHANNEL_ID=process.env.PAYHERO_CHANNEL_ID as string
const CALLBACK_URL=process.env.CALLBACK_URL as string
const API_URL = process.env.API_URL as string
const MESSAGING_SERVER =process.env.MESSAGING_SERVER as string
const APP_URL= process.env.APP_URL as string

const transactionRange = 'transactions!A1:I10000'; // Adjust the range according to your sheet
const businessRange = "businesses!A1:W10000"; // Adjust the range according to your sheet
const productRange = "products!A1:Z10000"; // Adjust the range according to your sheet
const orderRange = "orders!A1:X10000"; // Adjust the range according to your sheet
const spreadsheetId = process.env.RECORDS_SPREADSHEET_ID as string

export async function migrateTransactionsToPG(_: Request, res: Response) {
    try {
        const transactionRows: any = await accessSheet(spreadsheetId, transactionRange);

        if (!transactionRows || transactionRows.length <= 1) {
            return res.status(404).json({ error: "No transactions found to migrate." });
        }

        try {
            for (let i = 1; i < transactionRows.length; i++) {
                const [
                    ExternalReference,
                    MpesaReceiptNumber,
                    CheckoutRequestID,
                    MerchantRequestID,
                    Amount,
                    Phone,
                    ResultCode,
                    ResultDesc,
                    Status
                ] = transactionRows[i];

                const query = `
                    INSERT INTO transactions (
                        external_reference,
                        mpesa_receipt_number,
                        checkout_request_id,
                        merchant_request_id,
                        amount,
                        phone_number,
                        result_code,
                        result_description,
                        status
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    ON CONFLICT (external_reference) DO NOTHING;
                `;

                await pool.query(query, [
                    ExternalReference,
                    MpesaReceiptNumber,
                    CheckoutRequestID,
                    MerchantRequestID,
                    parseInt(Amount),
                    Phone.toString()||"0",
                    ResultCode,
                    ResultDesc,
                    Status
                ]);
            }

            res.json({ message: "Transactions migrated successfully." });
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error("Error during migration:", error);
            res.status(500).json({ error: "Failed to migrate transactions." });
        } 
    } catch (error: any) {
        console.error("Error accessing sheet or database:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const sendSTK = async (req: Request,res:Response) => {
    const method=req.method as string
    const { external_reference, amount, phone_number } = method==="POST" ? req.body:req.query;
    try {
        // Base64 encode the credentials 
        const encodedCredentials = Buffer.from(`${PAYHERO_USERNAME}:${PAYHERO_PASSWORD}`).toString('base64'); 
        const { data } = await axios.post('https://backend.payhero.co.ke/api/v2/payments', { 
            amount:Number(amount), 
            phone_number, 
            channel_id: Number(PAYHERO_CHANNEL_ID), 
            provider: 'm-pesa', 
            external_reference, 
            callback_url: CALLBACK_URL 
        }, { 
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Basic ${encodedCredentials}` 
            }, 
            maxRedirects: 10, 
            timeout: 0 
        }); 
        
        console.log(data)
        if(data.success){
            if(method==="POST"){
                res.status(201).json({response:{external_reference,data}})
            }else{
                // Return an HTML response for unsupported methods
                res.send(`
                    <html>
                        <head>
                            <title>STK Push Status</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    color: #333;
                                    padding: 20px;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    height: 100vh;
                                    gap:2px;
                                }
                                h1 {
                                    color: #4CAF50;
                                }
                                p { 
                                    font-size: 18px;
                                }
                                .footer {
                                    position:fixed;
                                    bottom:0;
                                    left:0;
                                    right:0;
                                    height:fit-content;
                                    padding: 24px;
                                    text-align: center;
                                    font-size: 14px;
                                    color: #6b7280;
                                    background-color: #f4f4f4;
                                }
                                .social-links {
                                    margin: 16px 0;
                                }
                                .social-icon {
                                    margin: 0 8px;
                                    text-decoration: none;
                                }
                            </style>
                        </head>
                        <body>
                            <h1>STK Push Successful</h1>
                            <p>Thank you! Your payment process has been initiated successfully.</p>
                            <p>Complete the transation on your phone</p>
                            <a href="${APP_URL}/orders/${external_reference}" style="text-decoration: none; color: white; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">View Order</a>
                            <div class="footer">
                                <p>&copy; 2025 Villebiz. All rights reserved.</p>
                                <p>If you have any questions, contact us at villebiz.ke@gmail.com</p>
                                <div class="social-links">
                                    <a href="https://facebook.com/villebiz_kenya" class="social-icon">Facebook</a>
                                    <a href="https://twitter.com/villebiz_kenya" class="social-icon">Twitter</a>
                                    <a href="https://instagram.com/villebiz_kenya" class="social-icon">Instagram</a>
                                </div>
                            </div>
                        </body>
                    </html>
                `);
            }
        }else{
            if(method==="POST"){
                res.status(204).json({error:`stk push was unsuccessfull`})
            }else{
                // Return an HTML response for unsupported methods
                res.send(`
                    <html>
                        <head>
                            <title>STK Push Status</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    color: #333;
                                    padding: 20px;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    height: 100vh;
                                    gap:2px;
                                }
                                h1 {
                                    color: red;
                                }
                                p { 
                                    font-size: 18px;
                                }
                                .footer {
                                    position:fixed;
                                    bottom:0;
                                    left:0;
                                    right:0;
                                    height:fit-content;
                                    padding: 24px;
                                    text-align: center;
                                    font-size: 14px;
                                    color: #6b7280;
                                    background-color: #f4f4f4;
                                }
                                .social-links {
                                    margin: 16px 0;
                                }
                                .social-icon {
                                    margin: 0 8px;
                                    text-decoration: none;
                                }
                            </style>
                        </head>
                        <body>
                            <h1>STK Push Unsuccessful</h1>
                            <p>Sorry! Your payment process has not been successfully.</p>
                            <pTry again</p>
                            <a href="${APP_URL}/orders/${external_reference}" style="text-decoration: none; color: white; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">View Order</a>
                            <div class="footer">
                                <p>&copy; 2025 Villebiz. All rights reserved.</p>
                                <p>If you have any questions, contact us at villebiz.ke@gmail.com</p>
                                <div class="social-links">
                                    <a href="https://facebook.com/villebiz_kenya" class="social-icon">Facebook</a>
                                    <a href="https://twitter.com/villebiz_kenya" class="social-icon">Twitter</a>
                                    <a href="https://instagram.com/villebiz_kenya" class="social-icon">Instagram</a>
                                </div>
                            </div>
                        </body>
                    </html>
                `);
            }
        }
    } catch (error: any) {
        console.error("Error adding contribution:", error);
        if(method==="POST"){
            res.status(204).json({error:`stk push was unsuccessfull`})
        }else{
            // Return an HTML response for unsupported methods
            res.send(`
                <html>
                    <head>
                        <title>STK Push Status</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                padding: 20px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                height: 100vh;
                                gap:2px;
                            }
                            h1 {
                                color: red;
                            }
                            p { 
                                font-size: 18px;
                            }
                            .footer {
                                position:fixed;
                                bottom:0;
                                left:0;
                                right:0;
                                height:fit-content;
                                padding: 24px;
                                text-align: center;
                                font-size: 14px;
                                color: #6b7280;
                                background-color: #f4f4f4;
                            }
                            .social-links {
                                margin: 16px 0;
                            }
                            .social-icon {
                                margin: 0 8px;
                                text-decoration: none;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>STK Push Unsuccessful</h1>
                        <p>Sorry! Your payment process has not been successfully.</p>
                        <pTry again</p>
                        <a href="${APP_URL}/orders/${external_reference}" style="text-decoration: none; color: white; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">View Order</a>
                        <div class="footer">
                            <p>&copy; 2025 Villebiz. All rights reserved.</p>
                            <p>If you have any questions, contact us at villebiz.ke@gmail.com</p>
                            <div class="social-links">
                                <a href="https://facebook.com/villebiz_kenya" class="social-icon">Facebook</a>
                                <a href="https://twitter.com/villebiz_kenya" class="social-icon">Twitter</a>
                                <a href="https://instagram.com/villebiz_kenya" class="social-icon">Instagram</a>
                            </div>
                        </div>
                    </body>
                </html>
            `);
        }
    }
}

export async function storeTransaction(req: Request,res:Response) {
    try {
        const { 
            ExternalReference, 
            MpesaReceiptNumber,
            CheckoutRequestID, 
            MerchantRequestID,
            Amount, 
            Phone,
            ResultCode,
            ResultDesc,
            Status
        }=req.body.response
        
        const transactionRows: any = await accessSheet(spreadsheetId, transactionRange);
        for (const row of transactionRows) {
            if (row.includes(ExternalReference)) {
                return res.status(200).json({
                    error: `A transaction with reference ${ExternalReference} already exists.`,
                });
            }
        }

        const range = `transactions!A${transactionRows.length + 1}`; // Starting cell for data
        const values = [
            [
                ExternalReference, 
                MpesaReceiptNumber,
                CheckoutRequestID, 
                MerchantRequestID,
                Amount, 
                Phone,
                ResultCode,
                ResultDesc,
                Status 
            ]
        ];

        const result = await writeDataToSheet(spreadsheetId, range, values);
        if(result){
            const newStatus="Paid"
            // Access the orders sheet
            const orderRows: any = await accessSheet(spreadsheetId, orderRange);
            const productRows: any = await accessSheet(spreadsheetId, productRange);
            let rowIndex = -1;
            
            // Find the row index with the specified order reference
            for (let i = 0; i < orderRows.length; i++) {
                if (orderRows[i][0] === ExternalReference) {
                    rowIndex = i;
                    break;
                }
            }

            // If the order reference is not found, return an error
            if (rowIndex === -1) {
                return res.status(404).json({ error: `No order found with reference ${ExternalReference}` });
            }

            // Update the order status
            orderRows[rowIndex][7] = newStatus;

            // Write the updated status back to the sheet
            const range = `orders!H${rowIndex + 1}`; // Update only the order status column
            const values = [newStatus];
            await updateRow(spreadsheetId, range, values);

            let business_phone = "";
            let business_name = "";
            
            // Find the product reference in the order and match it with the product reference in products
            const orderProductRef = orderRows[rowIndex][2]; 
            for (const productRow of productRows) {
                if (productRow[0] === orderProductRef) { 
                    business_phone = productRow[8]; 
                    business_name = productRow[6]; 
                    break;
                }
            }

            // an email `An order confirmation has just been paid,` to villebiz and admin
            await axios.post(`${API_URL}/api/send_notification`,{
                title:`Order payment`,
                body:`${orderRows[rowIndex][10]} has placed a ${orderRows[rowIndex][7]} order on a product worth ${orderRows[rowIndex][4]}, please check your email`,
                link:`${APP_URL}/orders/${orderRows[rowIndex][0]}`,
                forSellers:true
            })

            const { data } = await axios.post(`${MESSAGING_SERVER}/payment`, {
                title: "Payment Confirmation",
                email: orderRows[rowIndex][8],
                business_email: orderRows[rowIndex][18],
                order_reference: orderRows[rowIndex][0],
                username: orderRows[rowIndex][10],
                amount: orderRows[rowIndex][4],
                transaction_id: MpesaReceiptNumber,
            });
            
            if (data.error) {
                console.log(data.error);
            }

            return res.json({
                message: "Transaction added successfully"
            });
        }
        return res.json({
            error: "Failed to add transaction"
        });
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function getTransactions(req: Request,res:Response) {
    try{
        const result:any = await accessSheet(spreadsheetId, transactionRange)
        const data=mapArraytoObj(result)
        return res.json({
            data,
            rows:result.length,
            columns:result[0].length,
        })
    }catch(error:any){
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function getTransactionByRef(req: Request,res:Response) {
    try{
        const { external_reference } = req.params
        const rows:any = await accessSheet(spreadsheetId, transactionRange)
        // Find the row index with the specific value 
        let rowIndex = -1; 
        for (let i = 0; i < rows.length; i++) { 
            if (rows[i][0] === external_reference) { 
                rowIndex = i; 
                break; 
            } 
        } 
        if (rowIndex === -1) { 
            return res.status(404).json({error:`No record found`})
        }
        
        if(rows[rowIndex]){
            const data:any={
                'External Reference':rows[rowIndex][0],
                'Mpesa Receipt Number':rows[rowIndex][1],
                'Checkout RequestID':rows[rowIndex][2],
                'Merchant RequestID':rows[rowIndex][3],
                'Amount':rows[rowIndex][4],
                'Phone Number':rows[rowIndex][5],
                'Result Code':rows[rowIndex][6],
                'Result Desc':rows[rowIndex][7],
                'Status':rows[rowIndex][8],
            }
            console.log(data)
            return res.json(data)
        }else{
            return res.status(404).json({error:`No record found`})
        }
    }catch(error:any){
      console.error('Error:', error); // Return an error response
      return res.status(505).json({ error: error.message });
    }
}
