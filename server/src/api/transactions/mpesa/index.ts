import axios from "axios";
import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import { mapArraytoObj } from "../../../lib/google-apis/mapArrayToObj";
import { accessSheet, writeDataToSheet } from "../../../lib/google-apis/sheets";
config();

const CALLBACK_URL = process.env.CALLBACK_URL as string;
const SHORT_CODE = process.env.SHORT_CODE as string;
const PASSKEY = process.env.PASSKEY as string;
const ACCOUNT_REF = process.env.ACCOUNT_REF as string;
const TRANSACTION_DESC = process.env.TRANSACTION_DESC as string;
const CONSUMER_KEY = process.env.CONSUMER_KEY as string;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET as string;

const orderRange = "orders!A1:S10000"; // Adjust the range according to your sheet
const transactionRange = "transactions!A1:I10000"; // Adjust the range according to your sheet
const spreadsheetId = process.env.RECORDS_SPREADSHEET_ID as string;

function formated(): string {
  const dt = new Date();
  let m = dt.getMonth();
  m++;
  const month = m < 10 ? `0${m}` : m;
  const minutes =
    dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes();
  const date = dt.getDate() < 10 ? `0${dt.getDate()}` : dt.getDate();
  const sec = dt.getSeconds() < 10 ? `0${dt.getSeconds()}` : dt.getSeconds();
  const hour = dt.getHours() < 10 ? `0${dt.getHours()}` : dt.getHours();
  const YmdHMS = `${dt.getFullYear()}${month}${date}${hour}${minutes}${sec}`;
  return YmdHMS;
}

// generate password
function newPassword(): string {
  const YmdHMS = formated();
  const passString = `${SHORT_CODE}${PASSKEY}${YmdHMS}`;
  const base64string = Buffer.from(passString).toString("base64");
  return base64string;
}

//token
export async function token(req: any, res: Response, next: NextFunction) {
  try {
    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            CONSUMER_KEY + ":" + CONSUMER_SECRET
          ).toString("base64")}`,
        },
      }
    );
    if (data.success) {
      req.token = data.access_token;
      next();
    } else {
      console.log({ error: data });
    }
  } catch (error: any) {
    console.log(error);
    res.send({ error: error.message });
  }
}

export const sendSTK = async (req: any, res: Response) => {
  try {
    const { external_reference, amount, phone_number } = req.body;
    const token = req.token;
    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: SHORT_CODE, //for Till use store number
        Password: newPassword(),
        Timestamp: formated(),
        TransactionType: "CustomerPayBillOnline", //for Till use -> CustomerBuyGoodsOnline
        Amount: amount,
        PartyA: phone_number, //254703730090
        PartyB: SHORT_CODE,
        PhoneNumber: phone_number, //254703730090
        CallBackURL: CALLBACK_URL,
        AccountReference: ACCOUNT_REF,
        TransactionDesc: TRANSACTION_DESC,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    if (data.success) {
      res.status(201).json({ response: { external_reference, data } });
    } else {
      res.status(204).json({ error: `stk push was unsuccessfull` });
    }
  } catch (error: any) {
    console.error("Error adding contribution:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export async function storeTransaction(req: Request, res: Response) {
  try {
    const {
      ExternalReference,
      MerchantRequestID,
      ResultCode,
      ResultDesc,
      CheckoutRequestID,
      CallbackMetadata,
      Status,
    } = req.body.Body.stkCallback;
    console.log(req.body);
    // CallbackMetadata.Item[3].Value, //TransactionDate
    const transactionRows: any = await accessSheet(
      spreadsheetId,
      transactionRange
    );
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
        CallbackMetadata.Item[1].Value, //MpesaReceiptNo
        CheckoutRequestID,
        MerchantRequestID,
        CallbackMetadata.Item[0].Value, //amount
        CallbackMetadata.Item[4].Value, //PhoneNumber
        ResultCode,
        ResultDesc,
        Status,
      ],
    ];

    const result = await writeDataToSheet(spreadsheetId, range, values);
    if (result) {
      const newStatus = "Paid";
      // Access the orders sheet
      const orderRows: any = await accessSheet(spreadsheetId, orderRange);
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
        return res.status(404).json({
          error: `No order found with reference ${ExternalReference}`,
        });
      }

      // Update the order status
      orderRows[rowIndex][7] = newStatus;

      // Write the updated status back to the sheet
      const range = `orders!H${rowIndex + 1}`; // Update only the order status column
      const values = [[newStatus]];
      await writeDataToSheet(spreadsheetId, range, values);
      //send an email to admin and seller that order has been paid
      return res.json({
        message: "Transaction added successfully",
      });
    }
    return res.json({
      error: "Failed to add transaction",
    });
  } catch (error: any) {
    console.error("Error:", error); // Return an error response
    return res.status(500).json({ error: error.message });
  }
}

export async function getTransactions(req: Request, res: Response) {
  try {
    const result: any = await accessSheet(spreadsheetId, transactionRange);
    const data = mapArraytoObj(result);
    return res.json({
      data,
      rows: result.length,
      columns: result[0].length,
    });
  } catch (error: any) {
    console.error("Error:", error); // Return an error response
    return res.status(500).json({ error: error.message });
  }
}

export async function getTransactionByRef(req: Request, res: Response) {
  try {
    const { external_reference } = req.params;
    const rows: any = await accessSheet(spreadsheetId, transactionRange);
    // Find the row index with the specific value
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === external_reference) {
        rowIndex = i;
        break;
      }
    }
    if (rowIndex === -1) {
      return res.status(404).json({ error: `No record found` });
    }

    if (rows[rowIndex]) {
      const data: any = {
        "External Reference": rows[rowIndex][0],
        "Mpesa Receipt Number": rows[rowIndex][1],
        "Checkout RequestID": rows[rowIndex][2],
        "Merchant RequestID": rows[rowIndex][3],
        Amount: rows[rowIndex][4],
        "Phone Number": rows[rowIndex][5],
        "Result Code": rows[rowIndex][6],
        "Result Desc": rows[rowIndex][7],
        Status: rows[rowIndex][8],
      };
      console.log(data);
      return res.json(data);
    } else {
      return res.status(404).json({ error: `No record found` });
    }
  } catch (error: any) {
    console.error("Error:", error); // Return an error response
    return res.status(505).json({ error: error.message });
  }
}
