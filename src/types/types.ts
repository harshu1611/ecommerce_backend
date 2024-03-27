import { NextFunction, Response, Request } from "express"

export interface NewUserBody{
    name: string,
    email: string,
    photo: string, 
    role: string,
    _id: string,

}

export type controllerType=(req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string,any>>>

export interface NewProductBody{
    name: string,
    photo: string, 
    price: number,
    stock: number,
    category: string,
}

export type SearchRequestQuery={
    search? : string,
    price ? : string,
    category?: string,
    sort? : string,
    page? : string

}

export type BaseQueryType={
        name? : {
            $regex: string, $options: string
        }, 
        price? : {
            $lte: number

        },

        category? : string
}


export type RevalidateCache={
    product? : boolean,
    order? : boolean,
    admin? : boolean,
    userId? : string,
    orderId? : string,
    productId? : string | string[]
}
export type OrderItemsType={
    name: string,
    photo: string, price: number,
    quantity: number,
    productId: string
}
export type ShippingInfoType={
    addrsss: string,
    city: string, state: string,
    country: string,
    pinCode: number
}
export interface NewOrderRequestBody{
    shippingInfo:ShippingInfoType,
    user : string,
    subTotal: number,
    tax: number,
    shippingCharges: number,
    discount: number,
    total: number,

    orderItems: OrderItemsType[]
}