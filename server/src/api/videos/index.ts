import { downloadFileFromDrive } from "../../lib/google-apis/drive";
import { Request, Response } from "express";

export async function streamVideo(req: Request, res: Response) {
    try {
        const { id, range } = req.query;
        if (typeof id !== "string") {
            return res.status(400).json({ error: "Invalid id parameter" });
        }

        const response: any = await downloadFileFromDrive(id);
        if (!response || !response.stream) {
            return res.status(404).json({ error: "No video found" });
        }

        const { stream, mimeType, size, name } = response;

        // Validate size before setting headers
        if (size === undefined || isNaN(size)) {
            console.warn("File size is undefined or invalid. Skipping Content-Length.");
        }

        res.setHeader("Content-Type", mimeType);
        res.setHeader("Content-Disposition", `inline; filename="${name}"`);

        if (range && typeof range === "string") {
            const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
            const start = parseInt(startStr, 10);
            const end = endStr ? parseInt(endStr, 10) : (size ? size - 1 : undefined);

            if (size && end !== undefined) {
                const chunkSize = end - start + 1;

                res.status(206).set({
                    "Content-Range": `bytes ${start}-${end}/${size}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunkSize,
                });
            }

            // Pipe stream properly
            stream.on("open", () => {
                stream.pipe(res);
            });

            stream.on("error", (err: any) => {
                console.error("Streaming error:", err);
                res.status(500).json({ error: "Error streaming file" });
            });
        } else {
            if (size) {
                res.setHeader("Content-Length", size);
            }
            stream.pipe(res);
        }
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
