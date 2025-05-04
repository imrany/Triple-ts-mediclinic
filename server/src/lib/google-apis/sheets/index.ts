import { google } from 'googleapis';
import { authorize } from '../auth';

const google1:any=google

async function getSheetId(spreadsheetId:string, sheetName:string) { 
  const auth = await authorize(); 
  const sheets = google1.sheets({ version: 'v4', auth }); 
  try { 
      const response = await sheets.spreadsheets.get({ spreadsheetId }); 
      const sheet = response.data.sheets.find((s:any) => s.properties.title === sheetName); 
      return sheet.properties.sheetId; 
  } catch (error) { 
      console.error('Error retrieving sheet ID:', error); 
  }
}

export async function accessSheet(spreadsheetId:string, range:string) {
  return new Promise(async(resolve, reject) => { 
    const auth = await authorize();
    const sheets = google1.sheets({ version: 'v4', auth})

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range
      });
      const rows:any = response.data.values;
      if (rows.length) {
        resolve(rows)
      } else {
        resolve('No data found.')
      }
    } catch (error) {
      console.error('Error accessing Google Sheets:', error);
      reject(error)
    }
  })
}

export async function writeDataToSheet(spreadsheetId:string, range:string, values:any) {
  return new Promise(async(resolve, reject) => { 
    const auth = await authorize();
    const sheets:any = google1.sheets({ version: 'v4', auth})
    const resource = { values }; 
    try {
      const result = await sheets.spreadsheets.values.append({ 
        spreadsheetId, range, valueInputOption: 'RAW', resource 
      })
      console.log(`${result.data.updates.updatedCells} cells appended.`); 
      resolve(result); 
    } catch (error) {
      console.error('Error writing to Google Sheets:', error);
      reject(error); 
    }
  });
}

export async function updateRow(spreadsheetId:string, range:string, values:any) {
  return new Promise(async(resolve, reject) => { 
    const auth = await authorize();
    const sheets = google1.sheets({ version: 'v4', auth }); 
    const request = { 
      spreadsheetId: spreadsheetId, 
      range: range, 
      valueInputOption: 'RAW', 
      resource: { 
        values: [values] 
      } 
    }; 
    try { 
      await sheets.spreadsheets.values.update(request); 
      resolve(`Row updated successfully.`); 
    } catch (error) { 
      console.error('Error updating row:', error); 
      reject(error); 
    }
  })
}

export async function deleteRows(spreadsheetId:string, sheetName:string, startRowIndex:number, endRowIndex:number) {
  return new Promise(async(resolve, reject) => { 
    const auth = await authorize();
    const sheets = google1.sheets({ version: 'v4', auth });
  
    // Get the sheet ID 
    const sheetId = await getSheetId(spreadsheetId, sheetName);
    const request = {
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: startRowIndex,
              endIndex: endRowIndex
            }
          }
        }]
      }
    };
  
    try {
      await sheets.spreadsheets.batchUpdate(request);
      resolve(`Rows ${startRowIndex} to ${endRowIndex} deleted.`);
    } catch (error) {
      console.error('Error deleting rows:', error);
      reject(error);
    }
  })
}

export async function findAndDeleteRow(spreadsheetId:string, sheetName:string, columnIndex:number, valueToDelete:string|number) {
  return new Promise(async(resolve, reject) => { 
    const auth = await authorize();
    const sheets = google1.sheets({ version: 'v4', auth });
    
    try {
      // Step 1: Get the sheet data
      const sheet = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: sheetName
      });
  
      // Step 2: Find the row index with the specific value
      const rows = sheet.data.values;
      let rowIndexToDelete = -1;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][columnIndex] === valueToDelete) {
          rowIndexToDelete = i;
          break;
        }
      }
  
      if (rowIndexToDelete === -1) {
        console.log('Value not found');
        return;
      }
  
      // Step 3: Delete the row using batchUpdate
      const sheetIdResponse = await sheets.spreadsheets.get({
        spreadsheetId,
      });
  
      const sheetId = sheetIdResponse.data.sheets.find((s:any) => s.properties.title === sheetName).properties.sheetId;
  
      const request = {
        spreadsheetId: spreadsheetId,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: 'ROWS',
                startIndex: rowIndexToDelete,
                endIndex: rowIndexToDelete + 1
              }
            }
          }]
        }
      };
  
      const response = await sheets.spreadsheets.batchUpdate(request);
      console.log(`Row ${rowIndexToDelete} deleted successfully.`);
      resolve(response);
    } catch (error) {
      console.error('Error deleting row:', error);
      reject(error)
    }
  })
}
