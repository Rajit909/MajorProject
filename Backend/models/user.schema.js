import mongoose from "mongoose"

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
            select: false
        }
    }
)