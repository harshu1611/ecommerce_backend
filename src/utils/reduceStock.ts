import { Product } from "../models/product.js";
import { OrderItemsType } from "../types/types.js";

//A functionn to reduce stock of each item that is being ordered
export const reduceStock=async(orderItems: OrderItemsType[])=>{
for (let i=0 ; i<orderItems.length; i++){
    const order= orderItems[i];
    const product= await Product.findById(order.productId)

    if(!product) throw new Error("Product Not Found")

    product.stock -= order.quantity

    await product.save();
}
}