import mongoose, { Schema } from "mongoose"


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    repository: [
        {
            type: Schema.Types.ObjectId,
            ref: "Repository",
        }
    ],

    followed: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    starRepos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Repository",
        }
    ],

})


const User = mongoose.model("User", UserSchema)

export default User;