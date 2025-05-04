import { Request, Response } from 'express';
import axios from "axios"
import { config } from "dotenv";
import { sock } from '../../..';
import { pool } from '../../../postgres';
config()

const PAYHERO_USERNAME=process.env.PAYHERO_USERNAME as string
const PAYHERO_PASSWORD=process.env.PAYHERO_PASSWORD as string
const PAYHERO_CHANNEL_ID=process.env.PAYHERO_CHANNEL_ID as string
const CALLBACK_URL=process.env.CALLBACK_URL as string
const API_URL = process.env.API_URL as string
const APP_URL= process.env.APP_URL as string

async function reply (text:string, from:string, msg?:any){
    return (await sock).sendMessage(from, {
        text: text
    }, {
        quoted: msg
    })
}

export const sendSTK = async (req: Request,res:Response) => {
    try {
        const { external_reference, amount, phone_number }=req.body
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
            res.status(201).json({response:{external_reference,data}})
        }else{
            res.status(204).json({error:`stk push was unsuccessfull`})
        }
    } catch (error: any) {
        console.error("Error adding contribution:", error);
        res.status(500).json({ error: "Internal Server Error" });
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

        pool.query(` 
            INSERT INTO transactions (
                external_reference, 
                mpesa_receipt_number, 
                checkout_request_id, 
                merchant_request_id, 
                amount, 
                phone, 
                result_code, 
                result_desc, 
                status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;`,[
            ExternalReference, 
            MpesaReceiptNumber,
            CheckoutRequestID, 
            MerchantRequestID,
            Amount, 
            Phone,
            ResultCode,
            ResultDesc,
            Status 
        ],(error,results:any)=>{
            if(error){
                console.log(error)
                return res.status(500).json({error:"Failed to add transaction"})
            }

            if(results.rowCount>0){
                pool.query(`UPDATE orders SET order_status = 'Paid' WHERE order_reference = $1 RETURNING *`,[ExternalReference],async(error,results)=>{
                    if(error){
                        console.log(error)
                        return res.status(500).json({error:"Failed to update order"})
                    }
                    
                    const orderRows=results.rows[0]
                    // an email `An order confirmation has just been paid,` to villebiz and admin
                    await axios.post(`${API_URL}/api/send_notification`,{
                        title:`Order payment`,
                        body:`${orderRows.full_name} has placed a ${orderRows.order_status} order on a product worth ${orderRows.total_price}, please check your email`,
                        link:`${APP_URL}/orders/${orderRows.order_reference}`,
                        forSellers:true
                    })
                    await reply(`*Payment Confirmation*\n\nDear ${orderRows.full_name},\n\nThank you for your purchase! We are delighted to confirm that your order has been successfully paid. 🎉\n\nYour order is now being processed and will be delivered within 1-3 business days. You can track your order and get more details by clicking the link below:\n\n${APP_URL}/orders/${orderRows.order_reference}\n\nIf you have any questions or need further assistance, please don't hesitate to reach out.\n\nThank you for choosing us!\n\nBest regards, The Villebiz Team ${APP_URL}`, `${Phone}@s.whatsapp.net`)
        
                    return res.json({
                        message: "Transaction added successfully"
                    });
                })
            }
        })
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function getTransactions(req: Request,res:Response) {
    try{
        const transactions=await pool.query(`SELECT * FROM transactions;`)
        return res.json({
            data:transactions.rows,
            rows:transactions.rows.length
        })
    }catch(error:any){
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function getTransactionByRef(req: Request,res:Response) {
    try{
        const { external_reference } = req.params
        pool.query(`SELECT FROM transactions WHERE external_reference = $1`,[external_reference],(error,results)=>{
            if(error){
                console.log(error)
                return res.status(500).json({error:"Failed to get transaction"})
            }

            const transaction=results.rows[0]
            const data:any={
                'External Reference':transaction.external_reference,
                'Mpesa Receipt Number':transaction.mpesa_receipt_number,
                'Checkout RequestID':transaction.checkout_request_id,
                'Merchant RequestID':transaction.merchant_request_id,
                'Amount':transaction.amount,
                'Phone Number':transaction.phone_number,
                'Result Code':transaction.result_code,
                'Result Desc':transaction.result_desc,
                'Status':transaction.status,
            }
            console.log(data)
            return res.json(data)
        })
    }catch(error:any){
      console.error('Error:', error); // Return an error response
      return res.status(505).json({ error: error.message });
    }
}
