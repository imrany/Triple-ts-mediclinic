import { Router, Request, Response } from "express";
import { config } from "dotenv";
import { accessSheet } from "../lib/google-apis/sheets";
config();

const orderRange = 'orders!A1:T10000'; // Adjust the range according to your sheet
const productRange = "products!A1:Z10000"; // Adjust the range according to your sheet
const businessRange = "businesses!A1:R10000"; // Adjust the range according to your sheet
const spreadsheetId = process.env.RECORDS_SPREADSHEET_ID as string;
const APP_URL = process.env.APP_URL as string;
const API_URL = process.env.API_URL as string;
// const googleImageLnk = "https://drive.google.com/thumbnail?id=";
const googleImageLnk = `${API_URL}/api/thumbnail?id=`;
const views = Router();

views.get("/", (_, res: Response) => {
  res.render("index", {
    head:null,
    appUrl: APP_URL,
    url:APP_URL
  });
});

views.get("/stores", (_, res: Response) => {
    res.render("index", {
      head:null,
      appUrl: APP_URL,
      url:`${APP_URL}/stores`
    });
});

views.get("/products", (_, res: Response) => {
    res.render("index", {
      head:null,
      appUrl: APP_URL,
      url:`${APP_URL}`
    });
});

views.get("/stores/:business_name", async (req: Request, res: Response) => {
  try {
    const { business_name } = req.params;
    const parsedBusinessName = business_name.charAt(0).toUpperCase() + business_name.slice(1);
    const rows: any = await accessSheet(spreadsheetId, businessRange);

    // Find the row index with the specific value
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][1] === parsedBusinessName) {
        rowIndex = i;
        break;
      }
    }
    if (rowIndex === -1) {
      return res.redirect(`${APP_URL}/stores`);
    }

    if (rows[rowIndex]) {
      const data: any = {
        "Business Reference": rows[rowIndex][0],
        "Business Name": rows[rowIndex][1].trim().replace(/_/g, ' '),
        "Business Logo": rows[rowIndex][2],
        "Business Email": rows[rowIndex][3],
        "Business Owner": rows[rowIndex][4],
        "Location Name": rows[rowIndex][5],
        "Location Photo": rows[rowIndex][6],
        "Location lat_long": rows[rowIndex][7],
        "Business Description": rows[rowIndex][8],
        "Status":rows[rowIndex][16],
      };
      const head = {
        favicon: `${googleImageLnk}${data['Business Logo']}&sz=w200`,
        description: `${data['Business Description']}`,
        keywords: `${data['Business Name']}, ${data['Location Name']}, ${data['Business Owner']}`,
        image: `${googleImageLnk}${data['Location Photo']}&sz=w500`,
        icon: `${googleImageLnk}${data['Business Logo']}&sz=w200`,
        title: `${data['Business Name']} | ${data['Location Name']}`,
        url:`${APP_URL}/stores/${data['Business Name']}`,
        appURL: APP_URL,
      };
      res.render("store", {
        head:data['Status']==="active"?head:null,
        appUrl:APP_URL,
        url:`${APP_URL}/stores`
      });
    } else {
      return res.redirect(`${APP_URL}/stores`);
    }
  } catch (error: any) {
    console.error("Error:", error); // Return an error response
    return res.redirect(`${APP_URL}/stores`);
  }
});

views.get("/products/:reference", async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        const rows: any = await accessSheet(spreadsheetId, productRange);
              
        // Find the row index with the specific value 
        let rowIndex = -1; 
        for (let i = 0; i < rows.length; i++) { 
            if (rows[i][0] === reference) { 
                rowIndex = i; 
                break; 
            } 
        } 
      
        if (rowIndex === -1) { 
            return res.status(404).json({ error: `No record found` });
        }

        // Constructing the response data
        const data: any = {
            'Product Reference': rows[rowIndex][0],
            'Product Photo': rows[rowIndex][1],
            'Product Category': rows[rowIndex][2],
            'Product Name': rows[rowIndex][3],
            'Product Description': rows[rowIndex][4],
            'Product Price': rows[rowIndex][5],
            'Business Name': rows[rowIndex][6],
            'Business Location': rows[rowIndex][7],
            'Business Location Photo': rows[rowIndex][12],
            'Business Location Lat Long': rows[rowIndex][13],
            'Business Email': rows[rowIndex][17],
            'Availability': rows[rowIndex][20]
        };
        const head = {
          favicon: `${googleImageLnk}${JSON.parse(data['Product Photo'].trim())[0]}&sz=w200`,
          description: `${data['Product Description']}`,
          keywords: `${data['Product Name']}, ${data['Product Category']}, ${data['Business Owner']}, ${data['Business Name'].trim().replace(/_/g, ' ')}, ${data['Business Location']}, ${data['Product Price']}`,
          image: `${googleImageLnk}${JSON.parse(data['Product Photo'].trim())[0]}&sz=w500`,
          icon: `${googleImageLnk}${JSON.parse(data['Product Photo'].trim())[0]}&sz=w200`,
          title: `${data['Product Name']} | Ksh ${data['Product Price']} | ${data['Business Name'].trim().replace(/_/g, ' ')} | ${data['Business Location']}`,
          url:`${APP_URL}/products/${data['Product Reference']}`,
          appURL: APP_URL,
        };
        res.render("store", {
          head:data['Availability']==="available"?head:null,
          appUrl:APP_URL,
          url:APP_URL
        });
    } catch (error: any) {
      console.error("Error:", error); // Return an error response
      return res.redirect(`${APP_URL}/stores`);
    }
});

export default views;
