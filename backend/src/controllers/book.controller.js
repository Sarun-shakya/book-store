import { Book } from '../models/book.model.js';
import { uploadOnCloudinary, deleteOnCloudinary } from '../config/cloudinary.js';

// add book
export const addBook = async (req, res) => {
    try {
        const { title, author, description, price, pages, stock, category } = req.body;

        if (!title || !author || !description || !price || !category || stock === undefined) {
            return res.status(400).json({
                message: "Title, author, description, price, category and stock are required"
            });
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                message: "Price must be positive"
            });
        }

        if (pages !== undefined && Number(pages) < 1) {
            return res.status(400).json({
                message: "Pages must be at least 1"
            });
        }

        if (stock !== undefined && Number(stock) < 0) {
            return res.status(400).json({
                message: "Stock must be at least 0"
            });
        }

        let imageData = { url: "", public_id: "" };
        if (req.file) {
            const uploaded = await uploadOnCloudinary(req.file.path);
            if (uploaded) {
                imageData.url = uploaded.url;
                imageData.public_id = uploaded.public_id;
            }
        }

        const newBook = await Book.create({
            title: title.trim(),
            author: author.trim(),
            description: description.trim(),
            price,
            pages: pages || 1,
            stock: stock || 0,
            category,
            image: {
                url: imageData.url,
                public_id: imageData.public_id
            }
        });

        res.status(201).json({
            success: true,
            data: newBook,
            message: "Book added successfully"
        });
    } catch (error) {
        console.log("Error in add Book controller", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// update book
export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, description, price, pages, category, stock } = req.body;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            })
        }
        if (title) {
            book.title = title.trim();
        }

        if (author) {
            book.author = author.trim();
        }

        if (description) {
            book.description = description.trim();
        }

        if (price !== undefined) {
            if (Number(price) < 0) {
                return res.status(400).json({
                    message: "Price must be positive"
                });
            }
            book.price = Number(price);
        }

        if (pages !== undefined) {
            if (Number(pages) < 1) {
                return res.status(400).json({
                    message: "Pages must be at least 1"
                });
            }
            book.pages = Number(pages);
        }

        if (category) {
            book.category = category;
        }

        if (stock !== undefined) {
            if (Number(stock) < 0) {
                return res.status(400).json({
                    message: "Stock cannot be negative"
                });
            }
            book.stock = Number(stock);
        }

        if (req.file) {
            const imageData = await uploadOnCloudinary(req.file.path);

            if (!imageData) {
                return res.status(500).json({
                    message: "Image upload failed"
                });
            }

            if (book.image?.public_id) {
                await deleteOnCloudinary(book.image.public_id);
            }

            book.image.url = imageData.url;
            book.image.public_id = imageData.public_id;
        }

        const updatedBook = await book.save();
        res.status(200).json({
            success: true,
            data: updatedBook,
            message: "Book updated successfully"
        });
    } catch (error) {
        console.log("Error in updateBook: ", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// delete book
export const deleteBook = async (req, res) => {
    try {

    } catch (error) {

    }
}

// get all books
export const getAllBooks = async (req, res) => {
    try {

    } catch (error) {

    }
}

// get all books for admin
export const getAllBooksAdmin = async (req, res) => {
    try {

    } catch (error) {

    }
}

// get book by id
export const getBookById = async (req, res) => {
    try {

    } catch (error) {

    }
}

// seach/filter book
export const searchBook = async (req, res) => {
    try {

    } catch (error) {

    }
}