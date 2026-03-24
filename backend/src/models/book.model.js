import mongoose from "mongoose";
import { Schema } from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: {
            type: String
        },
        public_id: {
            type: String, 
        }
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be positive"]
    },
    pages: {
        type: Number,
        min: [1, "Pages must be at least 1"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Stock cannot be negative"]
    }
}, { timestamps: true });

export const Book = mongoose.model("Book", bookSchema);