import express from 'express'
// import { deleteUser, getAllUsers, getUser, newUser } from '../controllers/user.js';
import { isAdmin } from '../middlewares/auth.js';
import { applyDiscount, createPaymentIntent, deleteCoupon, getAllCoupons, newCoupon } from '../controllers/payment.js';

const app=express.Router();


// '/user/new' used as prefix in app.ts in app.use()
// function of each api is in controllers 
app.post("/create", createPaymentIntent)

app.post("/coupon/new",isAdmin, newCoupon)

app.get("/discount", applyDiscount)

app.get("/coupon/all", isAdmin,getAllCoupons)

app.route('/:id').delete(isAdmin, deleteCoupon)


export default app;
