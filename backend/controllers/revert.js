import fs from "fs"
import path from "path"
import { promisify } from "util"

const readdir=promisify(fs.readdir);
const copyFile=promisify(fs.copyFile);

export default async function RevertChange(commmitID){
    const repoPath = path.resolve(process.cwd(),".antstash");  
    const commitPath = path.join(repoPath,"commits");
    try {
        const commitDir = path.join(commitPath,commmitID)
        const files = await readdir(commitDir)
        const parentDir = path.resolve(repoPath,"..")
        for (let file of files){
            await copyFile(path.join(commitDir,file),path.join(parentDir,file))
        }
        console.log("Revert Changes Successfull")
    } catch (error) {
        console.log("Error occured in Reverting Back", error)
    }
}
