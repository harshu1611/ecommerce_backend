import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
export const getDashBoardStats = TryCatch(async (req, res, next) => {
    let stats = {};
    if (myCache.has("admin-stats"))
        stats = JSON.parse(myCache.get("admin-stats"));
    else {
        const today = new Date();
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        // const endOfThis
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        const thoisMonthProducts = await Product.find({
            createdAt: {
                $gte: startOfThisMonth
            }
        });
    }
    return res.status(200).json({
        success: true,
        stats
    });
});
export const getPieChart = TryCatch(async (req, res, next) => {
});
export const getBarChart = TryCatch(async (req, res, next) => {
});
export const getLineChart = TryCatch(async (req, res, next) => {
});
