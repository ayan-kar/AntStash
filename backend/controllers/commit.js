import console from "console"
import fs from "fs/promises"
import path from "path"
import { v4 } from "uuid"


export default async function CommitChange(message) {
    const repoPath = path.resolve(process.cwd(), ".antstash")
    const stagingPath = path.join(repoPath, "staging")
    const commitPath = path.join(repoPath, "commits")
    try {
        const commitID = v4();
        console.log(commitID)
        const commitDir = path.join(commitPath, commitID)
        await fs.mkdir(commitDir, { recursive: true })

        const files = await fs.readdir(stagingPath);
        console.log(files)
        for (let file of files)
            await fs.copyFile(
                path.join(stagingPath,file),
                path.join(commitDir,file)
            )
        
            const date =new Date()
        fs.writeFile(path.join(commitDir,"commit.json"),JSON.stringify({commitID,date,message}))
        console.log(`Commit ${commitID} created with meassge ${message}`)


    } catch (error) {
        console.log("problem occured in Commit section ", error)
    }
}







