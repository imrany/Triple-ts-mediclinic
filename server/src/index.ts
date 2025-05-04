import express from "express"
import { config } from "dotenv"
import qrcode from "qrcode"
import cors from "cors"
//import socket from "./websocket"
import { connectToWhatsApp, qrcodeData } from "./whatsapp"
import api from "./api"
import views from "./views"
import pg from "./api/index2"
import { pool } from "./postgres"
config()

const cors_option = {
    origin:[
      "http://localhost:3000", "https://villebiz.com", "www.villebiz.com", "https://www.villebiz.com",
      "http://localhost:8080"
    ],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PATCH", "PUT"]
}

const app =express()

app.use(cors(cors_option))
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended:false}))
app.use(views);
app.use("/api",api)
app.use("/pg",pg)

export const sock=connectToWhatsApp();
app.get('/qrcode', async (_:any, res:any) => {
  try {
    const connect = await connectToWhatsApp();
    if (connect && qrcodeData.length !== 0) {
      console.log("QR code data:", qrcodeData);
      const base64QRCode = await qrcode.toDataURL(qrcodeData);

      // Return an HTML page with the QR code and instructions
      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Villebiz whatsapp integration | Scan QR Code</title>
            <style>
              body { 
                font-family: Arial, 
                sans-serif; 
                text-align: center; 
                margin-top: 50px; 
              }
              img { 
                margin: 20px 0; 
              }
            </style>
          </head>
          <body>
            <h1>Connect to WhatsApp</h1>
            <p>Scan the QR code below using WhatsApp on your phone:</p>
            <img src="${base64QRCode}" alt="QR Code">
            <p>Instructions:</p>
            <ol>
              <li>Open WhatsApp on your phone.</li>
              <li>Go to <b>Settings</b> (or <b>Menu</b>) > <b>Linked Devices</b>.</li>
              <li>Tap on <b>Link a Device</b> and scan the QR code above.</li>
            </ol>
          </body>
        </html>
      `;
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } else {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Villebiz whatsapp integration | Scan QR Code</title>
            <style>
              body { 
                font-family: Arial, 
                sans-serif; 
                text-align: center; 
                margin-top: 50px; 
              }
              img { 
                margin: 20px 0; 
              }
            </style>
          </head>
          <body>
            <h1>Oops</h1>
            <p>Whatsapp already logged in, QR Code is not available</p>
          </body>
        </html>
      `;
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    }
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send({ error: "Internal Server Error", details: err });
  }
});

app.get("/run",async(req:any,res:any)=>{
  try{
    const {query}=req.query
    const run=await pool.query(query)
    return res.json({message:"done",run})
  }catch(error){
    res.status(500).json({error})
  }
})

const port=process.env.PORT||8000
const server=app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})

//export let io = require("socket.io")(server,{
//    cors: {
//        origin: cors_option.origin,
//        methods: ["GET", "POST"],
//        transports: ['websocket', 'polling'],
//        credentials: true
//    },
//    allowEIO3: true,
//    maxHttpBufferSize:1e8
//});
//socket(io);