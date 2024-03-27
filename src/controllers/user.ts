import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
import { supabase } from "../utils/supabase.js";





export const Login= TryCatch(
    async (req, res: Response, next: NextFunction)=>{

         
        
            // return next(new ErrorHandler("cUSTOM ERROR", 400)); // WHEN NO OTHER Function is defined, next function automaticallyb calls error handler
            const {email,password}= req.body

            
                const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                    password: password,
                })

             
            let user= await User.findById(data.user?.id);

            if(user){
               let session= data.session
                res.status(201).json({
                    session
                })
                console.log('user found')
            }
            if(!user){
                res.status(404).json({
                    error,
                    message: "User Not Found"
                })
                console.log(error)
            }



            // if(user){
            //     res.status(200).json({
            //         success: true,
            //         message: `Welcome, ${user.name}`
            //     })
            // }



            
        

        
        }
)

export const newUser= TryCatch(
    async (req, res: Response, next: NextFunction)=>{

         
        
            // return next(new ErrorHandler("cUSTOM ERROR", 400)); // WHEN NO OTHER Function is defined, next function automaticallyb calls error handler
            const {name,email,photo,role,password , _id}= req.body

            
            if( !name || !email || !photo ){
                return next(new ErrorHandler("Please fill all fields", 400))
            }
        
            let user= await User.findById(_id);

            if(user){
           
                res.status(200).json({
                    success: true,
                    message: `Welcome, ${user.name}`,
                    
                })
            }

           else{
          
            user= await User.create({
            name,email,photo,role,_id
           })

        //    return res.status(200).json({
        //     session
        //    })
        
        }
        
            
      

        
        }
)

export const getAllUsers=TryCatch(async(req,res,next)=>{
    const users= await User.find({});
    return res.status(200).json({
        success:true,
        users
    })
})

export const getUser=TryCatch(async(req,res,next)=>{
    const id= req.params.id
    const user= await User.findById(id);

    if(!user) return next(new ErrorHandler("Invalid Id", 400))
   else  return res.status(200).json({
        success:true,
        user
    })
})

export const deleteUser=TryCatch(async(req,res,next)=>{
    const id= req.params.id
    const user= await User.findById(id);

    if(!user) return next(new ErrorHandler("Invalid Id", 400))

    await user.deleteOne()
     return res.status(200).json({
        success:true,
        message: "User Deleted Succesfully"
    })
})

