import express from "express"
import userRouter from "./userRouter.js"
import RepoRouter from "./RepoRouter.js"
import IssueRouter from "./IssueRouter.js"

const mainRouter = express.Router()

mainRouter.use(userRouter)
mainRouter.use(RepoRouter)
mainRouter.use(IssueRouter)

mainRouter.get("/",(req,res)=>{
        res.send("welcome")
    })


export default mainRouter