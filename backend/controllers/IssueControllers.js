import Repository from "../models/repoModel.js"
import Issue from "../models/issueModel.js"
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config()


const createIssue = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params; // repo id

        if (!title || !description) {
            return res.status(400).json({ message: "Title and Description are required" });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Repo ID" });
        }

        const newIssue = new Issue({
            title,
            description,
            repository: id
        });
        const savedIssue = await newIssue.save();

        // Link the issue to the repository's issues array
        await Repository.findByIdAndUpdate(id, { $push: { issues: savedIssue._id } });

        return res.status(201).json(savedIssue);

    } catch (error) {
        console.error("Error in createIssue:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getAllIssues = async (req, res) => {
    try {
        const { id } = req.params; // Repo id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Repo ID" });
        }
        const allIssues = await Issue.find({ repository: id });
        if (!allIssues || allIssues.length === 0) {
            return res.status(404).json({ message: "No issues found for this repository" });
        }
        return res.status(200).json(allIssues);

    } catch (error) {
        console.error("Error in getAllIssues:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getIssueById = async (req, res) => {
    try {
        const { id } = req.params; // issue id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Issue ID" });
        }
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ message: "Issue cant be found" });
        }
        return res.status(200).json(issue);

    } catch (error) {
        console.error("Error in getIssueById:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const upadateIssueById = async (req, res) => {
    try {
        const { id } = req.params; // issue id
        const { title, description, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Issue ID" });
        }

        const singleIssue = await Issue.findById(id);
        if (!singleIssue) {
            return res.status(404).json({ error: "No Issue Found" });
        }
        // Only update fields that are provided
        if (title !== undefined) singleIssue.title = title;
        if (description !== undefined) singleIssue.description = description;
        if (status !== undefined) singleIssue.status = status;
        await singleIssue.save();
        return res.status(200).json({
            message: "Issue Updated",
            singleIssue
        });
    } catch (error) {
        console.error("Error in upadateIssueById:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const deleteIssueById = async (req, res) => {
    try {
        const { id } = req.params; // issue id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Issue ID" });
        }
        const result = await Issue.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Issue not found or already deleted" });
        }
        return res.status(200).json({
            message: "Issue deleted",
            result
        });
    } catch (error) {
        console.error("Error in deleteIssueById:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export default { createIssue, deleteIssueById, getAllIssues, getIssueById, upadateIssueById };