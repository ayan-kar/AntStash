import mongoose, { Schema } from "mongoose"

const RepoSchema = new mongoose.Schema({
    reponame: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    content: [
        {
            type: String
        }
    ],
    visibility:
    {
        type: String,
        enum: ["Public", "Private"]
    },
    issues: [
        {
            type: Schema.Types.ObjectId,
            ref: "Issue"
        }
    ],

    owner:
    {
        ref: "User",
        type: Schema.Types.ObjectId,
        required: true
    }
})


const Repository = mongoose.model("Repository", RepoSchema)

export default Repository;