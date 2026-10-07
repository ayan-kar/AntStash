import fs from "fs/promises"
import path from "path"

export default async function AddFile(file){
    const repoPath = path.resolve(process.cwd(),".antstash")
    const stagingFile =path.join(repoPath,"staging")
    try {
        await fs.mkdir(stagingFile,{recursive:true})
        const fileName = path.basename(file);
        await fs.copyFile(file,path.join(stagingFile,file)) // copy the files into staging folder with specific to that file
        console.log(`${file} is added to staigng area`);

    } catch (error) {
        console.log("Error while addding Fie :",error)
    }
}
  