import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 8
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    profile: {
        url: {
            type: String
        },
        public_id: {
            type: String, 
        }
    },
},{timestamps: true})

export const User = mongoose.model("User", userSchema);