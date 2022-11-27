import mongoose from "mongoose"
import AuthRoles from "../utils/authRoles"
import JWT from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto" 

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            maxLength:[50, "Name must be less then 50"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            maxLength:[8, "Email must be atleast 8 Character"],
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(AuthRoles),
            default: AuthRoles.USER,
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: String,

    },
    {
        Timestamps: true,
    },

);



    //Challenge 1 - encrypt password - hooks

    userSchema.pre("save", async function(next){
        if(!this.modified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10)
        next();
    });

export default mongoose.model("User", userSchema)

//users