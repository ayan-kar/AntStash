import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/userModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config()

const signup = async (req, res) => {
    const { username, password, email } = req.body;
    try {

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });
        console.log(existingUser)
        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        // await newUser.save();
        // console.log(newUser)
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
        return res.status(201).json({ token, userId: newUser._id });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const LoginUser = await User.findOne({ email });
        if (!LoginUser) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, LoginUser.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign(
            { id: LoginUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
        return res.status(201).json({ token, userId: LoginUser._id });

    } catch (error) {
        console.error("Error in Login:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const AllUsers = await User.find({}, "-password").populate("repository") //! problem-> aslo getting private repo
        res.send(AllUsers)

    } catch (error) {
        console.error("Error in getAllUsers fetching:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(id, "-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error("Error in getUserProfile fetching:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!email && !password) {
        return res.status(400).json({ message: "Please provide email or password" });
    }
    try {
        const updateDate = {}
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateDate.password = await bcrypt.hash(password, salt);
        }
        if (email) {
            const existing = await User.findOne({ email, _id: { $ne: id } }); //*  whose id is not my id.
            if (existing) {
                return res.status(400).json({ message: "Email already in use" });
            }
            updateDate.email = email;
        }
        const updatedUser = await User.findByIdAndUpdate(id, updateDate, { new: true }).select("-password"); //* returns the document after the update was applied (the newly updated version).
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(updatedUser);


    } catch (error) {
        console.error("Error in updateUserProfile fetching:", error);
        return res.status(500).json({ message: "Server Error" });
    }

};
const deleteUserProfile = async (req, res) => {

    try {
        const { id } = req.params;
        const { password } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        if (!id || !password) {
            return res.status(400).json({ message: "Please provide password" });
        }

        const existing = await User.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, existing.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        await User.findByIdAndDelete(id)
        return res.status(200).send("User Deleted");

    } catch (error) {
        console.error("Error in DeleteUserProfile fetching:", error);
        return res.status(500).json({ message: "Server Error" });
    }

};

export default { getAllUsers, signup, login, getUserProfile, updateUserProfile, deleteUserProfile };