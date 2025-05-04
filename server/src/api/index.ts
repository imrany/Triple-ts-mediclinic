import express from "express";
import { geminiPrompt, prompt } from "./prompt";
import { getUserDetails, passwordReset, signIn, signUp, verifEmail, updateUserDetails, getUsers, addAllUsersToVillebizWhatsappGroup, deleteUser, migrateUsersToPg } from "./auth";
import { addBusiness, deleteBusiness, getBusiness, getBusinesses, migrateBusinessesToDatabase, searchBusiness, updateBusiness } from "./business";
import { deleteFile, downloadImage, updateFile, uploadFile } from "./images";
import { protectUser } from "../middleware";
import { addProduct, deleteProductByRef, getProductByRef, getProducts, search, updateProductByRef, migrateProductsToPG } from "./products";
import { getTransactions, getTransactionByRef, sendSTK, storeTransaction, migrateTransactionsToPG } from "./transactions/payhero";
import { addOrder, deleteOrderByRef, getOrderByRef, getOrders, getUserOrders, updateOrderByRef, sendNotice, migrateOrdersToPG } from "./orders";
import { subscribe, unSubscribe, sendNotification } from "./subscriptions"
import { deleteNotificationByRef, getNotifications, getAllUserNotifications, sendMessage, getNotificationByRef, migrateNotificationsToPG } from "./notification";
import { getAdverts, handleMigrateAdverts } from "./adverts";
import { streamVideo } from "./videos";

const api=express.Router()

//general routes
api.post("/prompt",prompt)
api.post("/geminiPrompt",geminiPrompt)

//auth routes
api.patch("/auth/password_reset",passwordReset)
api.post("/auth/sign_in",signIn)
api.post("/auth/sign_up",signUp)
// /api/auth/user/example@gmail.com/?usage=log_in or update
api.post("/auth/verify_email",verifEmail)
api.get("/auth/user/:email",protectUser,getUserDetails)
api.patch("/auth/user/:email",protectUser,updateUserDetails)
api.delete("/auth/user/:email",protectUser,deleteUser)
api.get("/users",getUsers)
api.get("/whatsapp/add",addAllUsersToVillebizWhatsappGroup)

//migrations
api.get("/migrate/users",migrateUsersToPg)
api.get("/migrate/businesses",migrateBusinessesToDatabase)
api.get("/migrate/orders",migrateOrdersToPG)
api.get("/migrate/products",migrateProductsToPG)
api.get("/migrate/transactions",migrateTransactionsToPG)
api.get("/migrate/adverts",handleMigrateAdverts)
api.get("/migrate/notifications",migrateNotificationsToPG)

//business routes
api.get("/business",protectUser,getBusinesses)
api.get("/business/:business_name",getBusiness)
api.post("/business/add",protectUser,addBusiness)
/* location is "food" for /api/business/search?location=nairobi*/
api.get("/business/search",searchBusiness)
api.delete("/business/:email",protectUser,deleteBusiness)
api.patch("/business/:email",protectUser,updateBusiness)

//image routes
api.post("/upload/image",protectUser,uploadFile)
api.patch("/update/image/:id",protectUser,updateFile)
api.delete("/delete/image/:id",protectUser,deleteFile)
// /api/thumbnail?id=56767&sz=w500
api.get("/thumbnail",downloadImage)

//video routes
// /api/videos?id=7878787&range=bytes=0-100000 (100kb)
api.get("/videos",streamVideo)

//products routes
api.get("/products",getProducts)
/* category is "food" for /api/products/search?category=food*/
api.get("/products/search",search)
api.post("/products/add",protectUser,addProduct)
api.get("/products/:reference",getProductByRef)
api.delete("/products/:reference",protectUser,deleteProductByRef)
api.patch("/products/:reference",protectUser,updateProductByRef)

//transactions routes
api.post("/pay",sendSTK)
// /api/pay_now?external_reference=245245&amount=1&phone_number=254712345678
api.get("/pay_now",sendSTK)
api.post("/callback",storeTransaction)
api.get("/transactions",getTransactions)
api.get("/transactions/:external_reference",getTransactionByRef)

// orders routes
api.get("/orders", protectUser,getOrders)
api.post("/orders/add",addOrder)
api.get("/orders/:reference", getOrderByRef)
api.get("/userOrders/:email",protectUser,getUserOrders)
api.delete("/orders/:reference", deleteOrderByRef)
api.patch("/orders/:reference", updateOrderByRef)
api.post("/orders/:reference/notify", sendNotice)

// subscription routes
api.post('/subscribe', subscribe)
api.post('/send_notification',sendNotification)
api.post('/unsubscribe',unSubscribe)

//notification
api.get('/notifications/:email',protectUser,getAllUserNotifications)
api.post('/notifications/send',protectUser,sendMessage)
api.get('/notifications',protectUser,getNotifications)
api.get('/notification/:reference',protectUser,getNotificationByRef)
api.delete('/notifications/:reference',protectUser,deleteNotificationByRef)

//adverts
api.get('/adverts',getAdverts)

export default api
