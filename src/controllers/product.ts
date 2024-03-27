import { TryCatch } from "../middlewares/error.js";
import { Request } from "express";import { BaseQueryType, NewProductBody, SearchRequestQuery } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { faker } from "@faker-js/faker";
import { myCache } from "../app.js";
import { revalidateCache } from "../utils/revalidate.js";

export const newProduct=TryCatch(
    async(req: Request<{},{}, NewProductBody>,res,next)=>{
            const {name, price, stock, category}= req.body

            const photo=req.file;

            if(!photo) return next(new ErrorHandler("Upload Photo", 400))
            if(!name || !price|| !stock || !category) {

                //if any field is missing but photo is available, then photo gets uploaded. so we need to dleete ohoto if any field is missing.
                rm(photo.path,()=>{
                    console.log("photo deleted")
                })
                
                return next(new ErrorHandler("Enter all fields", 400))
            
            }

            await Product.create({
                name, price, stock, category: category.toLowerCase(),
                photo: photo?.path
            })

            await revalidateCache({product: true})

            return res.status(201).json({
                success:true,
                message: "Product created successfully"
            })
    }
)

//Caching should re fetch on add, update, delete , or order 
export const latestProducts= TryCatch(async(req,res,next)=>{

    let products;

    if (myCache.has("latest-products"))
    products= JSON.parse(myCache.get("latest-products")!)

    else{
        products= await Product.find({}).sort({createdAt: -1}).limit(5);

        myCache.set(  "latest-products", JSON.stringify(products))
    }

    



    return res.status(200).json({
        success: true,
   
        products
    })
})

export const getAllCategories= TryCatch(async(req,res,next)=>{

    let categories;

    if(myCache.has("categories"))
    categories= JSON.parse(myCache.get("categories")!)

    else{
        categories= await Product.distinct("category");

        myCache.set("categories", JSON.stringify(categories))
    }
       

        return res.status(200).json({
            success: true,

            categories
        })
})


export const getAdminProducts= TryCatch(async(req,res,next)=>{
    let products;

    if(myCache.has("adminProducts"))
    products= JSON.parse(myCache.get("adminProducts")!)

    else{
        products= await Product.find({}).sort({createdAt: -1});
        myCache.set("adminProducts", JSON.stringify(products))
    }
    return res.status(200).json({
        success: true,
        products
    })
})

export const getSingleProduct= TryCatch(async(req,res,next)=>{


    const id= req.params.id
    let product;
    if(myCache.has(`product-${id}`))
    product= JSON.parse(myCache.get(`product-${id}`)!)

    else{
        product= await Product.findById(id)

        if(!product) return next(new ErrorHandler("Product Not found", 404))

        myCache.set(`product-${id}`, JSON.stringify(product))
    }
   

    return res.status(200).json({
        success: true,
        product
    })
})

export const updateProduct=TryCatch(
    async(req,res,next)=>{
        
        const {id} = req.params

            const {name, price, stock, category}= req.body

            const photo=req.file;

            const product= await Product.findById(id)

            await revalidateCache({product: true, productId: id})

            if(!product) return next(new ErrorHandler("Invalid Product Id", 404));



        
            if(photo) {

                //if any field is missing but photo is available, then photo gets uploaded. so we need to dleete ohoto if any field is missing.
                rm(product.photo,()=>{
                    console.log("photo deleted")
                })
                
                product.photo= photo.path
            
            }

         if(name) product.name= name;
         if(price) product.price= price;
         if(stock) product.stock= stock;
         if(category) product.category= category;

         await product.save()

         return res.status(200).json({
            success: true,
            message: "Product Updated"
         })

    }
)

export const deleteProduct= TryCatch(async(req,res,next)=>{

    const id= req.params.id
    const singleproduct= await Product.findById(id)

    if(!singleproduct) return next(new ErrorHandler("Product Not found",404))

    rm(singleproduct.photo, ()=>{
        console.log("Photo deleted")
    })

    await Product.deleteOne()

    await revalidateCache({product: true, productId: id})
    return res.status(200).json({
        success: true,
        message: "Product Deleted"
    })
})


export const searchAllProducts= TryCatch(async(req:Request<{},{},{}, SearchRequestQuery>,res,next)=>{

    const {search, sort, category, price}= req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8; 
    const skip= limit* (page-1);

        const baseQuery : BaseQueryType= {}
 
        if (search) baseQuery.name= {
            $regex: search,
            $options: "i"
        }
        if (price) baseQuery.price= {
            $lte: Number(price),
        }

        if(category) baseQuery.category= category


    const products= await Product.find(baseQuery).sort(
        sort && {price : sort==="asc" ? 1 : -1} 
    ).limit(limit).skip(skip)


    const filteredOnlyProducts= await Product.find(baseQuery);

    const totalPage= Math.ceil(filteredOnlyProducts.length / limit)


    return res.status(200).json({
        success: true,
        products, 
        totalPage

        
    })
})

// const generateRandomProducts = async (count: number = 100) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\5ba9bd91-b89c-40c2-bb8a-66703408f986.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };

// generateRandomProducts()