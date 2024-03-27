import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { reduceStock } from "../utils/reduceStock.js";
import { revalidateCache } from "../utils/revalidate.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const newOrder= TryCatch(async(req: Request<{},{},NewOrderRequestBody>, res, next)=>{


    const {shippingInfo, orderItems, user, subTotal, tax, shippingCharges, discount, total}= req.body

    if( !shippingInfo || !orderItems || !user || !subTotal || !tax || !total) next(new ErrorHandler("Complete all fields", 400))

    await Order.create({
        shippingInfo, orderItems, user, subTotal, tax, shippingCharges, discount, total
    })

  await  reduceStock(orderItems)

    await  revalidateCache({product: true, order: true, admin: true, userId: user, productId: orderItems.map((i)=>String(i.productId))})

    return res.status(201).json({
        success: true,
        message: "Order Created"
    })

})

export const myOrders= TryCatch(async(req,res,next)=>{
    const {id} = req.query;

    let orders=[];

    if(myCache.has(`orders-${id}`)) orders= JSON.parse(myCache.get(`orders-${id}`)!)

    else{
        orders = await Order.find({user: id})
        myCache.set(`orders-${id}`, JSON.stringify(orders))
    }

    return res.status(201).json({
        success: true,
        orders
    })
})

export const allOrders= TryCatch(async(req,res,next)=>{
    // const {id} = req.query;

    let orders=[];

    if(myCache.has(`all-orders`)) orders= JSON.parse(myCache.get(`all-orders`)!)

    else{
        orders = await Order.find().populate("user", "name")
        myCache.set(`all-orders`, JSON.stringify(orders))
    }

    return res.status(201).json({
        success: true,
        orders
    })
})


export const getSingleOrder= TryCatch(async(req,res,next)=>{
    const {id} = req.params;

    let order

    if(myCache.has(`order-${id}`)) order= JSON.parse(myCache.get(`order-${id}`)!)

    else{
        order = await Order.findById(id)
        myCache.set(`order-${id}`, JSON.stringify(order))
    }

    return res.status(201).json({
        success: true,
        order
    })
})

export const deleteOrder= TryCatch(async(req,res,next)=>{
    const {id} = req.params;

    let order= await Order.findById(id)
    if(!order) return next( new ErrorHandler("Order Not found", 404));

    await order.deleteOne()

    await revalidateCache({product: false, order: true, userId: order.user, orderId: String(order._id)})
  
    return res.status(201).json({
        success: true,
        message: "Order Deleted Successfully"
    })
})

export const updateStatus=TryCatch(async(req,res,next)=>{
    const {id}= req.params

    const order= await Order.findById(id);
    if(!order) return next( new ErrorHandler("Order Not found", 404));
    
    switch (order.status) {
        case "Processing":
            order.status= "Shipped"
            break;

        case "Shipped":
            order.status="Delivered"
    
        default:
            order.status="Delivered"
            break;
    }

    await revalidateCache({product: false, order: true, admin: true, userId: order.user})

    await order.save()

    return res.status(200).json({
        success:true,
        message: "Order processed successfullt."
    })
})