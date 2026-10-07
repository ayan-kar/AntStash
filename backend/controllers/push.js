import fs from "fs/promises"
import path from "path"
import { s3, s3_BUCKET } from "../config/aws-config.js"

export default async function PushFile() {
    const repoPath = path.resolve(process.cwd(), ".antstash")  // getting main path of .antstash
    const commitsPath = path.join(repoPath, "commits") // path of commits folder
    try {
        const commitDir = await fs.readdir(commitsPath);  // getting all folders in commits
        for (let commitDirFile of commitDir) {
            const singleCommit = path.join(commitsPath, commitDirFile);  // getting a single folder's path from commits
            const files = await fs.readdir(singleCommit); // geting all the files from that folder
            for (let file of files) {
                let filePath = path.join(singleCommit, file)// getting a single file's path
                let fileContent = await fs.readFile(filePath) // getting a that file's content
                const params = {
                    Bucket: s3_BUCKET,
                    Key: `commits/${commitDirFile}/${file}`,
                    Body: fileContent
                    }
                await s3.upload(params).promise();
            }
        }
        console.log("all commits saved and  pushed in s3")

    } catch (error) {
        console.log("error on Pushing in S3", error)
    }
}
