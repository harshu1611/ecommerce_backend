import express from 'express'
import mongoose, { Error } from 'mongoose';
import cors from 'cors'
import { errorMiddleware } from './middlewares/error.js';
import userRoute from './routes/user.js'

import productRoute from './routes/products.js'
import orderRoute from './routes/orders.js'
import paymentRoute from './routes/payment.js'
import statsRoutes from './routes/stats.js'
import NodeCache from 'node-cache';

import { config } from 'dotenv';
import morgan from 'morgan'
import Stripe from 'stripe';

config({
    path: "./.env"
})

const stripeKey= process.env.STRIPE_KEY || ""
export const stripe= new Stripe(stripeKey)
export const myCache= new NodeCache()  //stored data in Ram, in form of key value pair..

const app=express();

const port= process.env.PORT || 4000;


//using routes

mongoose.connect(process.env.MONGO_URI || "",{
    dbName:"Ecommerce"
}).then(c=>console.log("Database Connected")).catch(err=>console.log(err))

app.use(express.json())
app.use(morgan("dev"))
app.use(cors())

app.use('/api/v1/user', userRoute)
app.get("/", (req,res)=>{
    res.send("Api Running")
})

app.use('/api/v1/product', productRoute)
app.use('/api/v1/order', orderRoute)

app.use('/api/v1/payment', paymentRoute)
app.use('/api/v1/dashboard', statsRoutes)


app.use("/uploads", express.static("uploads")) //declaring uploads folder as static
app.use(errorMiddleware)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})  