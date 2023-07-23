import UserModel from "../Models/userModel.js";
import bcrypt from 'bcryptjs';

export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);

        if (user) {
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId, currentUserAdminStatus, password } = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(password, salt);
                req.body.password = hashedPass;
            }
            console.log(req.body);
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true, });
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }

    } else {
        res.status(403).json({ message: "Access denied ! You can only update your profile" });
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId, currentUserAdminStatus } = req.body;

    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json({ message: "User deleted Successfully ." });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json({ message: "Access denied ! You can only delete your profile" });
    }
}
// 1:11 minutes

// Follow user routes below

export const followUser = async (req, res) => {
    const id = req.params.id; // id of the person you want to follow

    const { currentUserId } = req.body; // your id || id of the person who is goind to follow

    if (id === currentUserId) {
        res.status(403).json({ message: "Action Forbidden" });
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);

            if (!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $push: { followers: currentUserId } });
                await followingUser.updateOne({ $push: { following: id } });
                res.status(200).json({ message: "User followed !" });
            } else {
                res.status(403).json({ message: "User is already followed by you !" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const unfollowUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId } = req.body;

    if (currentUserId === id) {
        res.status(403).json({ message: "Action Forbidden !" });
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);

            if (followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $pull: { followers: currentUserId } });
                await followingUser.updateOne({ $pull: { following: id } });
                res.status(200).json({ message: "User unfollowed !" });
            } else {
                res.status(403).json({ message: "User is not followed by you !" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
