import { Category } from "../models/category.model.js";

// create category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        const newCategory = await Category.create({
            name: name.trim(),
            description: description || ""
        })

        res.status(201).json({
            success: true,
            data: newCategory,
            message: "Category created successfully"
        });
    } catch (error) {
        console.error("Error in createCategory:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error("Error in getAllCategories:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// get category by id
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error("Error in getCategoryById:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// update category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, description } = req.body;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (name) {
            const existingCategory = await Category.findOne({ name: name.trim() });

            if (existingCategory && existingCategory._id.toString() !== id) {
                return res.status(400).json({
                    message: "Category name already exists"
                });
            }
            category.name = name;
        }

        if (description !== undefined) {
            category.description = description;
        }

        const updatedCategory = await category.save();

        res.status(200).json({
            success: true,
            data: updatedCategory,
            message: "Category updated successfully"
        })
    } catch (error) {
        console.error("Error in updateCategory:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// delete category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteCategory:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}