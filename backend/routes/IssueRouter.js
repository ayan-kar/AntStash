
import express from "express"
import IssueControllers from "../controllers/IssueControllers.js"

const IssueRouter = express.Router()

IssueRouter.post("/Issue/create",IssueControllers.createIssue)
IssueRouter.put("/Issue/update/:id",IssueControllers.upadateIssueById)
IssueRouter.delete("/Issue/delete/:id",IssueControllers.deleteIssueById)
IssueRouter.get("/Issue/all/:repoId",IssueControllers.getAllIssues)
IssueRouter.get("/Issue/:id",IssueControllers.getIssueById)




export default IssueRouter;