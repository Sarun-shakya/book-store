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
    imageUrl: {
        type: String
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
    }
}, { timestamps: true });

export const Book = mongoose.model("Book", bookSchema);