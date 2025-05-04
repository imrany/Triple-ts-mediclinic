import express from "express";
import { geminiPrompt, prompt } from "./prompt";
import { getUserDetails, passwordReset, signIn, signUp, verifEmail, updateUserDetails, getUsers, addAllUsersToVillebizWhatsappGroup, deleteUser } from "./auth/index2";
import { addBusiness, deleteBusiness, getBusiness, getBusinesses, searchBusiness, updateBusiness } from "./business/index2";
import { deleteFile, downloadImage, updateFile, uploadFile } from "./images";
import { protectUser } from "../middleware";
import { addProduct, deleteProductByRef, getProductByRef, getProducts, search, updateProductByRef } from "./products/index2";
import { getTransactions, getTransactionByRef, sendSTK, storeTransaction } from "./transactions/payhero/index2";
import { addOrder, deleteOrderByRef, getOrderByRef, getOrders, getUserOrders, updateOrderByRef, sendNotice } from "./orders/index2";
import { subscribe, unSubscribe, sendNotification } from "./subscriptions"
import { deleteNotificationByRef, getNotifications, getAllUserNotifications, sendMessage, getNotificationByRef } from "./notification/index2";
import { deleteAdvertByEmail, deleteAdvertByRef, getAdverts, insertAdverts } from "./adverts/index2";
import { streamVideo } from "./videos";

const pg=express.Router()

//general routes
pg.post("/prompt",prompt)
pg.post("/geminiPrompt",geminiPrompt)

//auth routes
pg.patch("/auth/password_reset",passwordReset)
pg.post("/auth/sign_in",signIn)
pg.post("/auth/sign_up",signUp)
// /pg/auth/user/example@gmail.com/?usage=log_in or update
pg.post("/auth/verify_email",verifEmail)
pg.get("/auth/user/:email",protectUser,getUserDetails)
pg.patch("/auth/user/:email",protectUser,updateUserDetails)
pg.delete("/auth/user/:email",protectUser,deleteUser)
pg.get("/users",getUsers)
pg.get("/whatsapp/add",addAllUsersToVillebizWhatsappGroup)

//business routes
pg.get("/business",protectUser,getBusinesses)
pg.get("/business/:business_name",getBusiness)
pg.post("/business/add",protectUser,addBusiness)
/* location is "food" for /pg/business/search?location=nairobi*/
pg.get("/business/search",searchBusiness)
pg.delete("/business/:email",protectUser,deleteBusiness)
pg.patch("/business/:email",protectUser,updateBusiness)

//image routes
pg.post("/upload/image",protectUser,uploadFile)
pg.patch("/update/image/:id",protectUser,updateFile)
pg.delete("/delete/image/:id",protectUser,deleteFile)
// /pg/thumbnail?id=56767&sz=w500
pg.get("/thumbnail",downloadImage)

//video routes
// /api/videos?id=7878787&range=bytes=0-100000 (100kb)
pg.get("/videos",streamVideo)

//products routes
pg.get("/products",getProducts)
/* category is "food" for /pg/products/search?category=food*/
pg.get("/products/search",search)
pg.post("/products/add",protectUser,addProduct)
pg.get("/products/:reference",getProductByRef)
pg.delete("/products/:reference",protectUser,deleteProductByRef)
pg.patch("/products/:reference",protectUser,updateProductByRef)

//transactions routes
pg.post("/pay",sendSTK)
pg.post("/callback",storeTransaction)
pg.get("/transactions",getTransactions)
pg.get("/transactions/:external_reference",getTransactionByRef)

// orders routes
pg.get("/orders", protectUser,getOrders)
pg.post("/orders/add",addOrder)
pg.get("/orders/:reference", getOrderByRef)
pg.get("/userOrders/:email",protectUser,getUserOrders)
pg.delete("/orders/:reference", deleteOrderByRef)
pg.patch("/orders/:reference", updateOrderByRef)
pg.post("/orders/:reference/notify", sendNotice)

// subscription routes
pg.post('/subscribe', subscribe)
pg.post('/send_notification',sendNotification)
pg.post('/unsubscribe',unSubscribe)

//notification
pg.get('/notifications/:email',protectUser,getAllUserNotifications)
pg.post('/notifications/send',protectUser,sendMessage)
pg.get('/notifications',protectUser,getNotifications)
pg.get('/notification/:reference',protectUser,getNotificationByRef)
pg.delete('/notifications/:reference',protectUser,deleteNotificationByRef)

//adverts
pg.get('/adverts',getAdverts)
pg.post('/adverts',insertAdverts)
pg.delete('/advert/:email',deleteAdvertByEmail)
pg.delete('/advert/:reference',deleteAdvertByRef)

export default pg
