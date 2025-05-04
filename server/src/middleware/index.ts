import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const JWT_SECRET=process.env.JWT_SECRET as string
const ADMIN_JWT_SECRET=process.env.ADMIN_JWT_SECRET as string

export const protectUser = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            verify(token, JWT_SECRET); // Use environment variable for security
            return next(); // Stop further execution and pass control
        } catch (error: any) {
            console.error("Token verification error:", error.message);
            return res.status(401).json({ error: 'Not Authorized' }); // Ensure response stops execution
        }
    }

    // Handle case where token is not provided
    if (!token) {
        return res.status(401).json({ error: 'No Token Available' }); // Use return to stop execution
    }
};


export const protectAdmin=async(req: Request, res:Response, next:NextFunction)=>{
    let token; 

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token=req.headers.authorization.split(' ')[1]
            verify(token,ADMIN_JWT_SECRET);
            return next()
        }catch (error:any){
            return res.status(401).json({error:'Not Authorised'})
        }
    }
    
    if(!token){
      return res.status(401).json({error:'No Token Available'})
    }
};
