import { myCache } from "../app.js";
export const revalidateCache = async ({ product, order, admin, userId, orderId, productId }) => {
    if (product) {
        const productKeys = ["latest-products", "categories", "adminProducts"];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        myCache.del(productKeys);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${productId}`));
        myCache.del(productKeys);
    }
    if (order) {
        const orderKeys = ["all-orders", `orders-${userId}`, `order-${orderId}`];
        myCache.del(orderKeys);
    }
};
