import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwt.js';
import { uploadOnCloudinary, deleteOnCloudinary } from '../config/cloudinary.js';

// signup
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profileData = { url: "", public_id: "" };
        if (req.file) {
            const imageData = await uploadOnCloudinary(req.file.path);
            if (imageData) {
                profileData.url = imageData.url;
                profileData.public_id = imageData.public_id;
            }
        }

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            profile: profileData
        });

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profile: newUser.profile,
            message: "New user registered successfully"
        });

    } catch (error) {
        console.log("Error in register controller:", error);
        if (!res.headersSent) {  // Safety check
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

//login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        generateToken(user._id, res);

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profile?.url,
            message: "User logged in successfully"
        });
    } catch (error) {
        console.error("Error in login controller");
        res.status(500).json({
            message: "Internal Server error"
        });
    }
}

//logout
export const logout = (_, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
        message: "Logged out successfully"
    });
};

// get profile
export const profile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password -role");
        if (!user) {
            return res.status(400).json({
                message: "User not logged in"
            })
        } else {
            return res.status(200).json({
                success: true,
                data: user,
                message: "User profile fetched successsfully"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// update profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, email, password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        if (fullName) {
            user.fullName = fullName;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email) {
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }else{
                user.email = email;
            }
        }

        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        if (req.file) {
            // Delete old image on Cloudinary if exists
            if (user.profile?.public_id) {
                await deleteOnCloudinary(user.profile.public_id);
            }

            // Upload new image
            const imageData = await uploadOnCloudinary(req.file.path);
            if (imageData) {
                user.profile = {
                    url: imageData.url,
                    public_id: imageData.public_id
                };
            }
        }

        const updatedUser = await user.save();

        return res.status(201).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profile: updatedUser.profile,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}