import Product from "../models/productSchema.js"
import Coupen from "../models/coupon.schema.js"
import Order from "../models/order.schema.js"
import asyncHandler from "../services/asyncHandler.js"
import CustomError from "../utils/customError.js"
import razorpay from "../config/razorpay.config.js"


/**********************************************************
 * @GENEARATE_RAZORPAY_ID
 * @route https://localhost:5000/api/order/razorpay
 * @description Controller used for genrating razorpay Id
 * @description Creates a Razorpay Id which is used for placing order
 * @returns Order Object with "Razorpay order id generated successfully"
 *********************************************************/

export const genrateRazorpayOrderId = asyncHandler( async(req,res) =>{
    // Get product and coupen from frontend 

    // verify product price from backend

    // make DB query to get all products and info

    let totalAmount;
    // Total Amount and final Amount
    // coupen check - DB
    // Discount
    // final Amount = totalAmount - Discount

    const options = {
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`
    }

    const order = await razorpay.orders.create(options)

    // if order does not exist
    // success then , send it to frontEnd

})