import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const isAdmin=TryCatch(
async(req,res,next)=>{
    const {id}= req.query ///api/v1/user/shhsj?key=88 anything after '?' is query and after / is params...

    if(!id) return next(new ErrorHandler("Please login First", 401));

    const user= await User.findById(id);

    if(!user) return next (new ErrorHandler("Invalid Login", 401));

    if(user.role !== "admin") return next(new ErrorHandler("Only admin accessed allowed", 401));

    next(); //when only next() is called, then the next function on chain is called....
}

)//middleware to make sure only admin is allowed

