import express from "express"
import { config } from "dotenv"
import cors from "cors"
import api from "./api"
import { pool } from "./postgres"
config()

const cors_option = {
  origin:[
    "http://localhost:3000",
    "https://triple-ts-mediclinic.com",
    "www.triple-ts-mediclinic.com",
    "https://www.triple-ts-mediclinic.com",
  ],
  methods: ["GET", "POST", "DELETE", "UPDATE", "PATCH", "PUT"]
}

const app =express()

app.use(cors(cors_option))
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended:false}))
app.use("/api",api)

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
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})