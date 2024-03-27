import { myCache } from "../app.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { RevalidateCache } from "../types/types.js";

export const revalidateCache=async ({
    product, order, admin, userId, orderId, productId
}: RevalidateCache)=>{
    if(product){
        const productKeys: string []=["latest-products", "categories", "adminProducts"]

        if(typeof productId==="string") productKeys.push(`product-${productId}`)
        myCache.del(productKeys)
        if(typeof productId==="object") productId.forEach((i)=> productKeys.push(`product-${productId}`)) 
        myCache.del(productKeys)
    }

    if(order){
        const  orderKeys: string[]=  ["all-orders", `orders-${userId}`, `order-${orderId}`]

      
        myCache.del(orderKeys)
    }
}