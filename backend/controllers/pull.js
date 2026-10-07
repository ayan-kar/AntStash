import fs from "fs/promises"
import path from "path"
import { s3, s3_BUCKET } from "../config/aws-config.js"

export default async function PullFile() {
   const repopath = path.resolve(process.cwd(), ".antstash")
   const commitPath = path.join(repopath, "commits")
   
   try {
           const data = await s3.listObjectsV2({
               Bucket: s3_BUCKET,
               Prefix: "commits/",
           }).promise()
           const objects = data.Contents;
           for (const object of objects) {
               const key = object.Key;
               const commitDir = path.join(
                   commitPath,
                   path.dirname(key)
                   .split("/").pop()
               );
               await fs.mkdir(commitDir, { recursive: true });
   
               const params = {
                   Bucket: s3_BUCKET,
                   Key: key,
               };
   
               const fileContent = await s3.getObject(params).promise();
               await fs.writeFile(path.join(repopath, key), fileContent.Body);
               await fs.writeFile(path.join(repopath, key), fileContent.Body);
            }
            console.log("All commits pulled from S3.");
       } catch (err) {
           console.error("Unable to pull : ", err);
       }
   }
   
 