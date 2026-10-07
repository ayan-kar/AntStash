import express from "express"
import RepoControllers from "../controllers/RepoControllers.js"

const RepoRouter = express.Router()

RepoRouter.post("/repo/create",RepoControllers.createRepo)
RepoRouter.get("/repo/all",RepoControllers.getAllRepo)
RepoRouter.get("/repo/:id",RepoControllers.fetchRepoById)
RepoRouter.get("/repo/name/:name",RepoControllers.fetchRepoByName)
RepoRouter.get("/repo/user/:userId",RepoControllers.fetchRepoForCurrentUser)
RepoRouter.put("/repo/update/:id",RepoControllers.upadateRepoById)
RepoRouter.delete("/repo/delete/:id",RepoControllers.deleteRepoById)
RepoRouter.patch("/repo/toggle/:id",RepoControllers.toggleRepoById)



export default RepoRouter;