import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { Request, Response } from "express"
import * as marked from "marked";

const apiKey=process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export async function prompt(req: Request,res:Response) {
    try{
        const { prompt } = req.body;
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp"});
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text:any=marked.parse(response.text())

        const aiResponse: any = text.replace(/<[^>]+>/g, '');
        return res.json({
          prompt,
          aiResponse
        })

    }catch(error:any){
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function geminiPrompt(req:Request, res:Response){
    try {
        const { prompt } = req.body;
        const { data }=await axios({
            method:"POST",
            url:`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            headers:{
                "content-type":"application/json"
            },
            data:{
                contents: [{
                    parts:[{
                        text: prompt
                    }]
                }]
            }
        })
        if(data.error){
            return res.json({error:data.error})
        }
        const response=data.candidates[0].content.parts[0].text
        return res.json({
            prompt,
            response
        })
    } catch (error:any) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });   
    }
}