import fs from "fs/promises"
import path from "path"

export default async function InitRepo(){
    const repoPath= path.resolve(process.cwd(),".antstash")                                      //* D:\code\projects\github\backend
    const commitPath=path.join(repoPath,"commits")
    try {
        await fs.mkdir(repoPath,{recursive:true});
        await fs.mkdir(commitPath,{recursive:true});
        await fs.writeFile(
            path.join(repoPath,"config.json"),
            JSON.stringify({bucket : process.env.S3_BUCKET})
        )
        console.log("Repository Initialising")
    } catch (error) {
     console.log("Error at initialising Repo",error)   
    }
}
