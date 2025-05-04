import { downloadFileFromDrive, uploadFileToDrive, updateFileOnDrive, deleteFileFromDrive } from "../../lib/google-apis/drive";  // Ensure you have deleteFileFromDrive function
import { Request, Response } from "express";
import sharp from "sharp"; // Import sharp for image resizing

export async function uploadFile(req: Request, res: Response) {
    try {
        const fileId = await uploadFileToDrive(req);
        if (fileId) {
            return res.json({
                id: fileId
            });
        } else {
            return res.json({
                error: "Failed to upload file"
            });
        }
    } catch (error: any) {
        console.error('Error:', error);  // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function updateFile(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const fileId = await updateFileOnDrive(req, id);
        if (fileId) {
            return res.json({
                id: fileId
            });
        } else {
            return res.json({
                error: "Failed to update file"
            });
        }
    } catch (error: any) {
        console.error('Error:', error);  // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function downloadImage(req: Request, res: Response) {
    try {
        const { id, sz } = req.query; 
        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid id parameter' });
        }
        const response: any = await downloadFileFromDrive(id);
        if (response) {
            const { stream, mimeType, name } = response;
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `inline; filename="${name}"`);
            if(typeof sz === 'string'){
                const chunks: Buffer[] = [];
                const width = sz.startsWith('w') ? parseInt(sz.slice(1), 10) : undefined;
                
                stream.on('data', (chunk:any) => chunks.push(chunk)); // Collect stream data
                stream.on('end', async () => {
                    const buffer = Buffer.concat(chunks);
                    try {
                        const resizedImage = await sharp(buffer)
                            .resize({ width, height: width }) // Resize to desired dimensions
                            .toBuffer();
                        res.setHeader('Content-Type', mimeType);
                        res.setHeader('Content-Disposition', `inline; filename="${name}"`);
                        res.end(resizedImage); // Send resized image
                    } catch (resizeError) {
                        console.error('Error resizing image:', resizeError);
                        res.status(500).json({ error: 'Failed to resize image' });
                    }
                });
                stream.on('error', (streamError:any) => {
                    console.error('Error reading stream:', streamError);
                    res.status(500).json({ error: 'Failed to process image stream' });
                });
            }else{
                stream.pipe(res);  // Pipe the stream directly to the response
            }
        } else {
            return res.status(404).json({ error: 'No image found' });
        }
    } catch (error: any) {
        console.error('Error:', error);  // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteFile(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await deleteFileFromDrive(id);
        if (result) {
            return res.json({
                message: "File deleted successfully"
            });
        } else {
            return res.status(404).json({
                error: "Failed to delete image"
            });
        }
    } catch (error: any) {
        console.error('Error:', error);  // Return an error response
        return res.status(500).json({ error: error.message });
    }
}
