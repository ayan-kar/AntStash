
import Repository from "../models/repoModel.js"
import User from "../models/userModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config()



const createRepo = async (req, res) => {
    try {
        const { owner, reponame, issues, content, description, visibility } = req.body;

        if (!reponame) {
            return res.status(400).json({ error: "Repo Name is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Valid Owner ID is required" });
        }

        // dupli repo for same user
        const duplicateRepo = await Repository.findOne({ owner, reponame });
        if (duplicateRepo) {
            return res.status(409).json({ error: `Repository ${reponame} already exists for this user` });
        }

        // new repository
        const newRepository = new Repository({
            owner,
            reponame,
            issues,
            content,
            description,
            visibility,
        });
        const savedRepo = await newRepository.save();

        // Link the repo id
        await User.findByIdAndUpdate(
            owner,
            { $push: { repository: savedRepo._id } }
        );

        return res.status(201).json({
            message: "Repository created successfully",
            RepositoryID: savedRepo._id,
        });

    } catch (error) {
        console.error("Error in createRepo:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// what will happens if logged in user want ti see his/her own
const getAllRepo = async (req, res) => {
    try {
        const AllRepos = await Repository.find({ visibility: "Public" }, "reponame").populate("owner").populate("issues")
        res.status(200).send(AllRepos)

    } catch (error) {
        console.error("Error in fetching all Repository:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
const fetchRepoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Repo ID" });
        }
        const repo = await Repository.findOne({
            _id: id,
            visibility: "Public"
        }).populate("issues").populate("owner");
        if (!repo) {
            return res.status(404).json({ message: "Repo not found Or It Might be Private" });
        }
        return res.status(200).send(repo)

    } catch (error) {
        console.error("Error in fetchRepoById:", error);
        return res.status(500).json({ message: "Server Error" });
    }

};
const fetchRepoByName = async (req, res) => {
    try {
        const { name } = req.params;
        // console.log(name)

        const repo = await Repository.findOne({
            reponame: name,
            visibility: "Public"
        }).populate("issues").populate("owner");
        if (!repo) {
            return res.status(404).json({ message: "Repo not found Or It Might be Private" });
        }
        return res.status(200).send(repo)

    } catch (error) {
        console.error("Error in fetchRepoByName:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

//----------------------------------------------------------------------
// only for logged in user
const fetchRepoForCurrentUser = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const repos = await Repository.find({
            owner: userId,
        }) 
        if (!repos || repos.length == 0) {
            return res.status(404).json({ message: "Repos for this user cant not be found " });
        }
        return res.status(200).send(repos)

    } catch (error) {
        console.error("Error in etchRepoForCurrentUser:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const upadateRepoById =async (req, res) => {  
    const { id } = req.params;
    const {description,content}=req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const updateData = {}
        if (description !== undefined) {
            updateData.description = description;
        }
        if (content !== undefined) {
            updateData.content = content;
        }
        
        const updated = await Repository.findByIdAndUpdate(id, 
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Can't Update" });
        }
        return res.status(200).json(updated);


    } catch (error) {
        console.error("Error in upadateRepoById fetching:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const deleteRepoById = async (req, res) => {
   
    try {
        const { id } = req.params;
        const {reponame}= req.body; 
         if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Repo ID" });
    }

        const repo = await Repository.findById(id)
        if (!repo){
            return res.status(404).json({ message: "Repos for this user cant not be found " });
        }
        if (repo.reponame != reponame) {
            return res.status(400).json({ message: "Repository name for Deletion Must be Accurate" });
        }

        const result = await Repository.findByIdAndDelete(id);
        if (!result) {
            return res.status(500).json({ message: "Repo Cant be deleted" });
        }

        // Remove the repo reference from the owner's repository array
        await User.findByIdAndUpdate(repo.owner, { $pull: { repository: id } });

        return res.status(200).json({ message: "Repository deleted", result });

    } catch (error) {
        console.error("Error in deleteRepoById :", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
const toggleRepoById = async (req, res) => {
    try {
        const { id } = req.params;
        const { toggle } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Repo ID" });
        }
        if (!toggle || !["Public", "Private"].includes(toggle)) {
            return res.status(400).json({ message: "Visibility toggle must be 'Public' or 'Private'" });
        }

        const update = await Repository.findByIdAndUpdate(id, { visibility: toggle }, { new: true, runValidators: true }).select("visibility");
        if (!update) {
            return res.status(404).json({ message: "Cannot Update visibility" });
        }

        return res.status(200).send(update)

    } catch (error) {
        console.error("Error in fetchRepoById:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export default { createRepo, getAllRepo, fetchRepoById, fetchRepoByName, fetchRepoForCurrentUser, upadateRepoById, deleteRepoById,
    toggleRepoById };