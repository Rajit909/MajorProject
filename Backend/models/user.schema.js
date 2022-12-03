import mongoose from "mongoose"
import AuthRoles from "../utils/authRoles"
import JWT from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto" 
import config from "../config/index"

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
        if(!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10)
        next();
    });

    //add more features
    userSchema.methods = {
        //compare password
        comparePassword: async function(enteredPassword){
            return await bcrypt.compare(enteredPassword, this.password)
        },

        //genrate jwt token
        getJwtToken: function(){
            return JWT.sign(
                {
                    _id: this._id,
                    role: this.role,
                },
                config.JWT_SECRET,
                {
                    expiresIn: config.JWT_EXPIRY
                },
            )
        },

        generateForgotPasswordToken: function(){
            const forgotToken = crypto.randomBytes(20).toString('hex')

            // step 1 - save to DB
            this.forgotPasswordToken = crypto
            .createHash("sha256")
            .update(forgotToken)
            .digest("hex")

            this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000
            //step -2 return values to user
            
            return forgotToken

        },

        



    }

    
export default mongoose.model("User", userSchema)

//users