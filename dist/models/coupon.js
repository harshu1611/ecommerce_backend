import mongoose from "mongoose";
const schema = new mongoose.Schema({
    coupon: {
        type: String,
        required: [true, "Please Enter coupon code"],
        unique: true
    },
    amount: {
        type: Number,
        require: [true, "Please enter discount amount"]
    }
});
export const Coupon = mongoose.model("Coupon", schema);
