import User from "../models/user.schema"

import asyncHandler from "../services/asyncHandler"

import CustomError from "../utils/customError"




export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 *60 *60 * 1000),
    httpOnly: true,




}


export const signUp = asyncHandler(async(req, res)=>{
    const {name, email, password} = req.body

    if (!name || !email || !password) {
        throw new CustomError("")
    }

    const existingUser = await User.findOne({email})

    if (existingUser) {
        throw new CustomError("User already exists")
    }


    const user = await User.create({
        name,
        email,
        password
    })


    const token = user.getJwtToken()
    console.log(user)
    user.password = undefined

    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        success:true,
        token,
        user
    })


})

export const login = asyncHandler(async(req,res)=>{
    const {name, email, password} = req.body

    if (!name || !email || !password) {
        throw new CustomError("Please fill all fields", 400)
    }

    const user = User.findOne({email}).select("+ password")

    if (!user) {
        throw new CustomError("Invalid credentials", 400)
    }

    const ispasswordMatched = await user.comparePassword(password)

    if (ispasswordMatched) {
        const token = user.getJwtToken()
        user.password = undefined
        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            success: true,
            token,
            user
        })
    }

    throw new CustomError('Invalid credentials - pass',400)

})


export const logout = asyncHandler(async(_req, res)=>{

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })

})

export const forgotPassword = asyncHandler(async(req,res)=>{

})