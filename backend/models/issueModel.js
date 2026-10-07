import mongoose,{Schema} from "mongoose"



const IssueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required:true
    },
    status: {
            type: String,
            default:"open",
            enum:["open","closed"]
        },
    repository: 
        {
            type:Schema.Types.ObjectId,
            ref:"Repository",
            required:true
        }
})


const Issue = mongoose.model("Issue",IssueSchema)

export default Issue;