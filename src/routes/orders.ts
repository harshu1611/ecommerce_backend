import express from 'express'
import { isAdmin } from '../middlewares/auth.js';
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, updateStatus } from '../controllers/order.js';

const app=express.Router();


// '/user/new' used as prefix in app.ts in app.use()
// function of each api is in controllers 


app.post("/new", newOrder)
app.get("/myOrders", myOrders)
app.get("/all-orders", isAdmin, allOrders)
app.route("/:id").get(getSingleOrder).put(isAdmin, updateStatus).delete(isAdmin, deleteOrder)

export default app;
